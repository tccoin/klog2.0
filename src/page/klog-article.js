import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/app-layout/app-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/app-route/app-route.js';
import '@polymer/paper-progress/paper-progress.js';
import '../style/klog-style-article.js';
import '../ui/klog-markdown.js';
import '../ui/klog-icons.js';
import '../data/klog-data-article.js';
import '../ui/klog-image.js';
import '../ui/klog-fab.js';
import '../ui/klog-render-timestamp.js';
import '../ui/klog-render-license.js';
import './klog-comment.js';

class KlogArticle extends PolymerElement {
  static get template() {
    return html `
<style include="klog-style-article"></style>
<app-route route="{{route}}" pattern="/:path" data="{{routeData}}" tail="{{_subroute}}"></app-route>
<app-route route="{{_subroute}}" pattern="/:share" data="{{shareData}}"></app-route>
<klog-data-article id="data" path="{{path}}" last-response="{{article}}" last-error="{{error}}" is-owner="{{isOwner}}">
</klog-data-article>
<!--article-->
<div class="article-container" id="content">
  <div class="section">
    <!--article header-->
    <div class="article-category" hidden="{{!article.title}}" on-click="_searchTimeline">
      <klog-render-timestamp time-stamp="{{parseDate(article.createdAt)}}"></klog-render-timestamp>
      <span class="article-collection">{{article.collection}}</span>
      <template is="dom-repeat" items="{{article.tags}}">
        <span class="article-tag">#{{item}}</span>
      </template>
    </div>
    <div class="article-title" hidden="{{!article.title}}">
      <h1>{{article.title}}</h1>
    </div>
    <div class="article-author klog-author" theme\$="{{theme}}">
      <klog-image id="avatar" class="author-avatar" on-click="openZone" src="{{article.author.avatarUrl}}" avatar="" lazy=""></klog-image>
      <div class="text">
        <div class="author-info">
          <span class="author-name" on-click="openZone">{{article.author.displayName}}</span>
          <template is="dom-if" if="{{article.author.introduction}}">,&nbsp;
            <span class="author-intro divider">{{article.author.introduction}}</span>
          </template>
        </div>
        
      </div>
    </div>
    <!--article content-->
    <klog-markdown class="article-main" id="markdown" markdown="{{article.markdown}}" link-prefix="article/{{path}}" hide-independent-title="true" theme="{{theme}}" preference="{{userinfo.preference.markdown}}" mobile="{{mobile}}" lazy heading-actions>
    </klog-markdown>
  </div>
  <!--update info-->
  <div class="section article-update-info">
  <klog-render-timestamp time-stamp="{{parseDate(article.updatedAt)}}">最后更新于</klog-render-timestamp>。<br>
    <klog-render-license license="{{article.license}}" default-license="{{article.author.license}}"></klog-render-license>
  </div>
</div>
<!--fab-->
<div class="section fab-section">
  <div class="fab-container">
    <klog-fab icon="edit" id="fabEdit" label="编辑" on-click="edit" hidden="{{!isOwner}}" extended="{{fabExtended}}"></klog-fab>
    <klog-fab icon="comment" id="fabComment" label="评论" on-click="_scrollToComment" hidden="{{isOwner}}" extended="{{fabExtended}}"></klog-fab>
  </div>
</div>
<!--comment-->
<div class="comment-container" id="commentContainer">
  <div class="section">
    <klog-comment id="comment" article-id="{{article.objectId}}" userinfo="{{userinfo}}" article-author-id="{{article.author.objectId}}" theme="{{theme}}" mobile="{{mobile}}" login="{{login}}"></klog-comment>
  </div>
</div>
<!--footer-->
<div class="section article-footer">
  <span class="logo">
    <iron-icon icon="klog"></iron-icon>
    <a href="#/timeline/"></a>
  </span>
</div>
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
      backTo: {
        type: String,
        value: 'timeline'
      },
      layout: {
        type: Object,
        value: {
          documentTitle: '文章 - Klog',
          drawer: 'off',
          mainMenu: false,
          sidebar: 'off',
          header: {
            fixed: true,
            short: false,
            shadow: { mobile: 'off', desktop: 'off' }
          },
          styles: {
            '--klog-header-background': 'transparent',
            '--klog-header-opacity': 0
          },
          toolbar: html `
            <app-toolbar>
              <paper-icon-button class="navigation" icon="arrow_back" on-click="back" hidden-on-mobile hidden-on-tablet></paper-icon-button>
              <div class="divider"></div>
              <paper-icon-button class="navigation" icon="close" on-click="back" hidden-on-desktop minimum></paper-icon-button>
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
      'updateScrollerQuery(shareData.share)'
    ]
  }

  back() {
    this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: this.backTo || 'timeline', now: false } }));
  }

  openZone() {
    this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: this.article.author.username || 'zone/' + this.article.author.objectId } }));
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
      this.fabExtended = !this.mobile;
      let fab = this.isOwner ? this.$.fabEdit : this.$.fabComment;
      let safeareaTop = parseInt(getComputedStyle(this).getPropertyValue('--safe-area-inset-top')) || 0;
      if (this.shadowRoot.querySelector('.comment-container').getBoundingClientRect().top + 24 - 2 * safeareaTop <= window.innerHeight * 0.9) {
        fab.style.position = 'absolute';
        fab.style.bottom = `${this.fabExtended ? (-24+safeareaTop) : (-28+safeareaTop)}px`;
      } else {
        fab.style.position = 'fixed';
        fab.style.bottom = '32px';
      }
    };
    window.addEventListener('resize', this._scrollHandler);
    setTimeout(() => {
      this.$.comment.updateScrollTarget(this.$.scrollTarget);
    }, 1);
  }

  async load(userLoadPromise) {
    this.$.markdown.updateScrollTarget(this.$.scrollTarget);
    this.$.scrollTarget.addEventListener('scroll', this._scrollHandler);
    this.loading = true;
    userLoadPromise.then(result => {
      this.$.data.userinfo = result.userinfo;
      this.userinfo = result.userinfo;
      this.login = result.login;
    });
  }

  articleloaded() {
    if (this.article && this.article.objectId) {
      this.loading = false;
      this.$.avatar.lazyload();
      this._scrollHandler();
    }
  }

  update(subroute) {
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
    this.$.comment.resetInput();
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
      bubbles: true,
      composed: true,
      detail: {
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
  }

  searchTimeline(keyword) {
    this.dispatchEvent(new CustomEvent('timeline-set-filter', {
      bubbles: true,
      composed: true,
      detail: {
        filterName: 'search',
        keyword: keyword
      }
    }));
  }

  _searchTimeline(e) {
    let keyword;
    if (e.target.classList.contains('article-tag')) {
      keyword = e.target.innerText.substr(1);
    } else if (e.target.classList.contains('article-collection')) {
      keyword = e.target.innerText;
    }
    if (keyword) {
      this.searchTimeline(keyword);
    }
  }

  _scrollToComment() {
    this.dispatchEvent(new CustomEvent('page-scroll', {
      bubbles: true,
      composed: true,
      detail: {
        destination: this.$.commentContainer.offsetTop
      }
    }));
  }
}

window.customElements.define(KlogArticle.is, KlogArticle);