import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
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
        color: var(--primary-text-color);
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
        color: inherit -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-tap-highlight-color: transparent;
      }

      .card {
        width: calc(100% - 16px);
        cursor: pointer;
      }

      .card:hover {
        @apply --shadow-elevation-8dp;
      }

      .card-meta .meta-title:hover {
        text-decoration: underline;
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

      @media (max-width: 632px) {
        .card-actions>klog-chip {
          max-width: calc(50vw - 32px);
        }
      }
    </style>
    <!--header-->
    <a href="{{server}}#/article/{{data.path}}" id="card">
      <div class="card klog-card" raised\$="{{expended}}" on-click="read" mobile\$="{{mobile}}">

        <!--meta-->
        <div class="card-meta" hidden$="{{authorHidden}}">
          <klog-image class="meta-avatar" src="{{data.author.avatarUrl}}" theme="{{theme}}" lazy fixed avatar>
          </klog-image>
          <div class="meta-container">
            <div class="meta-title">{{data.author.displayName}}</div>
          </div>
          <div class="meta-date">
            <klog-render-timestamp time-stamp="{{data.date}}"></klog-render-timestamp>
          </div>
        </div>

        <!--media-->
        <klog-image class="card-media" src="{{data.image.url}}" hidden\$="{{!view.fullWidthMedia}}" theme="{{theme}}" lazy="" content="">
        </klog-image>

        <!--title-->
        <div class="card-subtitle" hidden\$="{{!data.title}}">
          {{data.collection}}
          <div class="dot-divider" hidden$="{{!authorHidden}}"></div>
          <klog-render-timestamp time-stamp="{{data.date}}" hidden$="{{!authorHidden}}"></klog-render-timestamp>
        </div>
        <h1 class="card-title" hidden\$="{{!data.title}}">{{data.title}}</h1>

        <!--content-->
        <div class="card-content" hidden\$="{{!data._text}}">
          <p class="content-text" id="text">{{data._text}}</p>
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
      },
      backTo: {
        type: String,
        value: ''
      },
    }
  }

  static get observers() {
    return [
      'refresh(data.attachments)'
    ]
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
    this.$.card.addEventListener('click', e => {
      e.preventDefault();
      const page = 'article/' + this.data.path;
      this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page, backTo } }));
    });
  }

  has(sth) {
    return !(sth == false)
  }

  read(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.classList.contains('meta-avatar') || e.target.classList.contains('meta-title')) {
      const page = 'zone/' + this.data.author.objectId;
      this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page } }));
    } else {
      const page = 'article/' + this.data.path;
      const backTo = this.backTo || 'timeline';
      this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page, backTo } }));
    }
  }

  refresh() {
    this.refreshPromise = new Promise((resolve) => {
      setTimeout(() => {
        this.view = {
          gallery: false,
          fullWidthMedia: false,
          thumbnail: false,
          actions: true
        };
        const promises = [];
        // update styles
        promises.push(
          this._calculateAttachments()
            .then(() => this._calculateCardStyle())
            .then(() => this._updateActionsContainer())
        );
        // clamp
        let text = this.$.card.querySelector('#text');
        if (text) {
          promises.push(Promise.resolve($clamp(text, { clamp: this.clamp })));
        }
        Promise.all(promises).then(resolve);
      }, 1);
    });
    return this.refreshPromise;
  }

  _calculateCardStyle() {
    // 识别只有图片的文章等
    return new Promise((resolve) => {
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
      /* 显示缩略图或大图 */
      if (!view.gallery) {
        if (shortenText.length > 40) {
          view.fullWidthMedia = false;
        } else {
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
      setTimeout(resolve, 1);
    });
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
    let gallery = [[]];
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
    return new Promise((resolve) => {
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
      this.notifyPath('actions');
      setTimeout(resolve, 1);
    });
  }

  _updateActionsContainer() {
    if (this.actions.filter(x => x.more).length > 0) return;
    const actionsContainer = this.$.card.querySelector('.card-actions');
    actionsContainer.style.height = 'initial';
    if (this._shrinkedChip) {
      this._shrinkedChip.removeAttribute('style');
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const actionsContainer = this.$.card.querySelector('.card-actions');
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
        setTimeout(() => {
          const elements = actionsContainer.querySelectorAll('[more]');
          for (let element of elements) {
            element.hidden = false;
          }
          resolve();
        }, 1);
      }, 1);
    });
  }

  lazyload() {
    setTimeout(() => {
      const images = this.$.card.querySelectorAll('klog-image:not([hidden])');
      for (let image of images) {
        image.lazyload();
      }
    }, 1);
  }

  expand(e) {
    e.stopPropagation();
    e.preventDefault();
    const actionsContainer = this.$.card.querySelector('.card-actions');
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
