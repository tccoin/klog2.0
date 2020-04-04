import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import './klog-data-comment.js';
import './klog-style-author.js';

class KlogComment extends PolymerElement {
  static get template() {
    return html`
    <style include="klog-style-author"></style>
    <style>
      :host {
        display: block;
        padding: 32px 16px 0;
      }

      .comment-content {
        padding: 16px;
        background: var(--secondary-background-color);
        border-radius: 5px;
        margin-top: 8px;
      }
    </style>
    <klog-data-comment id="data"></klog-data-comment>
    <template is="dom-repeat" items="{{data}}">
      <div class="klog-author">
        <klog-image class="author-avatar" src="{{item.author.avatarUrl}}" avatar=""></klog-image>
        <div class="text">
          <div class="author-info">
            <span class="author-name">{{item.author.displayName}}</span>
            <klog-render-timestamp time-stamp="{{parseDate(item.createdAt)}}">,&nbsp;发表于</klog-render-timestamp>
          </div>
          <div class="comment-content">
            <!-- <klog-markdown markdown=""></klog-markdown> -->
            {{item.markdown}}
          </div>
        </div>
      </div>
    </template>
`;
  }

  static get is() { return 'klog-comment'; }

  static get properties() {
    return {
      articleId: {
        type: String,
        observer: 'refresh'
      },
      data: {
        type: Array
      },
    }
  }

  ready() {
    super.ready();
    console.log(this);
  }

  parseDate(date) {
    return Date.parse(date)
  }

  lazyload() {
    this.refresh();
  }

  async refresh() {
    this.data = await this.$.data.load(this.articleId);
  }
}

window.customElements.define(KlogComment.is, KlogComment);
