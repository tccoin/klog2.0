import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import './klog-data-list.js';

class KlogDataTimeline extends PolymerElement {
  static get template() {
    return html`
    <klog-data-list id="list" type="timeline" last-response="{{lastResponse}}" loading="{{loading}}" keyword="{{keyword}}" key="date"></klog-data-list>
`;
  }

  static get is() { return 'klog-data-timeline'; }

  static get properties() {
    return {
      pageSize: {
        type: Number,
        value: 10
      },
      loading: {
        type: Boolean,
        value: true,
        notify: true,
      },
      pageNumber: {
        type: Number,
        observer: 'load'
      },
      lastResponse: {
        type: Array,
        notify: true
      },
      keyword: {
        type: String
      },
      hasMore: {
        type: Boolean
      },
      lastResponseTimestamp: {
        type: Number
      }
    }
  }

  load() {
    this.$.list.select = ['type', 'detail', 'referTo', 'author', 'title', 'text', 'createTime', 'markdown', 'type', 'image', 'topic', 'path', 'collection', 'date', 'attachments', 'collection', 'tags'];
    this.$.list.include = ['author', 'topic'];
    return this.$.list.load();
  }
}

window.customElements.define(KlogDataTimeline.is, KlogDataTimeline);
