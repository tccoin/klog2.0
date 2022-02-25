import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogUiMixin } from './klog-ui-mixin.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
import '../ui/klog-drawer.js';
import '../ui/klog-menu.js';
import '../style/klog-style.js';
import '../style/klog-style-scrollbar.js';
import '../style/klog-style-dialog.js';
import '../style/klog-style-toast.js';
import '../style/klog-style-dialog.js';
import '../style/klog-style-layout.js';

class KlogLayout extends KlogUiMixin(PolymerElement) {
    static get template() {
        return html `
    <style include="klog-style-layout"></style>
    <style include="klog-style-scrollbar"></style>
    <style include="klog-style-dialog"></style>
    <style>
      :host {
        display: block;
        padding: 0;
        min-height: 100%;
        background: var(--klog-page-background);
        color: var(--on-surface);
        position: relative;
        overscroll-behavior: none;
        --paper-toggle-button-unchecked-button-color: var(--secondary);
        --klog-layout-margin-left: 240px;
        --klog-layout-page-height: 100vh;
        transition: all .3s ease, background .5s ease-out;
      }

      .main-container {
        display: flex;
        flex-direction: row;
      }

      .sidebar-container,
      .page-container {
        height: var(--klog-layout-page-height);
        box-sizing: border-box;
        overflow-y: auto;
      }

      .sidebar-container {
        position: absolute;
        width: var(--klog-layout-margin-left);
        box-sizing: border-box;
        padding: 80px 16px 16px 0;
        transition: all .2s ease .1s;
      }

      .page-container {
        width: 100vw;
        -webkit-overflow-scrolling: touch;
      }

      .page-container>* {
        min-height: var(--klog-layout-page-height);
        padding-left: var(--klog-layout-margin-left);
        box-sizing: border-box;
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

      paper-dialog {
        max-width: 450px;
        --klog-markdown-padding: 0px;
      }

      paper-dialog .actions {
        text-align: right;
        color: var(--klog-theme-primary);
      }

      /* sidebar-off */

      :host([sidebar-off]) {
        --klog-layout-margin-left: 0px;
      }

      :host([sidebar-off]) .sidebar-container {
        transform: translate(-20vw);
        opacity: 0;
      }

      :host([sidebar-off]) .page-container {
        padding-left: 0;
      }

      /* about */
      paper-dialog {
        max-width: 300px;
        width: 100%;
      }
    </style>
    <!-- Drawer -->
    <klog-drawer id="drawer" heading="{{drawerHeading}}">
      <klog-menu items="{{menu}}"></klog-menu>
    </klog-drawer>
    <!-- Layout -->
    <div id="main" class="main-container">
      <!-- Media query -->
      <iron-media-query query="max-width: 767px" query-matches="{{mobile}}"></iron-media-query>
      <iron-media-query query="(min-width: 768px) and (max-width: 1023px)" query-matches="{{tablet}}"></iron-media-query>
      <iron-media-query query="min-width: 1024px" query-matches="{{desktop}}"></iron-media-query>
      <!-- Header -->
      <app-header id="header" mobile$="{{mobile}}"></app-header>
      <!-- Sidebar -->
      <div id="sidebar" class="sidebar-container">
        <klog-menu items="{{menu}}"></klog-menu>
      </div>
      <!-- Loading UI -->
      <div name="loading" class="spinner-container" hidden="{{!loading}}">
        <paper-spinner active="{{loading}}"></paper-spinner>
      </div>
      <!-- Pages -->
      <iron-pages id="page" class="page-container" role="main" selected="{{displayPage}}" attr-for-selected="name" selected-attribute="visible">
        <klog-404 name="404" page="{{page}}"></klog-404>
        <klog-timeline name="timeline" id="timeline" preference="{{preference}}" mobile="{{mobile}}" tablet="{{tablet}}" desktop="{{desktop}}" theme="{{theme}}">
        </klog-timeline>
        <klog-article name="article" theme="{{theme}}" mobile="{{mobile}}">
        </klog-article>
        <klog-editor id="editor" name="editor" mobile="{{mobile}}" theme="{{theme}}"></klog-editor>
        <klog-login id="login" name="login"></klog-login>
        <klog-signup id="signup" name="signup"></klog-signup>
        <klog-userpanel name="userpanel" mobile="[[mobile]]"></klog-userpanel>
        <klog-apps name="apps"></klog-apps>
        <klog-note id="note" name="note" theme="[[theme]]" mobile="{{mobile}}"> </klog-note>
        <klog-message id="message" name="message" theme="[[theme]]" mobile="{{mobile}}"> </klog-message>
        <klog-zone name="zone" mobile="{{mobile}}" tablet="{{tablet}}" desktop="{{desktop}}" theme="{{theme}}"></klog-zone>
        <!--testing-->
        <klog-drive name="drive"></klog-drive>
        <klog-lab name="lab"></klog-lab>
      </iron-pages>
    </div>

    <!--about-->
    <paper-dialog id="about" with-backdrop="">
      <h2>&gt; klog -V</h2>
      <p>v2.19.1<br>2017-2021<br>Powered by Kr with Love.</p>
      <div class="actions" column="">
        <paper-button on-click="aboutHelp">&gt; klog help</paper-button>
        <paper-button on-click="aboutLog">&gt; klog log</paper-button>
        <paper-button on-click="aboutUpdate">&gt; klog update</paper-button>
        <paper-button on-click="aboutGitHub">&gt; git clone klog</paper-button>
      </div>
    </paper-dialog>
`;
    }

    static get is() { return 'klog-layout'; }

    static get properties() {
        return {
            page: {
                type: String
            },
            loading: {
                type: Boolean,
                value: true
            },
            menu: {
                type: Array,
                value: []
            },
            customMenu: {
                type: Array,
                value: []
            },
            login: {
                type: Boolean
            },
            mobile: {
                type: Boolean,
                value: false
            },
            documentTitle: {
                type: String
            },
            drawerHeading: {
                type: String
            },
            drawer: {
                type: String
            },
            sidebar: {
                type: String
            },
            mainMenu: {
                type: Boolean,
                value: false
            },
            header: {
                type: Object
            },
            toolbar: {
                type: Object
            },
            styles: {
                type: Object
            },
        };
    }

    static get observers() {
        return [
            '_updateSidebar(sidebar,undefined,desktop)',
            '_updateDrawer(drawer,undefined,desktop)',
            '_updateDocumentTitle(documentTitle)',
            '_updateStyles(styles)',
            '_updateHeader(header)',
            '_updateToolbar(toolbar)',
            '_updateMenu(login)',
            '_updateLayout(mobile)'
        ];
    }

    ready() {
        super.ready();
        this.$.scrollTarget = this.$.page;
        this.$.scrollTarget.style.scrollBehavior = 'smooth';
        window.addEventListener('resize', () => this.updateLayout(Object.assign(this._layout, { scrollToTop: false }), false));
        this.addEventListener('layout-update', e => this.updateLayout(e.detail, false));
        this.addEventListener('main-drawer-open', e => this.$.drawer.open());
        this.addEventListener('about-help', e => this.aboutHelp());
        this.addEventListener('about-log', e => this.aboutLog());
        this.addEventListener('page-scroll', e => this.scrollTo(e.detail.destination));
        this.addEventListener('page-set-top', () => {
            this.$.page.style.position = 'relative';
            this.$.page.style.zIndex = 101;
        });
        this.addEventListener('page-unset-top', () => {
            this.$.page.style.position = 'initial';
            this.$.page.style.zIndex = 'initial';
        });
        this.addEventListener('require-update', e => {
            let _e = e;
            this.$.page.addEventListener('iron-select', e => {
                let pageElement = this.$.page.querySelector(`[name = '${e.target.selected}']`);
                if (pageElement && pageElement.refresh) {
                    pageElement.refresh();
                }
                if (_e.detail.callback) { _e.detail.callback(this.$); }
            }, { once: true });
        });
        this.addEventListener('after-selected', e => {
            this.$.page.addEventListener('iron-select', () => {
                let pageElement = this.$.page.querySelector(`[name = '${e.detail.selected}']`);
                e.detail.callback(pageElement);
            }, { once: true });
        });
        this.addEventListener('backdrop-opened-changed', e => {
            this.$.page.style = `-webkit-overflow-scrolling:${!e.detail.value ? 'touch' : 'unset'}`;
        });
        const setPageHeight = () => {
            this.style.setProperty('--klog-layout-page-height', this.mobile ? `calc(${window.innerHeight}px + var(--safe-area-inset-top))` : '100vh');
        };
        setPageHeight();
        window.addEventListener('resize', setPageHeight);
    }

    async load(page, subroute, userLoadPromise) {
        this._userinfoHandle(userLoadPromise);
        const oldPage = this.page;
        if (page != oldPage) {
            if (!this._pageValidate(page)) {
                // 不是有效页面，有可能是username
                page = 'zone';
            }
            let importPromise =
        import (`../page/klog-${page}.js`);
            let timeout;
            if (!this.loading) {
                await this._unloadPage(oldPage);
                timeout = setTimeout(()=>{
                    this.loading = true;
                }, 300);
            }
            await importPromise;
            this.page = page;
            await this._getPageLayout(page);
            await this._updatePage(page, userLoadPromise, subroute); // update data, set init state...
            await this._checkInterrupt(page);
            this.displayPage = page;
            clearTimeout(timeout);
            this.loading = false;
            await this._loadPage(page); // animation...
            await this._checkInterrupt(page);
        } else {
            await this._updatePage(page, userLoadPromise, subroute); // update data, set init state...
            await this._loadPage(page); // animation...
        }
        await this._checkInterrupt(page);
        return this._getPage(page);
    }

    _pageValidate(page) {
        return ['404', 'apps', 'article', 'editor', 'lab', 'login', 'signup', 'message', 'note', 'timeline', 'userpanel', 'zone'].includes(page);
    }

    async _userinfoHandle(userLoadPromise) {
        const result = await userLoadPromise;
        this.userinfo = result.userinfo;
        this.login = result.login;
    }

    async _unloadPage(page) {
        let pageElement = this._getPage(page);
        this._setAttribute(pageElement, 'exit');
        if (pageElement.$.animation) {
            await this._timeout(new Promise(resolve => { pageElement.$.animation.addEventListener('transitionend', resolve); }), 500);
        }
        if (pageElement.unload) {
            await pageElement.unload();
        }
    }

    _getPage(page) {
        return this.$.page.querySelector(`[name='${page}']`);
    }

    async _loadPage(page) {
        let pageElement = this._getPage(page);
        if (!pageElement) {
            return Promise.reject(new Error('404'));
        }
        if (pageElement.load) {
            await pageElement.load();
        }
        pageElement.style.opacity = 1;
        this._setAttribute(pageElement, 'exit', true);
    }

    _updatePage(page, userLoadPromise, subroute) {
        let pageElement = this._getPage(page);
        pageElement.style.opacity = 0;
        this._setAttribute(pageElement, 'exit');
        if (pageElement && pageElement.update) {
            return pageElement.update(userLoadPromise, subroute);
        }
    }

    _getPageLayout(page) {
        let pageElement = this._getPage(page);
        if (pageElement && pageElement.layout) {
            return this.updateLayout(pageElement.layout, true);
        }
    }

    _checkInterrupt(page) {
        if (this.page != page) {
            return Promise.reject(new Error('Loading interrupted'));
        }
    }


    _updateLayout() {
        if (this._layout) {
            setTimeout(() => this.updateLayout({}, false), 1);
        }
    }

    updateLayout(layout = {}, useDefault = true) {
        // resolve
        layout = this._updateCompleteLayout(layout, useDefault);
        layout = this._updateDynamicLayout(layout);
        layout.header = this._updateDynamicLayout(layout.header);
        layout.styles = this._updateDynamicLayout(layout.styles);
        // update valid properties
        for (let key of Object.keys(layout)) {
            if (key in this && layout[key] != undefined) {
                this.set(key, layout[key]);
            }
        }
        // bind
        const pageElement = this.$.page.querySelector(`[name = '${this.page}']`);
        if (pageElement) {
            if (!pageElement.$.header) {
                pageElement.$.header = this.$.header;
            }
            if (!pageElement.$.scrollTarget) {
                pageElement.$.scrollTarget = this.$.scrollTarget;
            }
        }
        // scroll to top
        if (layout.scrollToTop) {
            this.scrollTo(0, 0);
        }

        // update menu
        this._updateMenu();
    }

    _updateCompleteLayout(layout, useDefault) {
        let parent;
        if (useDefault) {
            const defaultLayout = {
                documentTitle: 'Klog',
                collections: [],
                scrollToTop: true,
                drawer: 'on', // on off auto
                sidebar: 'off', // on off auto
                header: {
                    fixed: false,
                    short: false,
                    blur: false,
                    shadow: 'off', // on off scroll
                    background: 'transparent',
                    color: 'var(--on-background)',
                },
                drawerHeading: '记录未来',
                customMenu: [],
                mainMenu: false,
                styles: {
                    '--klog-page-background': '',
                    '--klog-header-background': 'var(--klog-page-background)',
                    '--klog-header-text-color': 'var(--on-surface)',
                    '--klog-header-short-width': '80px',
                    '--klog-header-height': '64px',
                    '--klog-header-opacity': 1,
                },
                toolbar: html ``
            };
            parent = defaultLayout;
        } else {
            parent = this._layout;
            parent.toolbar = undefined;
        }
        layout = Object.assign({}, parent, layout);
        layout.header = Object.assign({}, parent.header, layout.header);
        layout.styles = Object.assign({}, parent.styles, layout.styles);
        this._layout = layout;
        return layout;
    }

    _updateDynamicLayout(layout) {
        if (!layout) return {};
        layout = Object.assign({}, layout);
        for (let key in layout) {
            if (typeof (layout[key]) === 'object' && 'mobile' in layout[key] && 'desktop' in layout[key]) {
                if (!('tablet' in layout[key])) {
                    layout[key].tablet = layout[key].mobile;
                }
                layout[key] = this.mobile ? layout[key].mobile : (this.tablet ? layout[key].tablet : layout[key].desktop);
            }
        }
        return layout;
    }

    _updateSidebar(sidebar) {
        if (sidebar == 'auto') sidebar = this.desktop ? 'on' : 'off';
        this._setAttribute(this, 'sidebar-off', sidebar == 'on');
    }

    async _updateDrawer(drawer, header = undefined) {
        if (!header) { header = this.$.header; }
        await new Promise(resolve => setTimeout(resolve, 1));
        if (drawer == 'auto') drawer = this.desktop ? 'on' : 'off';
        this.$.drawer.disabled = drawer == 'off';
        // drawer-button
        const drawerButton = header.querySelector('[name=drawer-button]');
        if (drawerButton) {
            this._setAttribute(drawerButton, 'hidden', drawer == 'off');
            await new Promise(resolve => setTimeout(resolve, 1));
        }
        // drawer disabled
        this.$.drawer.$.drawer.disableSwipe = drawer == 'off';
    }

    _updateDocumentTitle(documentTitle) {
        document.title = documentTitle;
    }

    _updateStyles(styles) {
        window.ShadyCSS.styleSubtree(this, styles);
    }

    _updateHeader(header) {
        if (!this._headerHandleInit) {
            this._headerHandleInit = true;
            const shortScrollHandle = () => {
                let y = this.$.scrollTarget.scrollTop;
                this._setAttribute(this.$.header, 'collapsed', y <= 0);
            };
            const shadowScrollHandle = () => {
                let y = this.$.scrollTarget.scrollTop;
                this._setAttribute(this.$.header, 'shadow', y <= 0);
            };
            this._shortScrollHandle = shortScrollHandle;
            this._shadowScrollHandle = shadowScrollHandle;
        }
        this._setAttribute(this.$.header, 'fixed', !header.fixed);
        this._setAttribute(this.$.header, 'short', !header.short);
        this._setAttribute(this.$.header, 'blur', !header.blur);
        this._setAttribute(this.$.header, 'collapsed', true);
        this._bindEvent(this.$.scrollTarget, 'scroll', this._shortScrollHandle, !header.short);
        this._bindEvent(this.$.scrollTarget, 'scroll', this._shadowScrollHandle, header.shadow != 'scroll');
        if (header.shadow == 'scroll') {
            header.shadow = this.$.scrollTarget.scrollTop == 0 ? 'off' : 'on';
        }
        this._setAttribute(this.$.header, 'shadow', header.shadow == 'off');
    }

    async _updateToolbar(toolbar) {
        if (!toolbar || !toolbar.content) { return; }
        let oldChildren = Array.from(this.$.header.children);
        let emptyNewToolbar = toolbar.content.children.length == 0;
        let clone, children, newToolbar;
        if (!emptyNewToolbar) {
            this.$.header.style.setProperty('visibility', '');
            // remove name of old drawer-button
            for (let drawerButton of this.$.header.querySelectorAll('[name=drawer-button]')) {
                this._setAttribute(drawerButton, 'name', true);
            }
            // add new toolbar
            toolbar.content.children[0].style.setProperty('position', 'absolute');
            toolbar.content.children[0].style.setProperty('left', '0');
            toolbar.content.children[0].style.setProperty('top', '0');
            toolbar.content.children[0].style.setProperty('z-index', 99);
            this._setAttribute(toolbar.content.children[0], 'exit');
            await this._updateDrawer(this.drawer, toolbar.content);
            clone = document.importNode(toolbar.content, true);
            this.$.header.append(clone);
            await new Promise(resolve => setTimeout(resolve, 1));
            children = Array.from(this.$.header.children);
            newToolbar = children.pop();
            // update new toolbar
            await new Promise(resolve => setTimeout(resolve, 1));
        }
        // fade out and remove
        if (oldChildren.length > 0) {
            let promises = [];
            for (let oldToolbar of oldChildren) {
                this._setAttribute(oldToolbar, 'exit');
                oldToolbar.style.setProperty('opacity', 0);
                promises.push(this._timeout(new Promise(resolve => { oldToolbar.addEventListener('transitionend', resolve); }), 500));
            }
            await Promise.all(promises);
            for (let oldToolbar of oldChildren) {
                if (oldToolbar.parentNode) {
                    oldToolbar.parentNode.removeChild(oldToolbar);
                }
            }
            await new Promise(resolve => setTimeout(resolve, 1));
        }
        if (toolbar != this.toolbar) { return; }
        if (emptyNewToolbar) {
            this.$.header.style.setProperty('visibility', 'hidden');
            return;
        }
        // new toolbar enter
        newToolbar.style.setProperty('z-index', 100);
        this._setAttribute(newToolbar, 'exit', true);
        // event
        const pageElement = this.$.page.querySelector(`[name = '${this.page}']`);
        if (pageElement) {
            let eventlist = ['keydown', 'click', 'input'];
            for (let event of eventlist) {
                let buttons = this.$.header.querySelectorAll('[on-' + event + ']');
                for (let button of buttons) {
                    let functionName = button.getAttribute('on-' + event);
                    if (typeof (pageElement[functionName]) === 'function') {
                        button.addEventListener(event, pageElement[functionName].bind(pageElement));
                    } else {
                        console.log(`Error when bind function ${functionName}`);
                    }
                }
            }
        }
        // drawer-button event
        const drawerButton = this.$.header.querySelector('[name=drawer-button]');
        if (drawerButton) {
            drawerButton.addEventListener('click', () => this.$.drawer.open());
        }
    }

    _addMainMenu(menu) {
        let before = [{
            name: 'main',
            items: [
                { name: 'timeline', text: '时间轴', icon: 'timeline', path: 'timeline' },
                { name: 'note', text: '笔记', icon: 'book', path: 'note/all/' }
            ]
        }];
        let after = [];
        if (this.login) {
            before[0].items.push({ name: 'message', text: '通知', icon: 'notifications', path: 'message' });
            after.push({
                name: 'user',
                items: [
                    { subtitle: true, text: '用户' },
                    { name: 'userpanel', text: '我的', icon: 'account_circle', path: 'userpanel' },
                    { name: 'console', text: '控制台', icon: 'console' }
                ]
            });
        } else {
            after.push({
                name: 'user',
                items: [
                    { subtitle: true, text: '用户' },
                    { name: 'login', text: '登录', icon: 'account_circle', path: 'login', raised: true },
                    { name: 'signup', text: '注册', icon: 'account_box', path: 'signup' },
                    { name: 'console', text: '控制台', icon: 'console' }
                ]
            });
        }
        return before.concat(menu, after);
    }

    _updateMenu() {
        if (this.mainMenu) {
            this.menu = this._addMainMenu(this.customMenu);
        } else {
            this.menu = this.customMenu;
        }
    }

    menuSelectHandle(category, item) {
        if (item == 'console') this.$.about.open();
        let pageElement = this.$.page.querySelector(`[name='${this.page}']`);
        if (pageElement && pageElement.menuSelect) {
            return pageElement.menuSelect(category, item);
        }
    }

    _timeout(promise, timeout) {
        return Promise.race([
            promise,
            new Promise(resolve => { setTimeout(resolve, timeout); })
        ]);
    }

    _bindEvent(target, event, handle, unbind = false) {
        let id = [target.tagName, handle.name, event].join('-');
        if (!this[id]) this[id] = false;
        if (!this[id] && !unbind) {
            target.addEventListener(event, handle);
            this[id] = true;
        } else if (this[id] && unbind) {
            target.removeEventListener(event, handle);
            this[id] = false;
        }
    }

    _setAttribute(target, attribute, remove = false, value = '') {
        if (!remove) {
            target && target.setAttribute(attribute, value);
        } else {
            target && target.removeAttribute(attribute, value);
        }
    }

    aboutHelp(e) {
        this.dispatchEvent(new CustomEvent('app-load', {
            bubbles: true,
            composed: true,
            detail: { page: 'article/klog-help' }
        }));
    }

    aboutLog(e) {
        this.dispatchEvent(new CustomEvent('app-load', {
            bubbles: true,
            composed: true,
            detail: { page: 'article/about-klog-2-0' }
        }));
    }

    aboutUpdate() {
        this.dispatchEvent(new CustomEvent('update-service-worker', {
            bubbles: true,
            composed: true,
            detail: {
                callback: updateFound => {
                    if (!updateFound) {
                        this.openToast('Klog 已是最新版本');
                    }
                }
            }
        }));
    }

    aboutGitHub() {
        window.open('https://github.com/tccoin/klog2.0');
    }

    scrollTo(destination, duration = 200, easing = 'easeInOut') {
        const easings = {
            linear(t) { return t; },
            easeIn(t) { return t * t; },
            easeOut(t) { return t * (2 - t); },
            easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
        };
        const scrollTarget = this.$.scrollTarget;
        const start = scrollTarget.scrollTop;
        const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
        // const documentHeight = this.$.page.querySelector(`[name = '${this.page}']`).clientHeight;
        // const windowHeight = scrollTarget.clientHeight;
        const destinationOffset = typeof destination === 'number' ?
            destination :
            destination.getBoundingClientRect().top + target.scrollTop;
        // const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);
        const destinationOffsetToScroll = destinationOffset;
        if ('requestAnimationFrame' in window === false) {
            scrollTarget.scrollTop = destinationOffsetToScroll;
        } else {
            scrollTarget.style.scrollBehavior = 'unset';
            this._stopScroll = false;
            const scroll = () => {
                const now = 'now' in window.performance ? performance.now() : new Date().getTime();
                const progress = (now - startTime) / duration;
                const timeFunction = easings[easing](Math.min(1, progress));
                scrollTarget.scrollTop = Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start);
                if (window.pageYOffset === destinationOffsetToScroll || this._stopScroll || progress >= 1) {
                    this._stopScroll = false;
                    scrollTarget.style.scrollBehavior = 'smooth';
                    return;
                }
                requestAnimationFrame(scroll);
            };
            scroll();
        }
    }
}

window.customElements.define(KlogLayout.is, KlogLayout);