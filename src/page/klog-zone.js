import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogTimeline } from './klog-timeline.js';
import { KlogDataUserPublicMixin } from '../data/klog-data-user-public-mixin.js';
import '../ui/klog-image.js';
import '../style/klog-style-card.js';

class KlogZone extends KlogDataUserPublicMixin(KlogTimeline) {
  static get template() {
    return html`
    ${this.styleTemplate}
    ${this.zoneStyletemplate}
      ${this.contentTemplate}
    `;
  }

  static get zoneStyletemplate() {
    return html`
    <style include="klog-style-card"></style>
    <style>
    .info-container{
      width: 300px;
      padding: 0 16px;
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
    }
    :host([mobile]) .info-container{
      width: 100vw;
      height: auto;
      position: relative;
      bottom: auto;
    }
    .main-container{
      padding-left:300px;
    }
    :host([mobile]) .main-container{
      padding-left: 0;
      padding-top: 24px;
    }
    .info-container paper-button{
      width: 100%;
      font-size: 15px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
    }
    .info-container paper-button iron-icon{
      padding-right: 8px;
    }
    .author-avatar{
      width: 75px;
      height: 75px;
      border-radius: 5px;
      --klog-media-border-radius: 5px;
      margin: 64px 0 16px;
      @apply --shadow-elevation-2dp;
    }
    .author-name{
      margin: 16px auto 16px;
      font-size: 1.4em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
    }
    :host([exit]) .info-container {
      transform: translateX(-5vh);
      opacity: 0;
    }
    </style>
    `;
  }

  static get contentTemplate() {
    return html`
    <klog-data-list id="data" type="timeline" last-response="{{list}}" keyword="{{keyword}}" key="date"></klog-data-list>
    <klog-fab icon="refresh" id="updateButton" label="立即刷新" on-click="timelineUpdated" hidden="{{updateButtonHidden}}" extended="{{updateButtonExtended}}"></klog-fab>
    <div class="info-container klog-card" id="info">
    <paper-button on-click="back"><iron-icon icon="arrow_back"></iron-icon>返回 Klog</paper-button>
    <klog-image class="author-avatar" src="{{authorPublic.avatarUrl}}" avatar></klog-image>
    <div class="author-name">{{authorPublic.displayName}}</div>
    <div class="author-introduction">{{authorPublic.introduction}}</div>
    </div>
    <div class="main-container" id="container">
      <div class="filter-container item" id="filter" on-click="setFilter">
        <klog-chip name="search" icon="search" checkmark-animation-disabled>
          <input slot="expand-content" id="keywordInput">
        </klog-chip>
        <klog-chip name="default" label="全部文章"></klog-chip>
        <klog-chip name="daily" label="日常"></klog-chip>
        <klog-chip name="note" label="笔记"></klog-chip>
        <klog-chip name="gallery" label="相册"></klog-chip>
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
          toolbar: html``
        }
      },
    };
  }

  async update(subroute) {
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
    this.authorPublic = await this.loadUserPublic(authorPublicId);
  }
}

window.customElements.define(KlogZone.is, KlogZone);
