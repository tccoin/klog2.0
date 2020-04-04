import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import './klog-data-gql.js';
class klogDataCollection extends PolymerElement {
  static get is() { return 'klog-data-collection'; }

  static get properties() {
    return {
      lastResponse: {
        type: Array,
        notify: true
      },
      userinfo: {
        type: Object
      },
      login: {
        type: Boolean,
        value: false,
        observe: '_list'
      },
      disabled: {
        type: Boolean,
        value: false
      }
    }
  }

  _list() {
    if (this.login && !this.disabled) {
      this.list();
    }
  }

  list() {
    let query = new AV.Query('Article');
    query.select(['collection']);
    if (!this.userinfo || !this.userinfo.publicinfo) {
      setTimeout(() => this.list(), 100);
      return;
    }
    let author = AV.Object.createWithoutData('UserPublic', this.userinfo.publicinfo.id);
    query.equalTo('author', author);
    query.ascending('createdAt');
    query.limit(1000);
    return query.find()
      .then(articles => {
        let collections = new Set(['笔记', '日常', '项目']);
        for (let article of articles) {
          if (article.get('collection')) {
            collections.add(article.get('collection'));
          }
        }
        this.disabled = true;
        return this.lastResponse = Array.from(collections);
      });
  }
}
window.customElements.define(klogDataCollection.is, klogDataCollection);
