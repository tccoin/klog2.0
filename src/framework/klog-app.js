import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogUiMixin } from './klog-ui-mixin.js';
import { KlogDynamicTheme } from './klog-dynamic-theme.js';
import '@polymer/paper-styles/paper-styles.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '../data/klog-data-user.js';
import './klog-layout.js';

class KlogApp extends KlogUiMixin(PolymerElement) {
    static get template() {
        return html`
    <style include="klog-style-toast"></style>
    <style>
      :host {
        display: block;
        --safe-area-inset-top: env(safe-area-inset-top);
        --safe-area-inset-bottom: env(safe-area-inset-bottom);
      }

      .page-container {
        width: 70vw;
      }

      .spinner-container {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10000;
        display: flex !important;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        background: var(--klog-page-background, #000);
        opacity: 1;
        transition: all .3s ease;
      }

      .spinner-container[hidden] {
        z-index: -1;
        opacity: 0;
      }

      .spinner-container .spinner-text {
        font-size: 1.5em;
        margin-left: 24px;
        color: var(--primary);
        user-select: none;
        -webkit-user-select: none;
      }

      .spinner-container .spinner-text a {
        color: var(--primary);
        text-decoration: none;
        border-bottom: 1px solid currentColor;
        margin: 0 2px;
        cursor: pointer;
      }
    </style>
    <!-- Data -->
    <klog-data-user id="user"></klog-data-user>
    <app-localstorage-document id="preference" key="preference" data="{{preference}}"></app-localstorage-document>
    <app-localstorage-document key="theme" data="{{theme}}"></app-localstorage-document>
    <!-- Route -->
    <app-location route="{{route}}" use-hash-as-path=""></app-location>
    <app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{subroute}}"></app-route>
    <!-- Loading -->
    <div class="spinner-container" hidden\$="{{!loading}}">
      <paper-spinner active="{{loading}}"></paper-spinner>
      <span class="spinner-text" hidden\$="{{loadingTimeoutPrompt}}">加载中…</span>
      <span class="spinner-text" hidden\$="{{!loadingTimeoutPrompt}}">
        加载比预想得慢…<br>要试试<a on-click="back">返回</a>或者<a on-click="reload">刷新</a>么？
      </span>
    </div>
    <!-- UI -->
    <klog-layout id="layout" preference="{{preference}}" theme="{{theme}}"></klog-layout>
`;
    }

    static get is() { return 'klog-app'; }

    static get properties() {
        return {
            theme: {
                type: String,
                value: 'dark',
                reflectToAttribute: true
            },
            themeColor: {
                type: String,
                value: 'default',
                reflectToAttribute: true
            },
            loading: {
                type: Boolean,
                value: true
            },
            loadingTimeoutPrompt: {
                type: Boolean,
                value: false
            },
            lastHash: {
                type: String,
                value: ''
            }
        };
    }

    static get observers() {
        return [
            'load(routeData.page)',
            'updateTheme(theme, themeColor)'
        ];
    }

    async _loadLayout() {
        this.loadingTimeoutPrompt = false;
        this._loadingTimeout = setTimeout(() => {
            this.loadingTimeoutPrompt = true;
        }, 5000);
        await
        import('./klog-layout.js');
        this.loading = false;
        clearTimeout(this._loadingTimeout);
    }

    async load() {
        if (!this._ready) { return; }
        if (this._hash == window.location.hash) { return; }
        this._hash = window.location.hash;
        const ui = this.$.layout;
        try {
            const pageName = await this._calcPage(this.routeData.page);
            const subroute = this._calcSubroute(this.subroute);
            const page = await ui.load(pageName, subroute, this.userdata);
            this._setPageHistory(page);
        } catch (err) {
            if (err.message == '404') {
                window.location.hash = '#/404/';
            } else if (err.message == 'Loading interrupted' || err.message == 'Redirect') { } else {
                console.error(err);
            }
        }
        if (!this._serviceWorkerInit) {
            this._serviceWorkerInit = true;
            this._installServiceWorker();
        }
        let hash = window.location.hash.substring(2);
        if (ui.page == 'zone' && hash.substring(5) != 'zone/') {
            this.lastHash = 'zone/username/' + hash;
        } else {
            this.lastHash = hash;
        }
    }

    async ready() {
        this._initGlobalEvent();
        super.ready();
        this.initUiEvent();
        this._loadLayout();
        await this._loadUserinfo();
        this._ready = true;
        this.load(this.routeData.page);
    }

    _initGlobalEvent() {
        this.addEventListener('app-load', (e) => {
            if (e.detail.page) {
                if (e.detail.page.substring(0, 14) == 'zone/username/') {
                    e.detail.page = e.detail.page.substring(14);
                }
                if (e.detail.keepLastHash) {
                    this.lastHash = e.detail.keepLastHash;
                }
                window.location.hash = '#/' + e.detail.page.replace(/^#\//, '');
            }
        });
        this.addEventListener('app-reload', (e) => this.reload());
        this.addEventListener('userinfo-updated', (e) => {
            this._loadUserinfo(e.detail.userdata);
        });
        this.addEventListener('theme-color-updated', (e) => {
            this.themeColor = e.detail.themeColor;
        });
        this.addEventListener('timeline-set-filter', (e) => {
            const callback = (pages) => {
                pages.timeline.$.keywordInput.value = e.detail.keyword;
                pages.timeline.setFilter(e);
            };
            if (this.$.layout.$.page.selected == 'timeline') {
                callback(this.$.layout.$);
            }
            this.$.layout.dispatchEvent(new CustomEvent('require-update', {
                bubbles: true,
                composed: true,
                detail: {
                    page: 'timeline',
                    callback: callback
                }
            }));
            window.location.hash = '#/timeline';
        });
        this.addEventListener('editor-open', (e) => {
            const editorLoaded = () => {
                this.$.layout.$.editor.preset = e.detail.preset || {};
                this.removeEventListener('editor-loaded', editorLoaded);
            };
            this.addEventListener('editor-loaded', editorLoaded);
            this.dispatchEvent(new CustomEvent('app-load', {
                bubbles: true, composed: true, detail: {
                    page: 'editor/' + (e.detail.articleId || '')
                }
            }));
        });
        window.addEventListener('online', (e) => this._notifyNetworkStatus(e));
        window.addEventListener('offline', (e) => this._notifyNetworkStatus(e));
        this._notifyNetworkStatus();
        this.addEventListener('update-service-worker', (e) => {
            let callback = e.detail && e.detail.callback ? e.detail.callback : function () { };
            this._updateServiceWorker(callback);
        });
    }

    async _loadUserinfo(userdata) {
        if (!userdata) {
            userdata = await this.$.user.load();
        }
        this.userdata = userdata;
        this.login = this.userdata.login;
        this._updatePreference(this.userdata.userinfo.preference);
    }


    _setPageHistory(page) {
        page.lastHash = this.lastHash;
        if (this._inHash(this.lastHash, ['timeline', 'zone', 'note'])) {
            this.from = this.lastHash;
        }
        page.from = this.from || '';
    }

    _installServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js', { scope: '/' });
            this._updateServiceWorker();
        }
    }

    _updateServiceWorker(callback) {
        callback = callback || function () { };
        if ('serviceWorker' in navigator) {
            if (this._swUpdateFound) {
                this._updateFound();
                callback(true);
            } else {
                navigator.serviceWorker.getRegistration().then((reg) => {
                    reg.update().then(reg => {
                        if (reg.installing) {
                            reg.installing.onstatechange = e => {
                                if (e.target.state == 'installed') {
                                    reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                                    console.log('SKIP_WAITING');
                                }
                            };
                            this._swUpdateFound = true;
                            this._updateFound();
                            callback(true);
                        } else if (reg.waiting) {
                            reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                            console.log('SKIP_WAITING');
                            this._swUpdateFound = true;
                            this._updateFound();
                            callback(true);
                        } else {
                            callback(false);
                        }
                    });
                });
            }
        }
    }

    _updateFound(sw) {
        console.log('Update for Klog found.');
        this.openToast('Klog 更新已就绪', {
            title: 'Link Start!',
            onclick: () => this.reload()
        }, { duration: 10000 });
    }

    reload() {
        location.reload();
    }

    back() {
        window.history.back();
    }

    _calcPage(page) {
        if (!page) {
            page = 'timeline';
            window.location.hash = `#/${page}/`;
            return Promise.reject(new Error('Redirect'));
        } else {
            return page;
        }
    }

    _calcSubroute(subroute) {
        const r = subroute.path ? subroute.path.match(/([^\?]*)\??(.*)/) : [null, null];
        return {
            prefix: subroute.prefix,
            path: r[1],
            param: r[2],
        };
    }

    _notifyNetworkStatus() {
        if (this.offline) {
            this.openToast('村里通网啦 σ`∀´)');
        }
        this.offline = !navigator.onLine;
        if (this.offline) {
            this.openToast('没有网啦！！(´ﾟДﾟ`)');
        }
    }

    updateTheme() {
        // 从preference中读取设置
        if (!this.preference) return;
        const preference = this.preference;
        let themeStrategy = preference.theme;
        let theme = themeStrategy;
        if (themeStrategy == 'system') {
            if (window.matchMedia('(prefers-color-scheme)').media) {
                const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                theme = isSystemDark ? 'dark' : 'light';
            } else {
                themeStrategy = 'time';
            }
        } else if (themeStrategy == 'time') {
            let d = new Date();
            let h = d.getHours();
            theme = (h > 19 || h < 7) ? 'dark' : 'light';
        }
        this.theme = theme;

        // 更新动态色彩
        let dynamicTheme = new KlogDynamicTheme();
        const defaultThemeColor = (this.preference && 'themeColor' in this.preference) ? this.preference.themeColor : '#3f51b5';
        dynamicTheme.apply(this, this.themeColor == 'default' ? defaultThemeColor : this.themeColor, this.theme);

        // 更新主题
        let htmlTheme = document.querySelector('html').getAttribute('theme');
        if (htmlTheme && htmlTheme.indexOf('custom') > -1) {
            document.querySelector('html').setAttribute('theme', this.theme + ' custom');
            return;
        }
        document.querySelector('html').setAttribute('theme', this.theme);
        document.querySelector('html').style.background = window.getComputedStyle(this).getPropertyValue('--klog-page-background');
        let metaThemeColor = document.querySelector('meta[name=theme-color]');
        metaThemeColor.setAttribute('content', this.theme == 'light' ? '#e0e0e0' : '#000000');
    }

    _updatePreference(preference) {
        if (!preference) return;
        this.preference = preference || this.preference;
        this.themeColor = preference.themeColor;
        this.updateTheme();
        if (this.updateThemeInterval) clearInterval(this.updateThemeInterval);
        this.updateThemeInterval = setInterval(() => this.updateTheme(), 15 * 1000);
        if (this._waitingToLoadDefaultPage) {
            this._loadDefaultPage();
        }
    }
}

window.customElements.define(KlogApp.is, KlogApp);