import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/app-layout/app-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/app-route/app-route.js';
import '@polymer/paper-progress/paper-progress.js';
import './klog-style-layout.js';
import './klog-style-card.js';
import './klog-style-author.js';
import './klog-markdown.js';
import './klog-icons.js';
import './klog-data-article.js';
import './klog-image.js';
import './klog-fab.js';
import './klog-render-timestamp.js';

class KlogArticle extends PolymerElement {
  static get template() {
    return html`
    <style include="klog-style-layout"></style>
    <style include="klog-style-card"></style>
    <style include="klog-style-author"></style>
    <style>
      :host {
        display: block;
        min-height: var(--klog-layout-page-height);
        outline: none;
      }

      .section,
      .article-footer {
        margin: auto;
        box-sizing: border-box;
      }

      .content,
      .article-footer {
        transition: opacity .3s ease, transform .2s ease-out;
      }

      :host([loading]) .content,
      :host([loading]) .article-footer {
        opacity: 0;
      }

      /*Article*/

      .article-category {
        font-size: calc(1.1 * var(--klog-markdown-font-size));
        padding: 0 16px;
        color: var(--secondary-text-color);
      }

      .article-collection {
        font-weight: bold;
        padding-right: 8px;
      }

      .article-tag {
        padding-left: 8px;
      }

      .article-title {
        padding: 0 16px;
      }

      .article-title h1 {
        font-size: calc(2 * var(--klog-markdown-font-size));
        font-weight: 400;
        line-height: 1.3;
        margin: 0 0 1em;
      }

      .dot-divider {
        display: inline-block;
        margin: 0 6px;
        width: 5px;
        height: 5px;
        background: var(--divider-color);
        border-radius: 50%;
      }

      .article-meta {
        display: flex;
        padding: 0 16px;
        flex-direction: row;
        color: var(--secondary-text-color)
      }

      .article-author {
        margin: 16px auto 32px;
        padding: 16px;
      }

      .article-footer {
        padding: 16px;
        font-size: 20px;
        color: var(--primary-text-color);
        opacity: 0.15;
        text-align: right;
        cursor: default;
      }

      .article-footer .logo {
        position: relative;
        user-select: none;
        -webkit-user-select: none;
      }

      .article-footer .logo a {
        @apply --fit-layout;
        z-index: 1;
      }

      [hidden] {
        display: none;
      }

      /*immersive mode*/

      :host(:not([immersive])) .immersive {
        display: none !important;
      }

      :host([immersive]) .non-immersive {
        display: none !important;
      }

      /*media block*/

      @media (max-width: 662px) {
        klog-markdown {

          --klog-markdown-media-container: {
            width: calc(100% + 32px);
            margin: 0 0 16px 50%;
            transform: translateX(-50%);
          }

          --klog-markdown-media: {
            width: 100%;
            --klog-media-border-radius: 0px;
          }

          --klog-markdown-media-description: {
            padding: 12px 16px 0;
          }
        }
      }

      @media (min-width: 663px) {
        klog-markdown {
          --klog-markdown-media: {
            @apply(--shadow-elevation-8dp);
          }
        }
      }

      @media (min-width: 768px) {
        klog-markdown {
          --klog-media-width: 739px;

          --klog-markdown-media-container: {
            min-width: 100%;
            margin: 0 0 16px 50%;
            width: max-content;
            transform: translateX(-50%);
          }
        }
      }

      @media (min-width: 1024px) {
        klog-markdown {
          --klog-media-width: 768px;
        }
      }

      @media (min-width: 1440px) {
        klog-markdown {
          --klog-media-width: 1024px;

          --klog-markdown-media-container: {
            min-width: 100%;
            margin: 0 0 32px 50%;
            width: max-content;
            transform: translateX(-50%);
          }

          --klog-markdown-media: {
            @apply(--shadow-elevation-16dp);
          }
        }
      }

      /*font size*/

      .content {
        width: 100%;
        margin: auto;
        padding-top: 5vh;
        max-width: calc(42 * var(--klog-markdown-font-size) + 32px);
      }

      @media (max-width: 767px) {

        :host {
          --klog-markdown-font-size: 15px;
          --klog-markdown-line-height: 1.7;
        }
      }

      @media (min-width: 768px) and (max-width: 1439px) {
        :host {
          --klog-markdown-font-size: 16px;
          --klog-markdown-line-height: 1.8;
        }
      }

      @media (min-width: 1440px) {
        :host {
          --klog-markdown-font-size: 17px;
          --klog-markdown-line-height: 1.8;
        }
      }

      /*scrollbar*/
      @media (max-width: 767px) {
        :host::-webkit-scrollbar-thumb {
          background-color: var(--scrollbar-thumb-color) !important;
        }

        :host(:hover)::-webkit-scrollbar-thumb {
          background-color: var(--scrollbar-thumb-active-color) !important;
        }
      }

      /*animation*/

      :host([exit]) klog-fab {
        transform: scale(0);
      }
    </style>
    <app-route route="{{route}}" pattern="/:path" data="{{routeData}}" tail="{{_subroute}}"></app-route>
    <app-route route="{{_subroute}}" pattern="/:share" data="{{shareData}}"></app-route>
    <klog-data-article id="data" path="{{path}}" last-response="{{article}}" last-error="{{error}}" is-owner="{{isOwner}}">
    </klog-data-article>
    <klog-fab icon="edit" id="fab" class="edit-fab" label="编辑" on-click="edit" hidden="{{!isOwner}}" extended="{{fabExtended}}"></klog-fab>
    <div class="content" id="content">
      <!--article header-->
      <div class="section article-category" hidden="{{!article.title}}">
        <span class="article-collection">{{article.collection}}</span>
        <template is="dom-repeat" items="{{article.tags}}">
          <span class="article-tag">#{{item}}</span>
        </template>
      </div>
      <div class="section article-title" hidden="{{!article.title}}">
        <h1>{{article.title}}</h1>
      </div>
      <div class="section article-author klog-author" theme\$="{{theme}}">
        <klog-image id="avatar" class="author-avatar" src="{{article.author.avatarUrl}}" avatar="" lazy=""></klog-image>
        <div class="text">
          <div class="author-info">
            <span class="author-name">{{article.author.displayName}}</span>
            <template is="dom-if" if="{{article.author.introduction}}">,&nbsp;
              <span class="author-intro divider">{{article.author.introduction}}</span>
            </template>
          </div>
          <klog-render-timestamp time-stamp="{{parseDate(article.createdAt)}}">发表于&nbsp;</klog-render-timestamp>
        </div>
      </div>
      <!--article-->
      <klog-markdown class="section article-main" id="markdown" markdown="{{article.markdown}}" link-prefix="article/{{path}}" hide-independent-title="true" theme="{{theme}}" preference="{{userinfo.preference.markdown}}" mobile="{{mobile}}" lazy="" heading-actions="">
      </klog-markdown>
      <!--comment-->
      <!-- <div class="section">
        <klog-comment id="comment" article-id="{{article.objectId}}" userinfo="{{userinfo}}"></klog-comment>
      </div> -->
      <!--footer-->
      <div class="article-footer">
        <span class="logo">
          Klog.
          <a href="#/timeline/" class="immersive"></a>
        </span>
      </div>
    </div>
    <div id="toastContainer"></div>
`;
  }

  static get is() { return 'klog-article'; }

  static get properties() {
    return {
      isOwner: {
        type: Boolean,
        value: false
      },
      loading: {
        type: Boolean,
        value: true,
        reflectToAttribute: true,
      },
      immersive: {
        type: Boolean,
        reflectToAttribute: true,
      },
      layout: {
        type: Object,
        value: {
          documentTitle: '文章 - Klog',
          drawer: 'on',
          mainMenu: false,
          sidebar: 'off',
          header: {
            fixed: true,
            short: true,
            shadow: 'scroll'
          },
          styles: {
            '--klog-layout-background': 'var(--klog-article-theme-color)',
            '--klog-header-background-color': 'var(--klog-article-theme-color)',
          },
          toolbar: html`
            <app-toolbar>
              <paper-icon-button class="navigation" icon="arrow_back" on-click="back"></paper-icon-button>
              <div class="title">
                <div main-title></div>
              </div>
            </app-toolbar>`
        }
      }
    };
  }

  static get observers() {
    return [
      'handleError(error)',
      'loadArticle(routeData.path)',
      'updateTitle(article.title)',
      'articleloaded(article.objectId)',
      'updateImmersiveMode(article.immersive)',
      'updateScrollerQuery(shareData.share)'
    ]
  }

  back() {
    if (!this.backTo) {
      this.backTo = 'timeline';
    }
    this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: this.backTo, now: false } }));
  }

  loadArticle(path) {
    if (window.location.hash.indexOf('#/article') == -1) return
    if (!path || this.path == path) return
    this.path = path;
  }

  ready() {
    super.ready();
    this.setAttribute('tabindex', 1);
    this.addEventListener('keydown', (e) => {
      if (e.ctrlKey == true && e.keyCode == 69) {
        //ctrl e
        e.preventDefault();
        this.edit();
      }
    });

    this._scrollHandler = () => {
      let y = this.$.scrollTarget.scrollTop;
      this.fabExtended = y < 48 && !this.mobile;
    };

  }

  async load(userLoadPromise) {
    this.$.markdown.updateScrollTarget(this.$.scrollTarget);
    this.$.scrollTarget.addEventListener('scroll', this._scrollHandler);
    this.loading = true;
    userLoadPromise.then(result => {
      this.$.data.userinfo = result.userinfo;
      this.userinfo = result.userinfo;
    });
  }

  articleloaded() {
    if (this.article && this.article.objectId) {
      this.loading = false;
      this.$.avatar.lazyload();
    }
  }

  async update(subroute) {
    this._scrollHandler();
    this.route = subroute;
  }

  async unload() {
    this.$.scrollTarget.removeEventListener('scroll', this._scrollHandler);
    this.loading = true;
    await this._timeout(new Promise(resolve => { this.$.content.addEventListener('transitionend', resolve) }), 500);
    this.path = '';
    this.isOwner = false;
    this.article = {
      markdown: ''
    };
  }

  _timeout(promise, timeout) {
    return Promise.race([
      promise,
      new Promise(resolve => { setTimeout(resolve, timeout) })
    ]);
  }

  updateScrollerQuery(hash) {
    this.$.markdown.$.scroller.updateQueryByHash(hash);
  }

  edit() {
    this.dispatchEvent(new CustomEvent('editor-open', {
      bubbles: true, composed: true, detail: {
        articleId: this.article.objectId,
        backTo: window.location.hash
      }
    }));
  }

  handleError() {
    this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: '404' } }));
  }

  parseDate(date) {
    return Date.parse(date)
  }

  updateTitle(title) {
    if (!title) return
    this.dispatchEvent(new CustomEvent('layout-update', {
      bubbles: true,
      composed: true,
      detail: {
        documentTitle: title + ' - Klog'
      }
    }));
    // this.$.header.querySelector('[main-title]').innerText = title;
  }

  updateImmersiveMode(immersive) {
    this.immersive = immersive;
    if (immersive) this.dispatchEvent(new CustomEvent('drawer-disable', { bubbles: true, composed: true }));
  }
}

window.customElements.define(KlogArticle.is, KlogArticle);
