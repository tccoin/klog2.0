import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
class KlogDataComment extends PolymerElement {

  static get is() { return 'klog-data-comment'; }

  load(articleId) {
    let query = new AV.Query('Comment');
    query.select(['author', 'replyTo', 'replyToAuthor', 'markdown']);
    query.include('author');
    query.descending('createdAt');
    query.equalTo('article', AV.Object.createWithoutData('Article', articleId));
    return query.find().then((data) => {
      let result = [];
      console.log(data);
      for (let comment of data) {
        result.push(comment.toJSON());
      }
      return result;
    }).catch(err => {
      if (err) console.log(err);
    });
  }

  create(articleId, authorId, ) {

  }

}

window.customElements.define(KlogDataComment.is, KlogDataComment);
