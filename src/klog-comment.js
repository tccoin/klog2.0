import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogDataCommentMixin } from './klog-data-comment-mixin.js';
import '@polymer/paper-button/paper-button.js';
import './klog-icons.js';
import './klog-style-author.js';
import './klog-editor-textarea.js';

class KlogComment extends KlogDataCommentMixin(PolymerElement) {
  static get template() {
    return html`
    <style include="klog-style-author"></style>
    <style>
      :host {
        display: block;
        padding: 32px 16px 0;
        --klog-markdown-padding: 0px;
        --klog-markdown-font-size: 14px;
        --textarea-padding: 0;
        --klog-media-width: 574px;
      }

      iron-icon{
        margin-right:8px;
      }

      klog-editor-textarea{
        background: none;
      }

      #replyButton{
       margin: 8px 0 -12px -12px;
      }

      .author-info{
        margin-bottom: 8px;
      }

      .comment-content {
        padding: 16px;
        background: var(--secondary-background-color);
        border-radius: 5px;
      }

      .klog-author{
        margin: 16px 0;
      }
    </style>
    <klog-data-comment id="data"></klog-data-comment>
    <!--Input-->
    <div class="klog-author">
      <klog-image class="author-avatar" src="{{userinfo.publicinfo.attributes.avatarUrl}}" avatar></klog-image>
      <div class="text">
        <div class="comment-content">
          <klog-editor-textarea id="input" placeholder="楼主好人系统绝赞*测试中*"></klog-editor-textarea>
          <paper-button on-click="reply" id="replyButton"><iron-icon icon="save_alt"></iron-icon>发表评论</paper-button>
        </div>
      </div>
    </div>
    <!--Comment-->
    <template is="dom-repeat" items="{{data}}">
      <div class="klog-author">
        <klog-image class="author-avatar" src="{{item.author.avatarUrl}}" avatar></klog-image>
        <div class="text">
          <div class="author-info">
            <span class="author-name">{{item.author.displayName}}&nbsp;</span>回复
            <template is="dom-if" if="{{item.replyTo}}">{{item.replyToAuthor.displayName}}</template>
            <klog-render-timestamp time-stamp="{{_parseDate(item.createdAt)}}">于</klog-render-timestamp>
          </div>
          <div class="comment-content">
            <klog-markdown markdown="{{item.markdown}}" lazy-init lazy></klog-markdown>
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
        type: String
      },
      authorId: {
        type: String
      },
      data: {
        type: Array
      },
    }
  }

  static get observers() {
    return ['refresh(articleId)'];
  }

  lazyload() {
    this.refresh();
  }

  async reply() {
    await this.createComment(this.articleId, this.userinfo.publicinfo.id, this.$.input.value);
    await this.refresh();
    this.$.input.value = '';
  }

  async refresh() {
    this.data = await this.loadComment(this.articleId);
    setTimeout(() => {
      this._updateMarkdownScroller();
    }, 1);
  }

  updateScrollTarget(scrollTarget) {
    this.$.scrollTarget = scrollTarget;
    this._updateMarkdownScroller();
  }

  _updateMarkdownScroller() {
    if (!this.$.scrollTarget) return;
    const items = this.shadowRoot.querySelectorAll('klog-markdown[lazy-init]');
    for (let item of items) {
      item.updateScrollTarget(this.$.scrollTarget);
      item.removeAttribute('lazy-init');
    }
  }

  _parseDate(date) {
    return Date.parse(date)
  }
}

window.customElements.define(KlogComment.is, KlogComment);
