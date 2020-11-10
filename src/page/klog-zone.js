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
      .info-container{
        width: 300px;
        padding: 0 16px;
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        border-radius: 0;
      }
      :host([mobile]) .info-container{
        width: 100vw;
        height: auto;
        position: relative;
        bottom: auto;
      }
      .info-container::after {
        @apply --overlay-style;
        z-index: -2;
        background: var(--klog-header-background);
        transition: all .25s ease;
        filter: blur(15px);
        background-size: cover;
        background-position: center center;
        transform: scale(1.3);
        opacity: 1;
      }
      .info-container::before {
        @apply --overlay-style;
        z-index: -1;
        background: var(--primary-background-color);
        opacity: 0.7;
      }
      .main-container{
        padding-left:300px;
      }
      :host([mobile]) .main-container{
        padding-left: 0;
        padding-top: 24px;
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
        width: 100px;
        height: 100px;
        border-radius: 5px;
        --klog-media-border-radius: 5px;
        margin: 64px auto 16px;
        @apply --shadow-elevation-2dp;
      }
      .author-name{
        margin: 16px auto 16px;
        font-size: 1.4em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
        text-align: center;
      }
      .author-introduction{
        word-break: break-word;
        color: var(--secondary-text-color);
        text-align: center;
        margin-bottom: calc(var(--klog-card-padding) * 3);
      }
      :host([exit]) .info-container {
        transform: translateX(-5vh);
        opacity: 0;
      }
    </style>
    `;
  }

  static get contentTemplate() {
    return html `
    <klog-data-list id="data" type="timeline" last-response="{{list}}" keyword="{{keyword}}" key="date"></klog-data-list>
    <klog-fab icon="refresh" id="updateButton" label="立即刷新" on-click="timelineUpdated" hidden="{{updateButtonHidden}}" extended="{{updateButtonExtended}}"></klog-fab>
    <div class="info-container klog-card" id="info">
      <div class="info-container-header">
        <paper-button on-click="back"><iron-icon icon="arrow_back"></iron-icon>返回 Klog</paper-button>
        <paper-icon-button on-click="_mobileSearch" icon="search" hidden="{{!mobile}}"></paper-icon-button>
      </div>
      <klog-image class="author-avatar" id="avatar" src="{{authorPublic.avatarUrl}}" theme="{{theme}}" lazy fixed avatar></klog-image>
      <div class="author-name">{{authorPublic.displayName}}</div>
      <div class="author-introduction">{{authorPublic.introduction}}</div>
    </div>
    <div class="main-container" id="container">
      <div id="pageHeader"></div>
      <klog-chip name="search" id="mobileSearchInput" icon="search" hidden="{{!mobile}}" checkmark-animation-disabled>
        <input slot="expand-content" id="keywordInputMobile">
        <paper-icon-button slot="expand-content" icon="close" on-click="_mobileSearchClose"></paper-icon-button>
      </klog-chip>
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
          mainMenu: true,
          sidebar: 'off',
          scrollToTop: false,
          header: {
            fixed: true,
            short: false,
            shadow: { mobile: 'on', desktop: 'off' },
          },
          customMenu: [{
            name: 'timeline',
            text: '时间轴',
            items: [
              { name: 'add', text: '优里卡！', icon: 'post_add', raised: true },
              { name: 'help', text: '写作入门', icon: 'bookmark' },
              { name: 'log', text: '最近更新', icon: 'bookmark' },
            ]
          }],
          styles: {
            '--klog-header-background': { mobile: 'var(--primary-background-color)', desktop: 'transparent' },
            '--klog-header-text-color': 'var(--primary-text-color)',
          },
          toolbar: html ``
        }
      },
    };
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
  }

  unload() {
    this.$.avatar.lazy = true;
  }

  async update(subroute) {
    this.loading = true;
    this.authorPublicId = subroute.path.replace(/[\/\\]/, '');
    this.cardBackTo = 'zone/' + this.authorPublicId;
    // author publicinfo
    this.loadAuthorPublic(this.authorPublicId);
    // timeline
    this.$.data.userPublicId = this.authorPublicId;
    if (!this.isTimelineInit) {
      this.$.data.select = ['type', 'detail', 'referTo', 'author', 'title', 'text', 'createTime', 'markdown', 'type', 'image', 'topic', 'path', 'collection', 'date', 'attachments', 'collection', 'tags'];
      this.$.data.include = ['author', 'topic'];
      this.isTimelineInit = true;
      await this.refresh();
      await this._scrollHandler();
      this.$.scrollTarget.scrollTop = 0;
    } else {
      this.loading = false;
      const y = this._lastScrollY || 0;
      this.$.scrollTarget.scrollTop = y;
      await this.refresh();
      await this._scrollHandler();
    }
  }

  back() {
    this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: 'timeline' } }));
  }

  async loadAuthorPublic(authorPublicId) {
    let authorPublic = await this.loadUserPublic(authorPublicId);
    if (!authorPublic.introduction) {
      authorPublic.introduction = 'PLACEHOLDER_FOR_THOSE_LAZY_PEOPLE_WHO_DO_NOT_WRITE_ANYTHING_DESCRIBING_THEMSELVES';
    }
    this.authorPublic = authorPublic;
  }
}

window.customElements.define(KlogZone.is, KlogZone);