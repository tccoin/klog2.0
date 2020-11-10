import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
import '../ui/klog-icons.js';
import '../style/klog-style-layout.js';
import '../style/klog-style-scrollbar.js';
import '../style/klog-style-timeline.js';
import './klog-timeline-item.js';
import '../ui/klog-chip.js';
import '../ui/klog-fab.js';

import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

class KlogTimeline extends PolymerElement {
  static get template() {
    return html `
      ${this.styleTemplate}
      ${this.contentTemplate}
    `;
  }

  static get styleTemplate() {
    return html `
    <style include="klog-style-layout"></style>
    <style include="klog-style-scrollbar"></style>
    <style include="klog-style-timeline"></style>
    `;
  }

  static get contentTemplate() {
    return html `
    <klog-data-timeline id="data" last-response="{{list}}"></klog-data-timeline>
    <klog-fab icon="refresh" id="updateButton" label="立即刷新" on-click="timelineUpdated" hidden="{{updateButtonHidden}}" extended="{{updateButtonExtended}}"></klog-fab>
    <div class="main-container" id="container">
      <div class="page-header-container item" id="pageHeader" hidden="{{mobile}}">
        <span class="page-header-title">时间轴</span>
        <span class="page-header-subtitle">不要温和地走进那个良夜。<br>怒斥，怒斥光明的消逝。</span>
      </div>
      
      <klog-chip name="search" id="mobileSearchInput" icon="search" hidden="{{!mobile}}" checkmark-animation-disabled>
        <input slot="expand-content" id="keywordInput">
        <paper-icon-button slot="expand-content" icon="close" on-click="_mobileSearchClose"></paper-icon-button>
      </klog-chip>
      <div class="filter-container item" id="filter" on-click="setFilter">
        <klog-chip name="default" label="全部"></klog-chip>
        <klog-chip name="daily" label="日常"></klog-chip>
        <klog-chip name="note" label="笔记"></klog-chip>
        <klog-chip name="gallery" label="相册"></klog-chip>
        <klog-chip name="search" icon="search" on-click="setFilter" hidden="{{mobile}}" checkmark-animation-disabled>
          <input slot="expand-content" id="keywordInput">
        </klog-chip>
      </div>
      <div class="timeline-container" id="timelineContainer">
        <template is="dom-repeat" items="{{cards}}">
          <klog-timeline-item class="item" data="{{item}}" mobile="{{mobile}}" theme="{{theme}}"></klog-timeline-item>
        </template>
        <div class="eof" hidden="{{!_eof}}">Klog 奇点</div>
      </div>
    </div>
    `;
  }

  static get is() { return 'klog-timeline'; }

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
      mobile: {
        type: Boolean,
        reflectToAttribute: true
      },
      layout: {
        type: Object,
        value: {
          documentTitle: '时间轴 - Klog',
          drawer: 'auto',
          mainMenu: true,
          sidebar: 'auto',
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
              { name: 'help', text: 'Klog入门', icon: 'bookmark' },
              { name: 'log', text: '最近更新', icon: 'bookmark' },
            ]
          }],
          styles: {
            '--klog-header-background': { mobile: 'var(--primary-background-color)', desktop: 'transparent' },
            '--klog-header-text-color': 'var(--primary-text-color)',
          },
          toolbar: html `
              <app-toolbar>
                <paper-icon-button icon="menu" name="drawer-button"></paper-icon-button>
                <div class="title" on-click="refresh">
                  <div main-title><iron-icon icon="klog"></iron-icon></div>
                  <paper-ripple></paper-ripple>
                </div>
                <div class="divider"></div>
                <paper-icon-button on-click="_mobileSearch" icon="search" mobile></paper-icon-button>
                <paper-button on-click="add" mobile>
                  <iron-icon icon="post_add"></iron-icon>
                  <span>优里卡！</span>
                </paper-button>
              </app-toolbar>`
        }
      },
    };
  }

  openDrawer() {
    this.dispatchEvent(new CustomEvent('drawer-toggle', { bubbles: true, composed: true }));
  }

  async load(userLoadPromise) {
    this.$.scrollTarget.style.setProperty('scroll-behavior', '');
    this.$.scrollTarget.addEventListener('scroll', this._scrollHandler);
    this.$.scrollTarget.addEventListener('scroll', this._pageScrollHandler);
  }

  async update(subroute) {
    if (!this.isTimelineInit) {
      this.isTimelineInit = true;
      await this.refresh();
      await this._scrollHandler();
      this.$.scrollTarget.scrollTop = 0;
    } else {
      this.loading = false;
      const y = this._lastScrollY || 0;
      this.$.scrollTarget.scrollTop = y;
      await this._scrollHandler();
      await this._refreshAllItems()
      await this.checkUpdate();
    }
  }

  async unload() {
    this.$.scrollTarget.style.setProperty('scroll-behavior', 'smooth');
    this.$.scrollTarget.removeEventListener('scroll', this._scrollHandler);
    this.$.scrollTarget.removeEventListener('scroll', this._pageScrollHandler);
    this._lastScrollY = this.$.scrollTarget.scrollTop;
    this.loading = true;
    await this._timeout(new Promise(resolve => {
      this.$.timelineContainer.addEventListener('transitionend', resolve)
    }), 500);
  }

  async updateTimeline(background = true, offline = false) {
    if (!background) {
      let promises = [];
      if (!this.loading) {
        this.loading = true;
        promises.push(this._timeout(new Promise(resolve => {
          this.$.timelineContainer.addEventListener('transitionend', resolve)
        }), 500));
      }
      if (!offline) {
        promises.push(this.$.data.load());
      }
      await Promise.all(promises);
      this.timelineUpdated(false);
    } else {
      await this.$.data.load();
      const token = x => x.objectId + x.updatedAt + x.title + x.path + x.text;
      let newList = this._calculateCards(this.list);
      if (this._cards.length > 0 && newList.length > 0 && token(newList[0]) != token(this._cards[0])) {
        this.updateButtonHidden = false;
      }
    }
  }

  async timelineUpdated(background = true) {
    // 数据加载完成,更新UI
    window._imageLoadingQueue = undefined;
    if (background) {
      this.loading = true;
      this.updateButtonHidden = true;
      await this._timeout(new Promise(resolve => { this.$.timelineContainer.addEventListener('transitionend', resolve) }), 500);
    }
    await this._loadNewPage(this.list)
    await new Promise(resolve => afterNextRender(this, resolve));
    await this._refreshAllItems()
    await this._clearLazyState()
    this.loading = false;
    await this._timeout(new Promise(resolve => { this.$.timelineContainer.addEventListener('transitionend', resolve) }), 500);
    await this._scrollHandler()
  }

  ready() {
    super.ready();
    this._initScroller();
    this._initPageloader();

    this._item = document.createElement('klog-timeline-item');

    this.filterPreset = {
      default: { view: 'default', keyword: '' },
      search: { view: 'default', keyword: '' },
      note: { view: 'default', keyword: '笔记' },
      daily: { view: 'default', keyword: '日常' },
      gallery: { view: 'gallery', keyword: '' },
    };

    this.viewPreset = {
      default: {
        pageSize: 15
      },
      gallery: {
        pageSize: 7,
        requiredAttachments: x => this._item.calculateIsGallery(x.filter(y => y.image))
      }
    };

    this.$.keywordInput.addEventListener('input', () => {
      const cb = () => {
        if (this.filterName == 'search') {
          this.keyword = this.$.keywordInput.value;
          this.updateTimeline(false, true);
        }
      };
      if (this._keywordInputTimeout) {
        clearTimeout(this._keywordInputTimeout);
      }
      this._keywordInputTimeout = setTimeout(cb, 1000);
    });
  }

  menuSelect(category, item) {
    if (category == 'timeline' && item == 'add') {
      this.add();
    } else {
      this.dispatchEvent(new CustomEvent('about-' + item, { bubbles: true, composed: true }));
    }
  }

  _initScroller() {
    this._scrollHandler = e => {
      if (!this.$.scrollTarget) return;
      let y = this.$.scrollTarget.scrollTop;
      this.updateButtonExtended = y == 0 || !this.mobile;
      // header animation
      if (y > 16) {
        let progress = Math.max(0, Math.min(1, (this.$.pageHeader.offsetTop + this.$.pageHeader.offsetHeight - y - 32) / 32));
        this.$.pageHeader.style.transform = `scale(${0.95 + progress * 0.05})`;
        this.$.pageHeader.style.opacity = progress;
      } else {
        this.$.pageHeader.style.transform = `scale(1)`;
        this.$.pageHeader.style.opacity = 1;
      }
      // filter animation
      if (y > 16) {
        let progress = Math.max(0, Math.min(1, (this.$.filter.offsetTop + this.$.filter.offsetHeight - y - 32) / 32));
        this.$.filter.style.transform = `scale(${0.95 + progress * 0.05})`;
        this.$.filter.style.opacity = progress;
      } else {
        this.$.filter.style.transform = `scale(1)`;
        this.$.filter.style.opacity = 1;
      }
      // calculate intersecting list
      let intersectinglist = [];
      let items = this.$.container.querySelectorAll('klog-timeline-item');
      for (let item of items) {
        let windowHeight = document.body.offsetHeight;
        let itemTop = item.getBoundingClientRect().top;
        let itemHeight = item.offsetHeight;
        if (itemTop + itemHeight >= 0 && itemTop <= windowHeight * 1.2) {
          intersectinglist.push(item);
        }
        if (itemTop > windowHeight) { break }
      }
      // update intersecting animation
      for (let target of intersectinglist) {
        let margin = target.offsetTop + target.offsetHeight - y;
        let progress1 = Math.max(0, Math.min(1, (margin - 64) / 64));
        let progress2 = Math.max(0, Math.min(1, margin / target.offsetHeight));
        target.style.transform = `scale(${0.9 + progress2 * 0.1})`;
        if (this.preference && this.preference.backdropBlurEnabled) {
          target.style.opacity = 1;
        } else {
          target.style.opacity = progress1;
        }
      }
      // lazy load
      for (let target of intersectinglist) {
        if (!target.hasAttribute("lazy-loaded")) {
          target.setAttribute("lazy-loaded", '');
          target.lazyload();
        }
      }
    };
  }

  _mobileSearch() {
    this.setFilter({
      detail: {
        filterName: 'search'
      }
    });
  }

  _mobileSearchClose() {
    this.setFilter({
      detail: {
        filterName: 'default'
      }
    });
  }

  setFilter(e) {
    if (!e.detail.filterName && e.target.tagName != 'KLOG-CHIP') { return; }
    const filterName = e.detail.filterName || e.target.getAttribute('name');
    // view
    const newView = this.filterPreset[filterName].view || 'default';
    // keyword
    let newKeyword;
    if (filterName == 'search') {
      this.$.keywordInput.focus();
      newKeyword = this.$.keywordInput.value;
    } else {
      newKeyword = this.filterPreset[filterName].keyword || '';
    }
    // duplicated
    if (this.view == newView && this.keyword == newKeyword && this.filterName == filterName) {
      return;
    }
    this.view = newView;
    this.keyword = newKeyword;
    this.updateTimeline(false, true);
    this.updateView();
    this.filterName = filterName;
  }

  updateView(e) {
    this.pageSize = this.viewPreset[this.view].pageSize;
  }

  _filterNameUpdate(filterName, oldFilterName) {
    let activeChip, oldActiveChip;
    activeChip = filterName ? this._getChip(filterName) : this.$.defaultFilter;
    if (oldFilterName) {
      oldActiveChip = this._getChip(oldFilterName);
    } else {
      oldActiveChip = this.$.defaultFilter;
    }
    if (!filterName) {
      if (this.$.defaultFilter.active) return
      oldActiveChip.active = false;
      this.$.defaultFilter.active = true;
    } else {
      if (oldActiveChip)
        oldActiveChip.active = false;
      activeChip.active = true;
    }
  }

  _getChip(filterName) {
    if (filterName == 'search' && this.mobile) {
      return this.$.container.querySelector(`#mobileSearchInput`);
    } else {
      return this.$.container.querySelector(`[name=${filterName}]:not([hidden])`);
    }
  }

  _initPageloader() {
    this.pageSize = 20;
    this._resetPage();
    this._pageScrollHandler = e => {
      let y = this.$.scrollTarget.scrollTop;
      let wh = window.innerHeight; // container height
      let eh = this.scrollHeight; // element height
      if (y + wh * 1.4 >= eh) {
        this._loadNextPage();
      }
    };
  }

  _loadNewPage(list) {
    this._cards = this._calculateCards(list);
    this._resetPage();
    this._loadNextPage();
  }

  _resetPage() {
    this._pageNumber = 0;
    this._eof = false;
  }

  _loadNextPage() {
    if (!this._cards) return;
    // page control
    this._pageNumber++;
    this.cards = this._cards.slice(0, this._pageNumber * this.pageSize);

    if (this._pageNumber * this.pageSize >= this._cards.length) {
      this._eof = true;
    }
  }

  _calculateCards(list) {
    // process the original article list with filter settings
    if (!list) return [];
    let cards = list;
    // filter
    if (this.keyword != '') {
      cards = cards.filter(x => {
        const attrs = ['title', 'text', 'collection', 'tags'];
        let hasKeyword = false;
        for (let attr of attrs) {
          if (x[attr]) {
            let value = typeof(x[attr]) == 'string' ? x[attr] : x[attr].toString();
            hasKeyword |= value.indexOf(this.keyword) > -1
          }
        }
        return hasKeyword;
      });
    }
    // view
    if (this.viewPreset[this.view].requiredAttachments) {
      cards = cards.filter(x => this.viewPreset[this.view].requiredAttachments(x.attachments));
    }
    for (let card of cards) {
      card.view = this.view;
    }
    return cards;
  }

  add() {
    this.dispatchEvent(new CustomEvent('editor-open', {
      bubbles: true,
      composed: true,
      detail: {
        backTo: window.location.hash,
        preset: {
          markdown: '@(日常)[]',
          private: false
        }
      }
    }));
  }

  checkUpdate() {
    return this.updateTimeline(true);
  }

  refresh() {
    if (this.$.scrollTarget) {
      this.$.scrollTarget.scrollTop = 0;
    }
    return this.updateTimeline(false);
  }

  _timeout(promise, timeout) {
    return Promise.race([
      promise,
      new Promise(resolve => { setTimeout(resolve, timeout) })
    ]);
  }

  _refreshAllItems() {
    const promises = [];
    for (let item of this.$.timelineContainer.querySelectorAll('.item')) {
      item.removeAttribute('style');
      promises.push(item.refresh());
    }
    return Promise.all(promises);
  }

  _clearLazyState() {
    const elements = this.$.timelineContainer.querySelectorAll('klog-timeline-item[lazy-loaded]');
    for (let element of elements) {
      element.removeAttribute('lazy-loaded');
    }
  }

  _clearItemsStyle() {
    const elements = this.$.timelineContainer.querySelectorAll('klog-timeline-item[style]');
    for (let element of elements) {
      element.removeAttribute('style');
    }
  }
}

window.customElements.define(KlogTimeline.is, KlogTimeline);

export { KlogTimeline };