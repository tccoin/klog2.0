import { KlogDataMixin } from './klog-data-mixin.js';
import { KlogDataMessageMixin } from './klog-data-message-mixin.js';

const KlogDataCommentMixin = (superClass) => class extends KlogDataMessageMixin(KlogDataMixin(superClass)) {

  loadComments(articleId) {
    let query = new AV.Query('Comment');
    query.select(['author', 'replyTo', 'replyToAuthor', 'markdown']);
    query.include('author', 'replyToAuthor');
    query.descending('createdAt');
    query.equalTo('article', AV.Object.createWithoutData('Article', articleId));
    return query.find().then((data) => {
      let result = [];
      for (let comment of data) {
        result.push(comment.toJSON());
      }
      return this._processComment(result);
    }).catch(err => {
      if (err) console.log(err);
    });
  }

  _generateEmptyComment(commentId) {
    return {
      objectId: commentId,
      author: {
        displayName: '匿名',
        avatarUrl: 'https://storage.krrr.party/storage/klog-avatar/default_avatar.jpg',
        objectId: ''
      },
      markdown: '评论已删除。',
      secondary: [],
      deleted: true
    }
  }

  _processComment(data) {
    const result = {};
    const primary = data.filter(x => !(x.replyTo));
    const secondary = data.filter(x => x.replyTo);
    for (let comment of primary) {
      comment.secondary = [];
      result[comment.objectId] = comment;
    }
    for (let comment of secondary) {
      if (!(comment.replyTo.objectId in result)) {
        // primary comment is deleted
        result[comment.replyTo.objectId] = this._generateEmptyComment(comment.replyTo.objectId);
      }
      if (result[comment.replyTo.objectId].deleted) {
        // delete replyToAuthor if primary comment is deleted
        comment.replyToAuthor = result[comment.replyTo.objectId].author;
      }
      result[comment.replyTo.objectId].secondary.push(comment);
    }
    const keys = Object.keys(result);
    const compareLatestAhead = (x, y) => Date.parse(y.createdAt) - Date.parse(x.createdAt);
    const compareOldestAhead = (x, y) => Date.parse(x.createdAt) - Date.parse(y.createdAt);
    const result1 = keys.map(x => result[x]).sort(compareLatestAhead);
    for (let comment of result1) {
      comment.secondary.sort(compareOldestAhead);
    }
    return result1;
  }

  async createComment(articleId, articleAuthorId, commentAuthorId, markdown, replyToId = null, replyToAuthorId = null) {
    let comment = new AV.Object('Comment');
    comment.set('article', AV.Object.createWithoutData('Article', articleId));
    comment.set('author', AV.Object.createWithoutData('UserPublic', commentAuthorId));
    comment.set('markdown', markdown);
    if (replyToId) comment.set('replyTo', AV.Object.createWithoutData('Comment', replyToId));
    if (replyToAuthorId) comment.set('replyToAuthor', AV.Object.createWithoutData('UserPublic', replyToAuthorId));
    await comment.save();
    comment = comment.toJSON();
    const channels = [
      `comment-all`,
      `author-user-${articleAuthorId}`,
      `comment-article-${articleId}`,
      `comment-user-${commentAuthorId}`
    ];
    if (replyToAuthorId) {
      channels.push(`reply-user-${replyToAuthorId}`);
      await this.createMessage('comment-reply', commentAuthorId, channels, {}, articleId, comment.objectId);
    } else {
      await this.createMessage('comment-new', commentAuthorId, channels, {}, articleId, comment.objectId);
    }
    return comment;
  }

  updateComment(commentId, markdown) {
    let comment = AV.Object.createWithoutData('Comment', commentId);
    comment.set('markdown', markdown);
    return comment.save();
  }

  deleteComment(commentId) {
    let comment = AV.Object.createWithoutData('Comment', commentId);
    return comment.destroy();
  }
}

export { KlogDataCommentMixin };
