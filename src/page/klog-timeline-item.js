import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogDynamicTheme } from '../framework/klog-dynamic-theme.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '../ui/klog-icons.js';
import '../data/klog-data-timeline.js';
import '../ui/klog-image.js';
import '../style/klog-style-card.js';
import '../ui/klog-render-timestamp.js';

class KlogTimelineItem extends PolymerElement {
  static get template() {
    return html`
    <style include="klog-style-card"></style>
    <style>
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: default;
        width: 100%;
        color: var(--on-surface);
        --primary-font-size: 14px;
        --secondary-font-size: 12px;
        --klog-media-transition-time: .2s;
        user-select: none;
        -webkit-user-select: none;
      }

      a {
        outline: none;
        text-decoration: none;
        width: 100%;
        display: block;
        color: inherit;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-tap-highlight-color: transparent;
      }

      .card {
        width: calc(100% - 16px);
      }

      .card > *{
        z-index: 1;
        position: relative;
      }

      .klog-card .card-title h1 {
        display: inline;
        font-size: inherit;
        color: var(--secondary);
        box-shadow: 0 -0.5em 0px var(--surface-variant) inset;
      }

      .card-subtitle .card-collection:hover,
      .card-meta .meta-title:hover {
        text-decoration: underline;
      }

      .card-subtitle .card-collection {
        color: var(--secondary);
      }

      .content-text klog-render-timestamp {
        font-weight: bolder;
        margin-right:8px;
      }

      .gallery-item {
        flex-basis: calc(33.33% - 1px);
      }

      .card-actions>klog-chip {
        max-width: 268px;
        min-width: 80px;
        margin: 0 8px 4px 0;
        --klog-chip-icon-size: 20px;

        --klog-chip-style: {
          font-size: var(--secondary-font-size, 14px);
          padding: 3px 10px;
        }
      }

      .card-actions>klog-chip[animated] {
        transition: all .2s ease;
      }

      .card-actions>klog-chip[more] {
        margin-right: 0;
        min-width: 0;
        width: 52px;
      }

      .card-actions>klog-chip[more][hidden] {
        display: initial !important;
        transform: scale(0);
        opacity: 0;
        width: 0;
      }

      @media (min-width: 768px) {
        .card:active {
          transform: scale(0.98);
        }
      }

      @media (max-width: 632px) {
        .card-actions>klog-chip {
          max-width: calc(50vw - 32px);
        }
      }
    </style>
    <!--header-->
    <a href="{{server}}#/article/{{data.path}}" id="link">
      <div class="card klog-card klog-card-interactive" raised\$="{{expended}}" on-click="read" mobile\$="{{mobile}}">

        <!--meta-->
        <div class="card-meta" hidden$="{{authorHidden}}">
          <klog-image class="meta-avatar" src="{{data.author.avatarUrl}}" theme="{{theme}}" lazy fixed avatar>
          </klog-image>
          <div class="meta-container">
            <div class="meta-title">{{data.author.displayName}}</div>
          </div>
          <div class="meta-date">
            <klog-render-timestamp time-stamp="{{data.updatedTime}}"></klog-render-timestamp>
          </div>
        </div>

        <!--media-->
        <klog-image id="fullWidthMediaImage" class="card-media" src="{{data.image.url}}" hidden\$="{{!view.fullWidthMedia}}" theme="{{theme}}" lazy="" content="">
        </klog-image>

        <!--title-->
        <div class="card-subtitle" hidden\$="{{!data.title}}">
          <span class="card-collection">{{data.collection}}</span>
          <div class="dot-divider" hidden$="{{!authorHidden}}"></div>
          <klog-render-timestamp time-stamp="{{data.updatedTime}}" hidden$="{{!authorHidden}}"></klog-render-timestamp>
        </div>
        <div class="card-title" hidden\$="{{!data.title}}">
          <h1>{{data.title}}</h1>
        </div>

        <!--content-->
        <div class="card-content" hidden\$="{{!data._text}}">
          <p class="content-text" id="text">
            <klog-render-timestamp time-stamp="{{data.updatedTime}}" hidden\$="{{has(data.title)}}" hidden\$="{{data.title}}"></klog-render-timestamp>
            {{data._text}}
          </p>
          <template is="dom-if" if="{{view.thumbnail}}">
            <klog-image class="content-thumbnail" src="{{data.image.url}}" theme="{{theme}}" lazy="" fixed="" timeline="">
            </klog-image>

          </template>
        </div>

        <!--gallery-->
        <template is="dom-if" if="{{view.gallery}}">
          <div class="card-gallery">
            <template is="dom-repeat" items="{{gallery}}">
              <div class="gallery-container" cover\$="{{item.cover}}">
                <template is="dom-repeat" items="{{item}}">
                  <klog-image class="gallery-item" src="{{item.url}}" theme="{{theme}}" lazy fixed gallery gallery-cover="{{item.cover}}">
                  </klog-image>
                </template>
              </div>
            </template>
          </div>
        </template>

        <!--actions-->
        <div class="card-actions" hidden\$="{{!view.actions}}">
          <template is="dom-repeat" items="{{actions}}">
            <template is="dom-if" if="{{item.file}}">
              <klog-chip outlined="" icon="inbox" href="{{item.url}}" label="{{item.text}}"></klog-chip>
            </template>
            <template is="dom-if" if="{{item.link}}">
              <klog-chip outlined="" icon="link" href="{{item.url}}" label="{{item.text}}"></klog-chip>
            </template>
            <template is="dom-if" if="{{item.more}}">
              <klog-chip outlined="" icon="more_horiz" more="" animated="" on-click="expand"></klog-chip>
            </template>
          </template>
        </div>

      </div>
    </a>
`;
  }

  static get is() { return 'klog-timeline-item'; }

  static get properties() {
    return {
      data: {
        type: Object,
      },
      theme: {
        type: String,
      },
      view: {
        type: Object
      },
      mobile: {
        type: Boolean,
        reflectToAttribute: true
      },
      authorHidden: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
  }

  static get observers() {
    return [
      'refresh(data.attachments, theme)'
    ];
  }

  ready() {
    super.ready();
    window.addEventListener('resize', () => {
      if (this._resizeTimeout) {
        clearTimeout(this._resizeTimeout);
      }
      this._resizeTimeout = setTimeout(() => this.refresh(), 100);
    });
    this.server = window.location.origin + window.location.pathname;
    this.$.link.addEventListener('click', e => {
      e.preventDefault();
      const page = 'article/' + this.data.path;
      this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page } }));
    });
  }

  has(sth) {
    return !(sth == false);
  }

  read(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.classList.contains('card-collection')) {
      this.searchTimeline(e.target.innerText);
    } else if (e.target.classList.contains('meta-avatar') || e.target.classList.contains('meta-title')) {
      const page = this.data.author.username || 'zone/' + this.data.author.objectId;
      this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page } }));
    } else {
      const page = 'article/' + this.data.path;
      this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page } }));
    }
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

  async refresh() {
    this.view = {
      gallery: false,
      fullWidthMedia: false,
      thumbnail: false,
      actions: true
    };
    // update styles
    this._calculateAttachments();
    this._calculateCardStyle();
    this._updateActionsContainer();
    // clamp
    let text = this.$.link.querySelector('#text');
    if (text) {
      $clamp(text, { clamp: this.clamp });
    }
    // color
    this._updateThemeColor();
  }

  async _updateThemeColor() {
    let coverImage;
    this._counter = {};
    await this._waitForElement('.card-meta');
    if (this.view.fullWidthMedia) {
      coverImage = this.$.fullWidthMediaImage;
    } else if (this.view.thumbnail) {
      await this._waitForElement('.card-content klog-image');
      coverImage = this.$.link.querySelector('.card-content klog-image');
    } else if (this.view.gallery) {
      await this._waitForElement('.card-gallery klog-image');
      coverImage = this.$.link.querySelectorAll('.card-gallery klog-image')[0];
    } else {
      return;
    }
    let mediaInfo;
    if (this._mediaInfo) {
      mediaInfo = this._mediaInfo;
    } else {
      mediaInfo = await new Promise(resolve => coverImage.addEventListener('media-info-updated', e => resolve(e.detail.mediaInfo)));
      this._mediaInfo = mediaInfo;
    }
    let themeColor = this.theme == 'light' ? mediaInfo.palette.LightVibrant.rgb : mediaInfo.palette.DarkVibrant.rgb;
    let dynamicTheme = new KlogDynamicTheme();
    dynamicTheme.apply(this, themeColor, this.theme);
    await new Promise(resolve => setTimeout(resolve, 1));
    this.style.removeProperty('--surface');
    this.style.removeProperty('--on-surface');
  }

  async _waitForElement(query) {
    this._counter[query] = (query in this._counter) ? this._counter[query] : 0;
    while (this.$.link.querySelectorAll(query).length == 0 || this._counter[query] == 1000) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    this._counter[query] = 0;
  }

  _calculateCardStyle() {
    // 识别只有图片的文章等
    const view = this.view;
    const data = this.data;
    const text = this.data.text || '';
    const shortenText = text.replace(/\[图片\]/g, '').trim();
    const imageNumber = this.imageNumber;
    const actions = this.actions;
    /*避免修改原数据*/
    data._text = data.text;
    /* 可用性 */
    view.thumbnail = Boolean(data.image.url);
    view.fullWidthMedia = Boolean(data.image.url);
    view.actions = actions.length != 0;
    /* 文字裁剪 */
    this.clamp = 4;
    /* 显示相册 */
    if (this.isGallery) {
      this.clamp = 2;
      view.gallery = true;
      view.fullWidthMedia = false;
      view.thumbnail = false;
      view.actions = false;
      data._text = shortenText;
    }
    if (!view.gallery) {
      if (shortenText.length > 40) {
        /* 显示缩略图 */
        view.fullWidthMedia = false;
      } else {
        /* 大图 */
        this.clamp = 2;
        data._text = shortenText;
        view.thumbnail = false;
      }
    }
    /*更新样式*/
    this.notifyPath('data._text');
    this.notifyPath('view.actions');
    this.notifyPath('view.gallery');
    this.notifyPath('view.thumbnail');
    this.notifyPath('view.fullWidthMedia');
  }

  calculateIsGallery(images) {
    return images.filter(x => x.entropy >= 5).length >= 3;
  }

  _calculateGallery(images) {
    /*determine whether to show gallery*/
    let cover = true;
    let mobile = this.mobile;
    this.imageNumber = images.length;
    this.isGallery = this.calculateIsGallery(images);
    if (!this.isGallery) return [];
    // images[0].entropy += 2;
    // images.sort((a, b) => Math.floor(b.entropy) - Math.floor(a.entropy));
    images = [images[0]].concat(images.slice(1).sort((a, b) => Math.floor(b.entropy) - Math.floor(a.entropy)));
    /*generate gallery*/
    let layout;
    if (this.data.view == 'gallery') {
      layout = mobile ?
        cover ? [4, 2, 3] : [3, 3] :
        cover ? [4, 4, 4] : [4, 4];
    } else {
      layout = mobile ?
        cover ? [4, 2] : [3, 3] :
        cover ? [4, 4] : [4, 4];
    }
    images[0].cover = cover;
    let gallery = [
      []
    ];
    let number = 0;
    for (let image of images) {
      if (layout[0] == 0) {
        layout.shift();
        if (layout.length == 0) break;
        else gallery.push([]);
      }
      if (image.cover) {
        gallery[gallery.length - 1].cover = true;
        layout[0] -= 4;
      } else {
        layout[0] -= 1;
      }
      number += 1;
      gallery[gallery.length - 1].push(image);
    }
    /*count*/
    this.hiddenImageNumber = this.imageNumber - number;
    return gallery;
  }

  _calculateAttachments() {
    // gallery
    let images = this.data.attachments.filter(x => x.image);
    this.gallery = this._calculateGallery(images);
    // links
    let links = this.data.attachments.filter(x => x.link);
    this.links = links;
    // files
    let files = this.data.attachments.filter(x => x.file);
    this.files = files;
    // actions
    let actions = files.concat(links);
    this.actions = actions;
    this.actions = []; // disabled
    this.notifyPath('actions');
  }

  _updateActionsContainer() {
    if (this.actions.filter(x => x.more).length > 0) return;
    const actionsContainer = this.$.link.querySelector('.card-actions');
    actionsContainer.style.height = 'initial';
    if (this._shrinkedChip) {
      this._shrinkedChip.removeAttribute('style');
    }
    let chips = Array.from(actionsContainer.querySelectorAll('klog-chip:not([style^=display])'));
    let remainWidth = actionsContainer.offsetWidth;
    for (let i = 0; i < chips.length; i++) {
      let chip = chips[i];
      if (chip.offsetTop != chips[0].offsetTop) {
        this.splice('actions', i, 0, { more: true });
        this._shrinkedChip = chips[i - 1];
        this._shrinkedChipWidth = chips[i - 1].offsetWidth;
        this._shrinkedChip.style.maxWidth = (this._shrinkedChip.offsetWidth - (remainWidth - 60 >= 0 ? 0 : 60 - remainWidth)) + 'px';
        this._remainWidth = remainWidth;
        actionsContainer.style.height = (chips[0].offsetHeight + 3) + 'px';
        break;
      }
      remainWidth -= chip.offsetWidth + 8;
    }
    const elements = actionsContainer.querySelectorAll('[more]');
    for (let element of elements) {
      element.hidden = false;
    }
  }

  lazyload() {
    setTimeout(() => {
      const images = this.$.link.querySelectorAll('klog-image:not([hidden])');
      for (let image of images) {
        image.lazyload();
      }
    }, 1);
  }

  expand(e) {
    e.stopPropagation();
    e.preventDefault();
    const actionsContainer = this.$.link.querySelector('.card-actions');
    const more = e.target;
    const last = Array.from(actionsContainer.querySelectorAll('klog-chip')).pop();
    let height = last.offsetTop + last.offsetHeight - actionsContainer.offsetTop + 8;
    actionsContainer.style.height = `${height}px`;
    this._shrinkedChip.setAttribute('animated', true);
    this._shrinkedChip.removeAttribute('style');
    this._shrinkedChip.style.width = this._shrinkedChipWidth + 'px';
    more.hidden = true;
  }
}

window.customElements.define(KlogTimelineItem.is, KlogTimelineItem);