import { KlogDataMixin } from './klog-data-mixin.js';

const KlogDataCommentMixin = (superClass) => class extends KlogDataMixin(superClass) {

  loadComment(articleId) {
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
      return result;
    }).catch(err => {
      if (err) console.log(err);
    });
  }

  createComment(articleId, authorId, markdown) {
    let comment = new AV.Object('Comment');
    comment.set('article', AV.Object.createWithoutData('Article', articleId));
    comment.set('author', AV.Object.createWithoutData('UserPublic', authorId));
    comment.set('markdown', markdown);
    return comment.save().catch(err => {
      this.errorCode = '403';
    });
  }

  updateComment(commentId, markdown) {
    let comment = AV.Object.createWithoutData('Comment', commentId);
    comment.set('markdown', markdown);
    return comment.save();
  }

  removeComment(commentId) {
    let comment = AV.Object.createWithoutData('Comment', commentId);
    return comment.destroy();
  }
}

export { KlogDataCommentMixin };
