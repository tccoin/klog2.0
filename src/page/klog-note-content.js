import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '../style/klog-style-scrollbar.js';
import '../style/klog-style-toolbar.js';
import '../style/klog-style-media.js';
import '../ui/klog-icons.js';
import '../data/klog-data-article.js';
import '../ui/klog-markdown.js';

class KlogNoteContent extends PolymerElement {
    static get template() {
        return html `
    <style include="klog-style-scrollbar"></style>
    <style include="klog-style-toolbar"></style>
    <style include="klog-style-media"></style>
    <style>
      :host {
        flex: 1;
        height: calc(var(--klog-layout-page-height) - 64px);
        outline: none;
      }

      /*container*/

      .main-container {
        position: relative;
        max-height: 100%;
        z-index: 2;
        overflow: auto;
        opacity: 1;
        transition: opacity .2s ease;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }

      :host([loading]) .main-container {
        opacity: 0;
      }

      .spinner-container {
        @apply(--fit-layout);
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

      /*content*/

      app-toolbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        background: var(--surface);
        color: var(--on-background);
        @apply(--shadow-none);
        transition: all .15s ease-out;
      }

      app-toolbar::after {
        content: none;
      }

      .note-toolbar {
        position: absolute;
        width: auto;
        z-index: 10;
        top: 0;
        left: auto;
        right: 0;
        margin: 16px;
        height: 36px;
        padding: 0 4px;
        border-radius: 18px;
        color: var(--on-primary-container);
        background: var(--primary-container);
      }

      .note-toolbar paper-icon-button {
        height: 36px;
        width: 36px;
        flex-basis: 36px;
        padding: 9px;
        line-height: 0;
      }

      :host([mobile]) app-toolbar.raised {
        @apply(--shadow-elevation-4dp);
      }

      .note-toolbar.raised {
        @apply(--shadow-elevation-2dp);
      }

      @media (min-width: 768px) {
        :host {
          --klog-markdown-media: {
            width: fit-content;
            @apply(--shadow-elevation-8dp);
          }
        }
      }

      @media (max-width: 767px) {
        :host {
          height: var(--klog-layout-page-height);
        }

        .main-container {
          padding-top: 64px;
          height: calc(var(--klog-layout-page-height) - 64px);
        }
      }
    </style>

    <klog-data-article id="data" key="createdAt" last-response="{{article}}" loading="{{loading}}" last-error="{{error}}" userinfo="{{userinfo}}" type="user" default="{{!mobile}}">
    </klog-data-article>

    <div class="spinner-container">
      <paper-spinner-lite active=""></paper-spinner-lite>
    </div>

    <app-toolbar id="notetool" short hidden-on-tablet hidden-on-desktop>
      <paper-icon-button icon="arrow_back" on-click="back" mobile=""></paper-icon-button>
      <div class="divider"></div>
      <div class="actions">
        <paper-icon-button icon="edit" on-click="edit"></paper-icon-button>
        <paper-icon-button icon="share" on-click="share"></paper-icon-button>
        <paper-icon-button icon="{{bookmarksIcon}}" on-click="toggleBookmark"></paper-icon-button>
      </div>
    </app-toolbar>

    <div class="note-toolbar" hidden-on-mobile>
      <div class="actions">
        <paper-icon-button icon="edit" on-click="edit"></paper-icon-button>
        <paper-icon-button icon="share" on-click="share"></paper-icon-button>
        <paper-icon-button icon="{{bookmarksIcon}}" on-click="toggleBookmark"></paper-icon-button>
      </div>
    </div>

    <div class="main-container" id="scrollTarget">
      <div class="body">
        <klog-markdown class="markdown" id="markdown" markdown="{{article.markdown}}" link-prefix="article/{{path}}" theme="{{theme}}" scroll-bias="{{_getBias(mobile)}}" mobile="{{mobile}}" preference="{{userinfo.preference.markdown}}" breadcrumbs="" heading-actions="">
        </klog-markdown>
      </div>
    </div>
`;
    }

    static get is() { return 'klog-note-content'; }

    static get properties() {
        return {
            mobile: {
                type: Boolean,
                reflectToAttribute: true
            },
            loading: {
                type: Boolean,
                reflectToAttribute: true
            },
            keyword: {
                type: String,
                notify: true
            },
            collection: {
                type: String,
                notify: true
            },
            selected: {
                type: Number,
                notify: true
            },
            bookmarksIcon: {
                type: String,
                value: 'bookmark_border'
            },
            bookmarks: {
                type: Array
            },
            path: {
                type: String,
                notify: true
            }
        };
    }

    static get observers() {
        return [
            'loaded(article.objectId)'
        ];
    }

    ready() {
        super.ready();
        this.$.markdown.updateScrollTarget(this.$.scrollTarget);
        this.setAttribute('tabindex', 1);
        this.$.scrollTarget.addEventListener('scroll', () => {
            let y = this.$.scrollTarget.scrollTop;
            if (y > 0) {
                if (!this.mobile) {
                    this.$.notetool.classList.add('raised');
                } else {
                    this.$.notetool.setAttribute('collapsed', '');
                }
            } else {
                this.$.notetool.classList.remove('raised');
                this.$.notetool.removeAttribute('collapsed');
            }
        });
        this.$.markdown.addEventListener('markdown-rendered', () => {
            const elements = this.$.markdown.$.content.querySelectorAll('.tag,.collection');
            for (let element of elements) {
                element.addEventListener('click', e => this._setFilter(e));
            }
        });
        this.$.data.addEventListener('notfound', () => this._notfoundHandle());
    }

    share() {
        this.dispatchEvent(new CustomEvent('note-share', { bubbles: true, composed: true, detail: { path: this.article.path } }));
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

    back() {
        this.dispatchEvent(new CustomEvent('note-select-page', { bubbles: true, composed: true, detail: { selected: 0 } }));
        this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: 'note/' + this.collection + '/' } }));
    }

    load(path, force = false) {
        if (window.location.hash.indexOf('#/note') == -1) return;
        if (path == this._path && !force) return;
        this.$.data.loadByPath(path);
        this._path = path;
    }

    loaded(articleId) {
        this.articleId = articleId;
        //bookmarks
        this._updateBookmark();
        this._updateBookmarksIcon(this._calcBookmarkPosition(this.articleId, this.bookmarks) > -1);
        //clean state
        this.$.scrollTarget.scrollTop = 0;
    }

    _notfoundHandle() {
        let bookmarks = this.bookmarks;
        let bookmarkPosition = this._calcBookmarkPositionByPath(this.path, this.bookmarks);
        if (bookmarkPosition == -1) return;
        bookmarks.splice(bookmarkPosition, 1);
        this._updateBookmarks(bookmarks);
        this.back();
    }

    _updateBookmark() {
        let bookmarks = this.bookmarks;
        let bookmarkPosition = this._calcBookmarkPosition(this.articleId, this.bookmarks);
        if (bookmarkPosition == -1) return;
        let oldBookMark = Object.assign({}, bookmarks[bookmarkPosition]);
        let newBookMark = this._generateBookmark();
        delete oldBookMark['addedAt'];
        delete newBookMark['addedAt'];
        if (JSON.stringify(oldBookMark) != JSON.stringify(newBookMark)) {
            bookmarks.splice(bookmarkPosition, 1, this._generateBookmark());
            this._updateBookmarks(bookmarks);
        }
    }

    _generateBookmark() {
        return {
            id: this.articleId,
            title: this.article.title,
            path: this.article.path,
            addedAt: new Date().toUTCString()
        };
    }

    toggleBookmark() {
        let bookmarks = this.bookmarks;
        let articleId = this.articleId;
        let bookmarkPosition = this._calcBookmarkPosition(this.articleId, this.bookmarks);
        if (bookmarkPosition > -1) {
            bookmarks.splice(bookmarkPosition, 1);
        } else {
            bookmarks.push(this._generateBookmark());
        }
        this._updateBookmarksIcon(bookmarkPosition == -1);
        this._updateBookmarks(bookmarks);
    }

    _updateBookmarks(bookmarks) {
        let klogUser = this.userinfo.klogUser;
        let newPreference = Object.assign({}, this.userinfo.preference, { bookmarks: bookmarks });
        klogUser.update({ preference: { value: newPreference } });
        this.bookmarks = bookmarks;
        this.dispatchEvent(new CustomEvent('update-bookmarks', { bubbles: true, composed: true, detail: { bookmarks: bookmarks } }));
    }

    _calcBookmarkPosition(articleId, bookmarks) {
        for (let i = 0; i < bookmarks.length; i++) {
            if (bookmarks[i].id == articleId) { return i; }
            if (bookmarks[i].id == articleId) { return i; }
        }
        return -1;
    }

    _calcBookmarkPositionByPath(path, bookmarks) {
        for (let i = 0; i < bookmarks.length; i++) {
            if (bookmarks[i].path == path) { return i; }
        }
        return -1;
    }

    _updateBookmarksIcon(marked) {
        this.bookmarksIcon = marked ? 'bookmark' : 'bookmark_border';
    }

    _isNull(arr = []) {
        return arr.length == 0;
    }

    _uppercase(str) {
        return str.toUpperCase();
    }

    _getBias(mobile) {
        return mobile ? -64 : 0;
    }

    _setFilter(e) {
        if (e.target.className == 'tag') {
            this.keyword = e.target.innerText;
            this.selected = 0;
        } else if (e.target.className == 'collection') {
            this.collection = e.target.innerText;
            this.selected = 0;
        }
    }
}

window.customElements.define(KlogNoteContent.is, KlogNoteContent);