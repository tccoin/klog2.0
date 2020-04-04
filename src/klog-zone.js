import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './klog-style-layout.js';
import './klog-style-scrollbar.js';
import './klog-icons.js';
import './klog-data-list.js';
import './klog-timeline-item.js';

class KlogZone extends PolymerElement {
  static get template() {
    return html`
    <style include="klog-style-layout"></style>
    <style include="klog-style-scrollbar"></style>
    <style>
      :host {
        display: block;
        padding: 0;
        background: var(--klog-page-background);
      }

      .card-container {
        height: var(--klog-layout-page-height);
        padding: 96px 0;
        box-sizing: border-box;
        overflow-y: auto;
        justify-content: center;
        transition: all var(--refresh-animation-duration) ease-out;
      }

      klog-timeline-item {
        max-width: 600px;
        margin: 0 auto 16px;
      }
    </style>
    <klog-data-list id="data" type="timeline" last-response="{{items}}" key="date"></klog-data-list>
    <app-header></app-header>
    <div class="card-container">
      <template is="dom-repeat" items="{{items}}">
        <klog-timeline-item data="{{item}}"></klog-timeline-item>
      </template>
    </div>
`;
  }

  static get is() { return 'klog-zone'; }

  ready() {
    super.ready();
    this.$.data.select = ['type', 'detail', 'referTo', 'author', 'title', 'text', 'createTime', 'markdown', 'type', 'image', 'topic', 'path', 'collection', 'date'];
    this.$.data.include = ['author', 'topic'];
    this.$.data.userinfo = this.userinfo;
    this.$.data.load();
  }
}

window.customElements.define(KlogZone.is, KlogZone);
