import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogTimeline } from './klog-timeline.js';
import { KlogDataUserPublicMixin } from '../data/klog-data-user-public-mixin.js';
import '../ui/klog-image.js';
import '../style/klog-style-card.js';

class KlogZone extends KlogDataUserPublicMixin(KlogTimeline) {
    static get template() {
        return html `
    ${this.styleTemplate}
    ${this.zoneStyletemplate}
      ${this.contentTemplate}
    `;
    }

    static get zoneStyletemplate() {
        return html `
    <style include="klog-style-card"></style>
    <style>
      :host{
        display: flex;
        flex-direction: row;
        margin: auto;
        width: fit-content;
      }
      .info-container{
        width: 300px;
        margin: 64px 0 0;
        position: fixed;
        z-index: 101;
        border-radius: 16px;
        transition: all .3s ease;
        transform-origin: right top;
        @apply --shadow-elevation-2dp;
      }
      .info-container:hover{
        @apply --shadow-elevation-16dp;
      }
      .main-container{
        padding-left: 300px;
        max-width: 100vw;
      }
      .item{
        width: calc(100vw - 332px);
        margin: 0 8px 16px 16px;
      }
      .info-container-header{
        display: flex;
        align-items: center;
        margin-top: 9px;
      }
      .info-container-header paper-icon-button{
        margin-left: 12px;
        flex-shrink: 0;
      }
      .info-container paper-button{
        width: calc(100% - 8px);
        font-size: 15px;
        color: var(--secondary-text-color);
        overflow: hidden;
      }
      .info-container paper-button::after{
        @apply --overlay-style;
        background: var(--primary-text-color);
        opacity:0.1;
      }
      .info-container paper-button iron-icon{
        padding-right: 8px;
      }
      .author-avatar{
        width: 100%;
        margin: 0;
      }
      .author-name{
        margin: 24px 16px 0;
        font-size: 1.6em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
        font-weight: bolder;
    }
      .author-introduction{
        word-break: break-word;
        color: var(--secondary-text-color);
        margin: 0 16px calc(var(--klog-card-padding) * 3);
      }

      :host([loading]) .info-container {
        // transform: translateX(-5vh);
        transform: translateY(25vh);
        opacity: 0;
      }

      @media (max-width: 767px) {
        :host{
          flex-direction: column;
        }
        .info-container{
          width: calc(90vw - 32px);
          height: auto;
          margin: 64px auto 0 auto;
          position: relative;
          z-index: 1;
          bottom: auto;
          transform-origin: center top;
          transition: border-radius 50ms ease,transform .1s ease;
          @apply --shadow-elevation-16dp;
        }
        .main-container{
          padding: 32px 0 32px!important;
        }
        klog-timeline-item.item{
          width: 100vw!important;
          margin: 16px 0px;
        }
      }
    </style>
    `;
    }

    static get contentTemplate() {
        return html `
    <klog-data-list id="data" type="timeline" last-response="{{list}}" keyword="{{keyword}}" key="date"></klog-data-list>
    <klog-fab icon="refresh" id="updateButton" label="立即刷新" on-click="timelineUpdated" hidden="{{updateButtonHidden}}" extended="{{updateButtonExtended}}"></klog-fab>
    <div class="info-container klog-card" id="info">
      <klog-image class="author-avatar" id="avatar" src="{{authorPublic.avatarUrl}}" theme="{{theme}}" lazy content></klog-image>
      <div class="author-name">{{authorPublic.displayName}}</div>
      <div class="author-introduction">{{authorPublic.introduction}}</div>
    </div>
    <div class="main-container" id="container">
      <div id="pageHeader"></div>
      <div class="filter-container item" id="filter" on-click="setFilter">
        <klog-chip name="default" label="全部"></klog-chip>
        <klog-chip name="daily" label="日常"></klog-chip>
        <klog-chip name="note" label="笔记"></klog-chip>
        <klog-chip name="gallery" label="相册"></klog-chip>
        <klog-chip name="search" icon="search" hidden="{{mobile}}" checkmark-animation-disabled>
          <input slot="expand-content" id="keywordInput">
        </klog-chip>
      </div>
      <div class="timeline-container" id="timelineContainer">
        <template is="dom-repeat" items="{{cards}}">
          <klog-timeline-item class="item" back-to="{{cardBackTo}}" data="{{item}}" mobile="{{mobile}}" theme="{{theme}}" author-hidden on-click="_setBackTo"></klog-timeline-item>
        </template>
        <div class="eof" hidden="{{!_eof}}">Klog 奇点</div>
      </div>
    </div>
`;
    }

    static get is() { return 'klog-zone'; }

    static get properties() {
        return {
            loading: {
                type: Boolean,
                value: true,
                reflectToAttribute: true
            },
            list: {
                type: Array
            },
            filterName: {
                type: String,
                value: 'default',
                observer: '_filterNameUpdate'
            },
            keyword: {
                type: String,
                value: ''
            },
            view: {
                type: String,
                value: 'default'
            },
            updateButtonHidden: {
                type: Boolean,
                value: true
            },
            authorPublic: {
                type: Object
            },
            mobile: {
                type: Boolean,
                reflectToAttribute: true
            },
            layout: {
                type: Object,
                value: {
                    documentTitle: 'Klog',
                    drawer: 'auto',
                    mainMenu: false,
                    sidebar: 'off',
                    scrollToTop: false
                }
            },
        };
    }

    showDefaultToolbar() {
        this.dispatchEvent(new CustomEvent('layout-update', {
            bubbles: true,
            composed: true,
            detail: {
                header: {
                    fixed: true,
                    short: false,
                    blur: { mobile: true, desktop: false },
                    shadow: { mobile: 'scroll', desktop: 'off' },
                },
                styles: {
                    '--klog-header-background': { mobile: 'var(--klog-page-background)', desktop: 'transparent' },
                    '--klog-header-text-color': 'var(--primary-text-color)',
                    '--klog-header-opacity': 0.8
                },
                toolbar: html `
        <app-toolbar>
          <div class="title" on-click="back">
            <div main-title><iron-icon icon="klog"></iron-icon></div>
            <paper-ripple></paper-ripple>
          </div>
          <div class="divider"></div>
          <paper-icon-button on-click="showSearchToolbar" icon="search" mobile></paper-icon-button>
        </app-toolbar>`
            }
        }));
    }

    ready() {
        super.ready();

        // avatar
        this.$.avatar.addEventListener('media-info-updated', (e) => {
            // const mediaInfo = e.detail.mediaInfo.palette;
            // const color = this.theme == 'light' ? mediaInfo.LightVibrant.rgb : mediaInfo.DarkVibrant.rgb;
            // this.$.info.style.backgroundColor = `rgb(${color.join()})`;
            this.$.avatar.lazyload();
        });
        // this.$.avatar.addEventListener('media-loading', (e) => {
        //   this.style.setProperty('--klog-header-background', `url('${this.$.avatar.$.img.src}')`);
        // });

        // filter
        this.addEventListener('timeline-set-filter', (e) => {
            e.stopPropagation();
            this.$.keywordInput.value = e.detail.keyword;
            this.setFilter(e);
        });

        // scroll
        this._superScrollHandler = this._scrollHandler;
        this._lastY = 0;
        this._scrollHandler = e => {
            if (!this.$.scrollTarget) return;
            let y = this.$.scrollTarget.scrollTop;
            let speed = y - this._lastY;
            let h = this.$.info.clientHeight;
            let progress = y / h;
            if (this.mobile) {
                this.$.info.style.transform = `scale(${Math.max(0.95, 1 - progress * 0.1 * 3)})`;
                const marginTop = 32;
                const headerHeight = 64;
                const fast = 2;
                let speedUp = Math.max(Math.min(y * (fast - 1), (h + marginTop) / fast * (fast - 1)), 0);
                let slowDown = 0;
                this.$.info.style.marginTop = `${marginTop + headerHeight - speedUp + slowDown}px`;
            } else {
                this.$.info.style.borderRadius = '';
                this.$.info.style.marginTop = '122px';
                if (speed > 20) {
                    this.$.info.style.transform = `translateY(-${Math.min(48, y)}px)scale(0.9)`;
                }
                if (speed < -20 || y < 48) {
                    this.$.info.style.transform = 'translateY(0px)scale(1)';
                }
            }
            this._superScrollHandler(e);
            this._lastY = y;
        };

        // data
        this.$.data.select = ['type', 'detail', 'referTo', 'author', 'title', 'text', 'createTime', 'markdown', 'type', 'image', 'topic', 'path', 'collection', 'date', 'attachments', 'collection', 'tags'];
        this.$.data.include = ['author', 'topic'];
    }

    async unload() {
        await super.unload();
    }

    async update(userLoadPromise, subroute) {
        // author publicinfo
        if (subroute.prefix === '/zone') {
            this.authorPublicId = subroute.path.replace(/[\/\\]/, '');
            this.cardBackTo = 'zone/' + this.authorPublicId;
            await this.loadAuthorPublic('id', this.authorPublicId);
        } else {
            this.authorUsername = subroute.prefix.replace(/[\/\\]/, '');
            this.cardBackTo = this.authorUsername + (subroute.path || '');
            await this.loadAuthorPublic('username', this.authorUsername);
            this.authorPublicId = this.authorPublic.objectId;
        }
        this.$.avatar.lazy = true;
        // timeline
        let needRefresh = this.$.data.userPublicId != this.authorPublicId;
        this.$.data.userPublicId = this.authorPublicId;
        if (!this.isTimelineInit) {
            this.isTimelineInit = true;
            this._scrollHandler();
            this.$.scrollTarget.scrollTop = 0;
            this.loading = true;
            await this.refresh();
        } else {
            const y = this._lastScrollY || 0;
            this.$.scrollTarget.scrollTop = y;
            this._scrollHandler();
            await this._refreshAllItems();
            if (needRefresh) {
                this.loading = true;
                await this.refresh();
            }
        }
        await new Promise(resolve=>setTimeout(resolve, 100));
    }

    back() {
        this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: 'timeline' } }));
    }

    async loadAuthorPublic(key, value) {
        let authorPublic;
        if (key == 'id') {
            authorPublic = await this.loadUserPublic(value);
        } else if (key == 'username') {
            authorPublic = await this.loadUserPublicByUsername(value);
        }
        if (!authorPublic.introduction) {
            authorPublic.introduction = 'PLACEHOLDER_FOR_THOSE_LAZY_PEOPLE_WHO_DO_NOT_WRITE_ANYTHING_DESCRIBING_THEMSELVES';
        }
        this.authorPublic = authorPublic;
    }
}

window.customElements.define(KlogZone.is, KlogZone);