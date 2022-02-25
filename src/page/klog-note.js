import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '../style/klog-style-dialog.js';
import '../style/klog-style-toolbar.js';
import '../style/klog-style-note.js';
import '../ui/klog-icons.js';
import '../ui/klog-pages.js';
import '../ui/klog-backdrop.js';
import './klog-note-list.js';
import './klog-note-content.js';
import '../data/klog-data-collection.js';

class KlogNote extends PolymerElement {
    static get template() {
        return html `
    <style include="klog-style-toolbar"></style>
    <style include="klog-style-dialog"></style>
    <style include="klog-style-note"></style>
    <klog-data-collection id="collection" disabled=""></klog-data-collection>
    <app-route route="{{route}}" pattern="/:collection" data="{{routeData}}" tail="{{subroute0}}"></app-route>
    <app-route route="{{subroute0}}" pattern="/:path" data="{{pathData}}" tail="{{subroute1}}"></app-route>
    <app-route route="{{subroute1}}" pattern="/:share" data="{{shareData}}"></app-route>
    <klog-backdrop id="backdrop" class="layout" gesture-disabled="true" moving="{{moving}}" front-switch-disabled="">
      <app-toolbar class="backdrop-back-toolbar" slot="back" id="toolbar">
        <paper-icon-button icon="menu" on-click="openKlogDrawer" hidden-on-desktop></paper-icon-button>
        <div class="title">
          <div main-title>
            <iron-icon icon="klog"></iron-icon>
          </div>
        </div>
        <div class="divider"></div>
        <paper-button on-click="add" hidden-on-desktop>
          <iron-icon icon="note_add"></iron-icon>新建笔记
        </paper-button>
      </app-toolbar>
      <klog-pages id="animation" class="backdrop-front" slot="front" selected="{{selected}}" disabled="{{!mobile}}">
        <klog-note-list id="list" keyword="{{keyword}}" theme="{{theme}}" collection="{{collection}}" gesture="{{gesture}}" moving="{{moving}}" mobile="{{mobile}}" path="{{path}}">
        </klog-note-list>
        <klog-note-content id="content" bookmarks="{{bookmarks}}" theme="{{theme}}" keyword="{{keyword}}" collection="{{collection}}" mobile="{{mobile}}" selected="{{selected}}" path="{{path}}">
        </klog-note-content>
      </klog-pages>
    </klog-backdrop>
    <paper-dialog id="shareDialog" class="share-dialog" with-backdrop="">
      <h2>这个链接，通向光明</h2>
      <p>https://klog.app/#/article/{{shareDialogPath}}</p>
    </paper-dialog>
`;
    }

    static get is() { return 'klog-note'; }

    static get properties() {
        return {
            selected: {
                type: Number,
                value: 0,
            },
            mobile: {
                type: Boolean,
                reflectToAttribute: true
            },
            bookmarks: {
                type: Array
            },
            layout: {
                type: Object,
                value: {
                    documentTitle: '笔记 - Klog',
                    drawer: 'auto',
                    mainMenu: true,
                    sidebar: 'auto',
                    scrollToTop: true,
                    header: {
                        fixed: true,
                        short: false,
                        shadow: 'off',
                    },
                    styles: {
                        '--klog-header-background': 'var(--klog-page-background)',
                        '--klog-header-text-color': 'var(--on-surface)',
                    },
                    toolbar: html ``
                }
            },
        };
    }

    static get observers() {
        return [
            'routeChanged(routeData.collection, pathData.path)',
            'updateScrollerQuery(shareData.share)',
            'loadPreference(userinfo.preference)',
            'articleError(error)'
        ];
    }

    ready() {
        super.ready();
        this.setAttribute('tabindex', 1);
        this.addEventListener('pages-select', () => {
            if (this.selected == 0) {
                this.article = {};
            }
            this.$.backdrop.close();
        });
        this.addEventListener('note-share', (e) => {
            this.share(e.detail.path);
        });
        this.addEventListener('update-bookmarks', (e) => {
            this.bookmarks = e.detail.bookmarks;
            this._updateCustomMenu();
        });
        this.addEventListener('note-select-page', (e) => {
            this.selected = e.detail.selected;
        });
        this.addEventListener('note-update-path', (e) => {
            this.path = e.detail.path;
        });
        this.$.shareDialog.addEventListener('opened-changed', e => {
            this.dispatchEvent(new CustomEvent('editor-backdrop-opened-changed', {
                bubbles: true,
                composed: true,
                detail: { value: e.detail.value }
            }));
        });
    }

    updateScrollerQuery(hash) {
        this.$.content.$.markdown.$.scroller.updateQueryByHash(hash);
    }

    openKlogDrawer() {
        this.dispatchEvent(new CustomEvent('main-drawer-open', { bubbles: true, composed: true }));
    }

    async update(userLoadPromise, route) {
        // user
        const result = await userLoadPromise;
        if (!result.login) {
            this.dispatchEvent(new CustomEvent('user-login-page-open', {
                bubbles: true,
                composed: true
            }));
            return Promise.reject(new Error('Not Login.'));
        } else {
            this.preference = result.userinfo.preference;
            this.userinfo = result.userinfo;
            this.$.list.userinfo = result.userinfo;
            this.$.content.userinfo = result.userinfo;
            this.$.collection.userinfo = result.userinfo;
            this.$.collection.login = result.login;
            this.login = result.userinfo;
            this._loadCollection(result);
        }
        // data
        this.route = route;
    }

    refresh() {
        this._initCollection = false;
        this.$.list.load(true);
        this.loadArticle(this.path, true);
    }

    async _loadCollection(result) {
        let collections;
        if (!this._initCollection) {
            this._initCollection = true;
            collections = await this.$.collection.list();
            this.collections = collections;
        }
        this._updateCustomMenu();
    }

    _updateCustomMenu() {
        let customMenu = [];
        if (this.collections && this.collections.length > 0) {
            let items = {
                name: 'collection',
                items: [
                    { subtitle: true, text: '笔记本' },
                    { name: 'add', text: '新建笔记', icon: 'note_add', raised: true, desktop: true }
                ]
            };
            for (let item of this.collections) {
                items.items.push({ name: item, text: item, icon: 'label' });
            }
            customMenu.push(items);
        }
        if (this.bookmarks && this.bookmarks.length > 0) {
            let items = {
                name: 'bookmark',
                items: [{ subtitle: true, text: '书签' }]
            };
            for (let item of this.bookmarks) {
                items.items.push({ name: item.path, text: item.title, icon: 'bookmark' });
            }
            customMenu.push(items);
        }
        this.dispatchEvent(new CustomEvent('layout-update', {
            bubbles: true,
            composed: true,
            detail: { customMenu: customMenu }
        }));
    }

    menuSelect(category, item) {
        if (category == 'collection' && item == 'add') {
            this.add();
        } else if (category == 'collection') {
            this.dispatchEvent(new CustomEvent('app-load', {
                bubbles: true,
                composed: true,
                detail: { page: `note/${item}/` }
            }));
        } else if (category == 'bookmark') {
            this.selected = 1;
            this.dispatchEvent(new CustomEvent('app-load', {
                bubbles: true,
                composed: true,
                detail: { page: `note/${this.collection}/${item}` }
            }));
        }
    }

    loadPreference(preference) {
        this.bookmarks = preference ? preference.bookmarks : [];
        this._updateCustomMenu();
    }

    _timeout(promise, timeout) {
        return Promise.race([
            promise,
            new Promise(resolve => { setTimeout(resolve, timeout); })
        ]);
    }

    share(path) {
        this.shareDialogPath = path || this.path;
        this.$.shareDialog.open();
    }

    routeChanged(collection, path) {
        if (window.location.href.indexOf('#/note') == -1) return;
        collection = collection || this.collection || 'all';
        if (this.collection != collection) {
            this.collection = collection;
            this.$.list.keyword = '';
            if (!this.mobile) this.$.list.$.search.focus();
        }
        if (path == this.path) return;
        if (path || path === '') {
            this.path = path;
            this.loadArticle(path);
        } else {
            this.selected = 0;
        }
    }

    loadArticle(path, force = false) {
        this.$.content.load(path, force);
    }

    articleError() {
        this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: 'note/' } }));
        this.path = '';
        this.listLoaded();
    }

    add() {
        let collection = this.collection == 'all' ? '笔记' : this.collection;
        this.dispatchEvent(new CustomEvent('editor-open', {
            bubbles: true,
            composed: true,
            detail: {
                backTo: window.location.hash,
                preset: {
                    markdown: '@(' + collection + ')[]',
                    private: true
                }
            }
        }));
    }
}

window.customElements.define(KlogNote.is, KlogNote);