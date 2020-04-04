import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '@polymer/paper-dialog/paper-dialog.js';
import './klog-style-scrollbar.js';
import './klog-style-dialog.js';
import './klog-data-list.js';

class KlogEditorBrowser extends PolymerElement {
  static get template() {
    return html`
    <style include="klog-style-dialog"></style>
    <style include="klog-style-scrollbar"></style>
    <style>
      :host {
        display: block;
        width: 100%;
        max-width: 378px;
        border-radius: 5px;
        overflow: hidden;
      }

      a {
        text-decoration: none;
      }

      .actions {
        display: flex;
        align-items: flex-end;
        padding: 0 16px 16px;
        transition: box-shadow .2s ease;
      }

      .actions.raised {
        @apply --shadow-elevation-2dp;
      }

      paper-button {
        border: 1px solid var(--primary-color);
        color: var(--primary-color);
        padding: 8px 16px;
        margin: 16px 0 0 0;
        border-radius: 22px;
        z-index: 1;
      }

      paper-button[disabled] {
        color: var(--disabled-text-color);
        border-color: var(--disabled-text-color);
        background: transparent;
      }

      iron-icon {
        margin-right: 4px;
      }

      .actions .divider {
        flex: 1;
      }

      paper-spinner-lite {
        transform: scale(0.5);
        --paper-spinner-color: var(--paper-grey-500);
      }

      .list {
        overflow: auto;
        height: calc(100% - 74px);
        border-radius: 4px;
      }

      .article-item {
        padding: 16px 24px;
        width: 100%;
        box-sizing: border-box;
        border-top: 1px solid var(--divider-color);
        position: relative;
        user-select: none;
        -webkit-user-select: none;
        cursor: default;
        color: var(--primary-text-color);
      }

      a:first-child .article-item {
        border-top: none;
      }

      .article-item .meta {
        color: var(--secondary-text-color);
        font-size: 0.8em;
      }

      .article-item .text {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: var(--secondary-text-color);
      }

      paper-progress {
        left: 0;
        right: 0;
        padding: 0;
      }
    </style>
    <klog-data-list id="data" last-response="{{list}}" collection="{{collection}}" userinfo="{{userinfo}}" loading="{{loading}}"></klog-data-list>
    <div class="actions" id="actions">
      <paper-button on-click="new" disabled="{{disabled}}">
        <iron-icon icon="add"></iron-icon>
        新建文章
      </paper-button>
      <div class="divider"></div>
      <paper-spinner-lite active="{{loading}}"></paper-spinner-lite>
    </div>
    <div class="list" id="list">
      <template is="dom-repeat" items="{{list}}" as="article">
        <a article-id="{{article.objectId}}" on-click="editArticle">
          <div class="article-item">
            <b hidden\$="{{!article.title}}">{{article.title}}
              <br>
            </b>
            <div class="meta">
              <klog-render-timestamp time-stamp="{{parseDate(article.createdAt)}}"></klog-render-timestamp>
            </div>
            <div class="text">{{article.text}}</div>
            <paper-ripple></paper-ripple>
          </div>
        </a>
      </template>
    </div>
`;
  }

  static get is() { return 'klog-editor-browser'; }

  static get properties() {
    return {
      loading: {
        type: Boolean
      },
      disabled: {
        type: Boolean
      },
      articleId: {
        type: String,
        notify: true
      },
      list: {
        type: Object
      },
      collection: {
        type: String,
        observer: '_loadList'
      }
    }
  }

  ready() {
    super.ready();
    this.$.list.addEventListener('scroll', () => {
      let y = this.$.list.scrollTop;
      if (y > 0) this.$.actions.classList.add('raised');
      else this.$.actions.classList.remove('raised');
    });
  }

  _loadList() {
    setTimeout(() => this.$.data.load(), 1);
  }

  editArticle(e) {
    let link = e.target;
    while (link.tagName != 'A') link = link.parentNode;
    this.articleId = link.articleId;
    this.dispatchEvent(new CustomEvent('klog-backdrop-toggle', { bubbles: true, composed: true }));
  }

  new() {
    this.dispatchEvent(new CustomEvent('new', { bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('klog-backdrop-toggle', { bubbles: true, composed: true }));
  }

  parseDate(date) {
    return Date.parse(date)
  }
}

window.customElements.define(KlogEditorBrowser.is, KlogEditorBrowser);
