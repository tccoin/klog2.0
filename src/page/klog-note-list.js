import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '../style/klog-style-scrollbar.js';
import '../style/klog-style-toolbar.js';
import '../ui/klog-icons.js';
import '../data/klog-data-list.js';
import './klog-note-item.js';
import './klog-note-search.js';

class KlogNoteList extends PolymerElement {
  static get template() {
    return html`
    <style include="klog-style-scrollbar"></style>
    <style include="klog-style-toolbar"></style>
    <style>
      :host {
        width: var(--klog-note-list-width);
        flex-shrink: 0;
        border-right: 1px solid var(--divider);
        height: calc(var(--klog-layout-page-height) - 64px);
      }

      /*container*/
      .main-container {
        position: relative;
        max-height: calc(var(--klog-pages-height) - 78px);
        z-index: 2;
        overflow-x: hidden;
        overflow-y: auto;
        opacity: 1;
        transition: opacity .1s ease;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }

      :host([loading]) .main-container {
        opacity: 0;
      }

      .spinner-container {
        @apply(--fit-layout);
        top: 64px;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--surface);
        opacity: 0;
        transition: opacity .2s ease;
        --paper-spinner-color: var(--on-background);
      }

      :host([loading]) .spinner-container {
        opacity: 1;
      }

      /*header*/
      .header-container {
        position: fixed;
        width: var(--klog-note-list-width);
        top: 0px;
        z-index: 100;
        left: 0;
        transition: all .15s ease;
        cursor: default;
        border-radius: 12px 0 0 0;
        background-color: var(--surface);
        @apply(--shadow-none);
      }

      .header-container::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: -1;
        background-color: var(--primary);
        border-radius: 12px 0 0 0;
        opacity: 0;
        transition: opacity .4s ease;
      }

      .header-container.raised {
        border-bottom: none;
        @apply(--shadow-elevation-2dp);
      }

      
      .header-container.raised::after {
        opacity: 0.05;
      }

      .header-container .title {
        display: block;
        width: calc(100% - 56px);
        box-sizing: border-box;
        font-size: 20px;
        padding: 12px 16px 12px;
        color: var(--on-surface);
        font-weight: bold;
        line-height: 38px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .header-container paper-icon-button {
        background: var(--on-background);
        color: var(--surface);
        border-radius: 50%;
        width: 22px;
        height: 22px;
        padding: 2px;
        margin: 8px;
        line-height: 0;
        opacity: 0.3;
      }

      :host([gesture]) .gesture-indicator {
        display: block;
        position: absolute;
        top: 8px;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        height: 4px;
        width: 24px;
        background-color: var(--overlay-background);
        opacity: var(--overlay-opacity);
        border-radius: 2px;
        transition: opacity .1s ease;
      }

      :host([gesture][moving]) .gesture-indicator {
        opacity: var(--secondary-overlay-opacity);
      }

      .header-container klog-note-search {
        width: 100%;
        padding: 0 16px 16px;
        box-sizing: border-box;
      }

      /*list*/

      .items {
        padding-top: 62px;
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
        scroll-snap-type: y mandatory;
        scroll-padding-top: 62px;
      }

      .items .divider {
        height: 1px;
        background: var(--divider);
        margin: 0 16px;
      }

      .search-placeholder {
        height: 56px;
      }

      .items .divider:first-child {
        display: none;
      }

      @media (max-width: 767px) {
        .header-container {
          width: 100%;
          border-radius: 12px 12px 0 0;
        }

        .header-container::after {
          border-radius: 12px 12px 0 0;
        }

        .header-container .title {
          font-size: 16px;
          padding: 8px 16px;
        }

        .main-container {
          max-height: calc(var(--klog-pages-height) - 118px - var(--safe-area-inset-top));
        }

        .items {
          padding-top: 54px;
          scroll-padding-top: 54px;
        }

        .spinner-container {
          top: 100px;
        }
      }
    </style>

    <klog-data-list id="data" last-response="{{list}}" loading="{{loading}}" userinfo="{{userinfo}}" keyword="{{keyword}}" collection="{{collection}}" bookmarks="{{bookmarks}}"></klog-data-list>

    <div class="header-container" id="header">
      <div class="title">{{title}}</div>
      <klog-note-search id="search" keyword="{{keyword}}" userinfo="{{userinfo}}" on-click="search"></klog-note-search>
    </div>

    <div class="spinner-container">
      <paper-spinner-lite active=""></paper-spinner-lite>
    </div>

    <div class="main-container items" id="items">
      <div class="search-placeholder item"></div>
      <template is="dom-repeat" items="{{items}}">
        <klog-note-item class="item" data="{{item}}" collection="{{collection}}"></klog-note-item>
        <div class="divider"></div>
      </template>
    </div>
`;
  }

  static get is() { return 'klog-note-list'; }

  static get properties() {
    return {
      loading: {
        type: Boolean,
        reflectToAttribute: true
      },
      gesture: {
        type: Boolean,
        reflectToAttribute: true
      },
      moving: {
        type: Boolean,
        reflectToAttribute: true
      },
      keyword: {
        type: String,
        notify: true,
        observer: 'load'
      },
      list: {
        type: Array,
        observer: '_loadNewPage'
      },
      collection: {
        type: String,
        notify: true,
        observer: 'load'
      },
      title: {
        type: String,
      }
    };
  }

  static get observers() {
    return [
      'updateTitle(keyword,collection)'
    ];
  }

  openMainDrawer() {
    this.dispatchEvent(new CustomEvent('main-drawer-open', { bubbles: true, composed: true }));
  }

  ready() {
    super.ready();
    //events
    this.$.scrollTarget = this.$.items;
    this.$.scrollTarget.addEventListener('scroll', () => {
      if (this._scrollingTimeout) { window.clearTimeout(this._scrollingTimeout); }
      this._scrollingTimeout = setTimeout(() => {
        this.scroll(false);
      }, 1000);
      this.scroll(true);
    });
    this.addEventListener('touchstart', e => {
      this._isMoving = true;
    });
    this.addEventListener('touchend', e => {
      this._isMoving = false;
      this.scroll(false);
    });
    this.$.header.addEventListener('touchstart', e => {
      this.dispatchEvent(new CustomEvent('klog-backdrop-touchstart', { bubbles: true, composed: true, detail: { touches: e.touches } }));
    });

    //page loader
    this._initPageloader();

    // observer for container height
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    let observer = new MutationObserver(() => this.updateContainer());
    observer.observe(this.$.items, { childList: true });
  }

  scroll(isScrolling) {
    let y = this.$.scrollTarget.scrollTop;
    if (!this._searchHeight) this.updateContainer();
    let threshold = this._searchHeight;
    isScrolling = !!(isScrolling || this._isMoving);
    // searchbar animation
    this.$.search.setWidth(this.offsetWidth);
    this.$.search.setAnimation(1 - y / threshold);
    // scroll according to the threshold
    if (!isScrolling) {
      if (y < threshold * 0.7) this.$.scrollTarget.scrollTop = 0;
      else if (y < threshold) this.$.scrollTarget.scrollTop = threshold;
    }
    // raise the header
    if (y >= threshold) this.$.header.classList.add('raised');
    else this.$.header.classList.remove('raised');
    // focus event
    if (y == 0 && this._waitingToFocus) {
      this._waitingToFocus = false;
      this.$.search.focus();
    }
  }

  load(property, oldProperty) {
    if (!property && !oldProperty) return;
    this.$.scrollTarget.scrollTop = 0;
    this.$.scrollTarget.addEventListener('scroll', this._pageScrollHandler);
    this.$.data.load().then(list => {
      if (list.length == 0 || this.path) return;
      // load the first result in background
      this.dispatchEvent(new CustomEvent('note-update-path', {
        detail: {
          path: list[0].path
        },
        bubbles: true,
        composed: true
      }));
    });
  }

  unload() {
    this.$.scrollTarget.removeEventListener('scroll', this._pageScrollHandler);
  }

  updateContainer() {
    if (!this._searchHeight) this._searchHeight = parseInt(this.$.search.getBoundingClientRect().height);
    let scrollTargetHeight = this.$.scrollTarget.getBoundingClientRect().height;
    let itemsComputedStyle = getComputedStyle(this.$.items);
    let itemsHeight = parseFloat(itemsComputedStyle.height) + parseFloat(itemsComputedStyle.paddingTop);
    let threshold = this._searchHeight;
    if (itemsHeight > scrollTargetHeight) {
      let padding = Math.max(threshold - (itemsHeight - scrollTargetHeight), 0);
      this.$.items.style.paddingBottom = padding + 'px';
    }
  }

  search() {
    this._waitingToFocus = true;
    this.$.scrollTarget.scrollTop = 0;
  }

  updateTitle(keyword, collection) {
    let title;
    if (keyword) title = `搜索“${keyword}”`;
    else if (collection == 'all') title = '所有笔记';
    else if (collection) title = collection;
    this.title = title;
  }

  _initPageloader() {
    this._pageSize = 20;
    this._resetPage();
    this._pageScrollHandler = e => {
      let y = this.$.scrollTarget.scrollTop;
      let wh = this.scrollHeight; // container height
      let eh = this.$.items.scrollHeight; // element height
      if (y + wh * 1.4 >= eh) {
        this._loadNextPage();
      }
    };
  }

  _loadNewPage(list) {
    this._items = list;
    this._resetPage();
    this._loadNextPage();
  }

  _resetPage() {
    this._pageNumber = 0;
    this._eof = false;
  }

  _loadNextPage() {
    this._pageNumber++;
    this.items = this._items.slice(0, this._pageNumber * this._pageSize);
    if (this._pageNumber * this._pageSize >= this._items.length) {
      this._eof = true;
    }
  }
}

window.customElements.define(KlogNoteList.is, KlogNoteList);