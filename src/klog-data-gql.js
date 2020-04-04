import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
const gql = (literals, ...arg) => {
  let result = 'query{';
  let i = 0;
  while (i < literals.length) {
    result += literals[i++];
    if (i < arg.length) {
      result += arg[i];
    }
  }
  result += '}';
  return result.replace(/^\s*/mg, '');
}

class KlogDataGql extends PolymerElement {

  static get is() { return 'klog-data-gql'; }

  static get properties() {
    return {
      server: {
        type: String,
        value: "https://klog.leanapp.cn/?"
      },
      auto: {
        type: Boolean,
        value: false
      },
      lastResponse: {
        type: Object,
        notify: true
      },
      loading: {
        type: Boolean,
        notify: true
      },
      query: {
        type: String,
        notify: true,
        observer: 'autoLoad'
      }
    }
  }

  autoLoad() {
    if (this.auto) this.load();
  }

  load() {
    return this.request(this.query);
  }

  request(query) {
    let server = this.server;
    //https://klog.leanapp.cn/?
    return fetch(server, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/graphql',
        'X-LC-Session': AV.User.current() && AV.User.current().getSessionToken()
      },
      body: query
    })
      .then(res => res.json())
      .then(data => this.handle(data));
  }

  handle(data) {
    this.lastResponse = data.data;
    return data.data;
  }

}

window.customElements.define(KlogDataGql.is, KlogDataGql);
