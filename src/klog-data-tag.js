import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import './klog-data-gql.js';
class klogDataTag extends PolymerElement {
  static get is() { return 'klog-data-tag'; }

  list() {
    let query = new AV.Query('Article');
    query.select(['tags']);
    if (!this.userinfo || !this.userinfo.publicinfo) {
      setTimeout(() => this.list(), 100);
      return;
    }
    let author = AV.Object.createWithoutData('UserPublic', this.userinfo.publicinfo.id);
    query.equalTo('author', author);
    query.exists('tags');
    query.limit(1000);
    query.descending('createdAt');
    return query.find()
      .then(articles => {
        let tags = new Set();
        for (let article of articles) {
          for (let tag of article.get('tags')) {
            tags.add(tag);
          }
        }
        return Array.from(tags);
      });
  }
}
window.customElements.define(klogDataTag.is, klogDataTag);
