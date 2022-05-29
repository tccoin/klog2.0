import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogUiMixin } from '../framework/klog-ui-mixin.js';
import { KlogDataMessageMixin } from '../data/klog-data-message-mixin.js';

import '@polymer/app-layout/app-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/app-route/app-route.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
import '../style/klog-style-article.js';
import '../ui/klog-markdown.js';
import '../ui/klog-icons.js';
import '../data/klog-data-article.js';
import '../ui/klog-image.js';
import '../ui/klog-fab.js';
import '../ui/klog-render-timestamp.js';
import '../ui/klog-render-license.js';
import '../ui/klog-bottom-app-bar.js';
import './klog-comment.js';

class KlogArticle extends KlogDataMessageMixin(KlogUiMixin(PolymerElement)) {
    static get template() {
        return html`
<style include="klog-style-article"></style>
<app-localstorage-document key="likeHistory" data="{{likeHistory}}"></app-localstorage-document>
<klog-data-article id="data" path="{{path}}" last-response="{{article}}" last-error="{{error}}" is-owner="{{isOwner}}">
</klog-data-article>

<!--app bar-->
<klog-bottom-app-bar id="appBar" compact="{{!isOwner}}">
    <paper-button class="like-button" on-click="_like">
        <iron-icon icon="thumb_up"></iron-icon>
        <span class="like-button-count">{{article.likeCount}}</span>
    </paper-button>
    <paper-button on-click="_scrollToComment">
        <iron-icon icon="comment"></iron-icon>
        <span class="like-button-count">{{article.commentCount}}</span>
    </paper-button>
    <paper-icon-button icon="share" on-click="_share"></paper-icon-button>
    <paper-icon-button icon="menu_book" on-click="_scrollToToc" hidden="{{!hasToc}}"></paper-icon-button>
    <klog-fab slot="fab" icon="edit" id="fab" label="编辑" on-click="edit" extended="{{fabExtended}}" hidden="{{!isOwner}}"></klog-fab>
</klog-bottom-app-bar>

<!--article-->
<div class="article-container" id="content">
  <div class="section">
    <!--article header-->
    <div class="article-category" hidden="{{!article.title}}" on-click="_searchTimeline">
      <klog-render-timestamp time-stamp="{{article.createdTime}}"></klog-render-timestamp>
      <span class="article-collection">{{article.collection}}</span>
      <template is="dom-repeat" items="{{article.tags}}">
        <span class="article-tag">#{{item}}</span>
      </template>
    </div>
    <div class="article-title" hidden="{{!article.title}}">
      <h1>{{article.title}}</h1>
    </div>
    <div class="article-author klog-author" theme\$="{{theme}}">
      <klog-image id="avatar" class="author-avatar" on-click="openZone" src="{{article.author.avatarUrl}}" avatar lazy></klog-image>
      <div class="text">
        <div class="author-info">
          <span class="author-name" on-click="openZone">{{article.author.displayName}}</span>
          <template is="dom-if" if="{{article.author.introduction}}">
            <span class="author-intro divider">{{article.author.introduction}}</span>
          </template>
        </div>
        
      </div>
    </div>
    <!--article content-->
    <klog-markdown class="article-main" id="markdown" markdown="{{article.markdown}}" link-prefix="article/{{path}}" hide-independent-title="true" theme="{{theme}}" preference="{{userinfo.preference.markdown}}" mobile="{{mobile}}" scroll-bias="-64" lazy heading-actions>
    </klog-markdown>
  </div>
  <!--update info-->
  <div class="section article-update-info">
    <klog-render-timestamp time-stamp="{{article.updatedTime}}">最后更新于</klog-render-timestamp>
    <template is="dom-if" if="{{_showVisitCount}}">
        ，共{{article.visitCount}}次阅读
    </template>。
  <br>
    <klog-render-license license="{{article.license}}" default-license="{{article.author.license}}"></klog-render-license>
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
  <span class="logo" on-click="_logoClickHandle">
    <iron-icon icon="klog"></iron-icon>
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
            hasToc: {
                type: Boolean,
                value: false
            },
            loading: {
                type: Boolean,
                value: true,
                reflectToAttribute: true,
            },
            from: {
                type: String
            },
            likeHistory: {
                type: Object
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
                    toolbar: html`
            <app-toolbar>
              <paper-icon-button class="navigation" icon="arrow_back" on-click="back"></paper-icon-button>
            </app-toolbar>`
                }
            }
        };
    }

    static get observers() {
        return [
            'handleError(error)',
            'updateTitle(article.title)'
        ];
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

        this.$.image = document.createElement('klog-image');

        this._safeareaBottom = parseInt(getComputedStyle(this).getPropertyValue('--safe-area-inset-bottom')) || 0;
        this._lastY = 0;
        this._scrollHandler = () => {
            // fab
            // this.fabExtended = !this.mobile;
            let safeareaTop = parseInt(getComputedStyle(this).getPropertyValue('--safe-area-inset-top')) || 0;
            let top = this.shadowRoot.querySelector('.comment-container').getBoundingClientRect().top;
            if (top != 0 && top + 60 - safeareaTop <= window.innerHeight) {
                // fab.style.transform = 'translateY(88px)';
                this.$.appBar.opened = false;
                this.$.appBar.fabOpened = false;
                this.$.appBar.disabled = true;
            } else {
                this.$.appBar.disabled = false;
            }
        };
        window.addEventListener('resize', this._scrollHandler);

        this.$.comment.addEventListener('comment-created', ()=>this.set('article.commentCount', this.article.commentCount + 1));
        this.$.comment.addEventListener('comment-deleted', ()=>this.set('article.commentCount', this.article.commentCount - 1));
    }

    _updateBackTo() {
        let backTo;
        if (this.lastHash && !this._inHash(this.lastHash, ['article', 'editor'])) {
            backTo = this.lastHash;
        } else if (this.from) {
            backTo = this.from;
        } else {
            backTo = 'timeline';
        }
        this.backTo = backTo;
        return backTo;
    }

    back() {
        this._updateBackTo();
        this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: this.backTo } }));
    }

    openZone() {
        this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: this.article.author.username || 'zone/' + this.article.author.objectId } }));
    }

    async update(userdata, route) {
        // user
        this.$.data.userinfo = userdata.userinfo;
        this.userinfo = userdata.userinfo;
        this.login = userdata.login;
        // data
        this.loading = true;
        this._resetLikeHit();
        let params = route.path.split('/').splice(1);
        if (params.length >= 2 && params[1]) {
            let share = params[1];
            this.updateScrollerQuery(share);
        }
        if (params.length >= 1 && params[0]) {
            let path = params[0];
            if (this.$.data.isPathNew(path)) {
                // load new article
                this.path = path;
                await new Promise(resolve => this.$.data.addEventListener('success', resolve, { once: true }));
                let themeColor = 'default';
                if (this.article.image && 'url' in this.article.image && this.$.image.isKlogStorage(this.article.image.url)) {
                    if ('themeColor' in this.article.image) {
                        themeColor = this.article.image.themeColor;
                    } else {
                        let response = await fetch(this.article.image.url + '?Magic/6');
                        let mediaInfo = await response.json();
                        themeColor = this.theme == 'light' ? mediaInfo.palette.LightVibrant.rgb : mediaInfo.palette.DarkVibrant.rgb;
                    }
                }
                this.dispatchEvent(new CustomEvent('layout-update', { bubbles: true, composed: true, detail: { themeColor } }));
                this.$.avatar.lazyload();
                this._scrollHandler();
                this._updateLikeHit();
            }
        }
        // scroller
        this.$.comment.updateScrollTarget(this.$.scrollTarget);
        this.$.appBar.updateScrollTarget(this.$.scrollTarget);
    }

    async load() {
        this.loading = false;
        this.hasToc = this.$.markdown.shadowRoot.querySelectorAll('.klog-article-content .toc').length > 0;
        this.$.markdown.updateScrollTarget(this.$.scrollTarget);
        if (this.$.scrollTarget == document.scrollingElement) {
            document.addEventListener('scroll', this._scrollHandler);
        } else {
            this.$.scrollTarget.addEventListener('scroll', this._scrollHandler);
        }
    }

    async unload() {
        this.$.scrollTarget.removeEventListener('scroll', this._scrollHandler);
        this.loading = true;
        await this._timeout(new Promise(resolve => { this.$.content.addEventListener('transitionend', resolve); }), 500);
        this.path = '';
        this.isOwner = false;
        this.$.appBar.reload();
        this.article = {
            markdown: ''
        };
        this.$.comment.resetInput();
    }

    _timeout(promise, timeout) {
        return Promise.race([
            promise,
            new Promise(resolve => { setTimeout(resolve, timeout); })
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
                articleId: this.article.objectId
            }
        }));
    }

    handleError() {
        this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: '404' } }));
    }

    updateTitle(title) {
        if (!title) return;
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

    _scrollToToc() {
        this.$.markdown.$.scroller.updateQueryByHash('class-toc');
        this.$.markdown.$.scroller.scroll();
    }

    _logoClickHandle() {
        this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: 'timeline' } }));
    }

    _share() {
        let copyInfo = `${this.article.title} - ${this.article.author.displayName}的文章 - Klog\nhttps://klog.app/#/article/${this.path}`;
        this.copy(copyInfo);
        this.openToast('已复制分享链接到剪贴板', null, { bottom: document.body.clientWidth < 1024 ? 80 + this._safeareaBottom : 0 });
    }

    _resetLikeHit() {
        this._likeHit = 0;
        this._lastLikeHitTime = 0;
        this._likeHitDisabled = false;
        this._visitHitDisabled = false;
    }

    _updateLikeHit() {
        this._checkLikeHistory();
        this._likeHitAuthorName = this.isOwner ? '自己' : this.article.author.displayName;
        this._showVisitCount = this.isOwner && this.article.visitCount >= 10;
        if (!this._visitHitDisabled) {
            this._saveLikeCount(1, 'article-visit');
            this.set('article.likeCount', this.article.likeCount + 1);
            this.set('article.visitCount', this.article.visitCount + 1);
            this.set(`likeHistory.${this.article.objectId}-visit`, Date.now());
        }
    }

    _checkLikeHistory() {
        const minLikeDuration = 3600 * 1000;
        const minVisitDuration = 600 * 1000;
        let articleId = this.article.objectId;
        if (!this.likeHistory) {
            this.likeHistory = {};
        } else {
            if (articleId in this.likeHistory) {
                this._likeHitDisabled = Date.now() - this.likeHistory[articleId] < minLikeDuration;
            }
            if (`${articleId}-visit` in this.likeHistory) {
                this._visitHitDisabled = Date.now() - this.likeHistory[`${articleId}-visit`] < minVisitDuration;
            }
        }
    }

    _like() {
        if (this._likeHitDisabled) {
            this.openToast('你最近已经给这篇文章点过赞了哟', null, { bottom: document.body.clientWidth < 1024 ? 80 + this._safeareaBottom : 0 });
            return;
        }
        const minLikeHitDuration = 200;
        const maxLikeHit = 10;
        let timePass = Date.now() - this._lastLikeHitTime >= minLikeHitDuration;
        let numberPass = this._likeHit + 1 <= maxLikeHit;
        if (timePass && numberPass) {
            this._likeHit += 1;
            this.set('article.likeCount', this.article.likeCount + 1);
            this._lastLikeHitTime = Date.now();
            this.openToast(`你给${this._likeHitAuthorName}的文章点了${this._likeHit}个赞！`, null, { duration: 5000, bottom: document.body.clientWidth < 1024 ? 80 + this._safeareaBottom : 0 });
            if (this._saveLikeCountTimeout) {
                clearTimeout(this._saveLikeCountTimeout);
            }
            this._saveLikeCountTimeout = setTimeout(()=>{
                this._likeHitDisabled = true;
                this._saveLikeCount(this._likeHit, 'article-like');
                this._likeHit = 0;
                this.set(`likeHistory.${this.article.objectId}`, Date.now());
            }, this._likeHit == maxLikeHit ? 1000 : 2000);
        }
    }

    _saveLikeCount(likeCount, type) {
        this.openToast(`这篇文章收到了你的${likeCount}个赞！`, null, { bottom: document.body.clientWidth < 1024 ? 80 + this._safeareaBottom : 0 });
        let userId = this.article.author.objectId;
        let content = { isLogin: this.login };
        if (type == 'article-like') {
            content.likeCount = likeCount;
            if (this.login) {
                userId = this.userinfo.publicinfo.id;
            }
        }
        let articleAithorId = this.article.author.objectId;
        this.createMessage(type, userId, [`author-user-${articleAithorId}`, `like-user-${articleAithorId}`], content, this.article.objectId);
    }
}

window.customElements.define(KlogArticle.is, KlogArticle);