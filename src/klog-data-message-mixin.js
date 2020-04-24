import { KlogDataMixin } from './klog-data-mixin.js';

const KlogDataMessageMixin = (superClass) => class extends KlogDataMixin(superClass) {

  loadMessages(toIds, userPublicId) {
    let query = new AV.Query('Message');
    query.select(['from', 'type', 'checked',
      'article.path', 'article.author.displayName', 'article.title',
      'comment.markdown']);
    query.include('from', 'article', 'comment');
    query.descending('createdAt');
    query.containedIn('to', toIds);
    return query.find().then((data) => {
      let result = [];
      for (let message of data) {
        try {
          message = message.toJSON();
          message = this._processMessage(message, userPublicId);
          result.push(message);
        } catch (err) { console.error(err); }
      }
      return result
    }).catch(err => {
      if (err) console.log(err);
    });
  }

  _processMessage(message, userPublicId) {
    // console.log(message);
    const server = window.location.origin + window.location.pathname;
    if (message.type == 'article-comment' || message.type == 'article-reply') {
      message.common = true;
      message.articleComment = true;
      let articleAuthor = ` ${message.article.author.displayName} `;
      if (userPublicId == message.article.author.objectId) articleAuthor = '你';
      if (message.type == 'article-comment') message.info = `${message.from.displayName} 评论了${articleAuthor}的文章《${message.article.title}》`;
      if (message.type == 'article-reply') message.info = `${message.from.displayName} 在 ${articleAuthor} 的文章《${message.article.title}》下回复了你`;
      message.link = `article/${message.article.path}`;
      message.text = message.comment.markdown;
    }
    return message;
  }

  createMessage(type, fromId, toIds, articleId = null, commentId = null) {
    let message = new AV.Object('Message');
    message.set('type', type);
    message.set('from', AV.Object.createWithoutData('UserPublic', fromId));
    message.set('to', toIds);
    if (articleId) message.set('article', AV.Object.createWithoutData('Article', articleId));
    if (commentId) message.set('comment', AV.Object.createWithoutData('Comment', commentId));
    return message.save().catch(err => {
      this.errorCode = '403';
    });
  }

  updateMessage(messageId, content, link) {
    let message = AV.Object.createWithoutData('Message', messageId);
    message.set('content', content);
    message.set('link', link);
    return message.save();
  }

  deleteMessage(messageId) {
    let message = AV.Object.createWithoutData('Message', messageId);
    return message.destroy();
  }
}

export { KlogDataMessageMixin };
