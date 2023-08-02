import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogUiMixin } from '../framework/klog-ui-mixin.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '../ui/klog-menu-button.js';
import '../ui/klog-icons.js';
import '../style/klog-style-login.js';
import '../ui/klog-input.js';

class KlogLogin extends KlogUiMixin(PolymerElement) {
    static get template() {
        return html`
    <style include="klog-style-login"></style>
    <app-localstorage-document key="email" data="{{email}}"></app-localstorage-document>
    <div class="login-card">
      <div class="titles">
        <h1 name="welcome">你懂的：<br>请先登录</h1>
        <h1 name="loading">加载中……</h1>
        <h1 name="success">欧，快进来<br>我的老伙计！</h1>
        <h2 name="error">咋回事啊？啥情况啊？<br>再试一次呗。</h2>
      </div>
      <div class="form">
        <klog-input label="邮箱地址" name="email" value="{{email}}" outlined=""></klog-input>
        <klog-input id="passwordInput" label="密码" type="password" name="password" value="{{password}}" outlined="">
        </klog-input>
      </div>
      <div class="actions">
        <paper-icon-button id="go" icon="arrow_forward" on-click="login" primary></paper-icon-button>
        <klog-menu-button>
          <paper-icon-button icon="more_horiz" slot="dropdown-trigger"></paper-icon-button>
          <paper-listbox slot="dropdown-content" id="listbox" on-iron-select="_listboxSelect">
            <paper-item>注册</paper-item>
            <paper-item>重设密码</paper-item>
            <paper-item>匿名登录</paper-item>
          </paper-listbox>
        </klog-menu-button>
      </div>
    </div>
`;
    }

    static get is() { return 'klog-login'; }

    static get properties() {
        return {
            email: {
                type: String,
            },
            password: {
                type: String,
            },
            title: {
                type: String,
                value: 'welcome',
                observer: '_titleChanged'
            },
            layout: {
                type: Object,
                value: {
                    documentTitle: '登录 - Klog',
                    drawer: 'auto',
                    mainMenu: true,
                    sidebar: 'auto',
                    scrollToTop: false,
                    header: {
                        fixed: true,
                        short: false,
                        blur: true,
                        shadow: 'scroll',
                    },
                    styles: {
                        '--klog-page-background': 'var(--surface)',
                        '--klog-header-opacity': 0.8
                    },
                    toolbar: html`
              <app-toolbar>
                <paper-icon-button icon="menu" name="drawer-button"></paper-icon-button>
                <div class="title">
                  <div main-title><iron-icon icon="klog"></iron-icon></div>
                </div>
              </app-toolbar>`
                }
            },
        };
    }

    openMainDrawer() {
        this.dispatchEvent(new CustomEvent('main-drawer-open', { bubbles: true, composed: true }));
    }

    ready() {
        super.ready();
        this.$.passwordInput.addEventListener('keyup', (e) => {
            if (e.keyCode == 13) this.login();
        });
    }

    unload() {
        this.password = '';
    }

    async update(userdata) {
        // user
        this.userHandler = userdata.userHandler;
        this.title = 'welcome';
    }

    anonymousLogin() {
        this.email = 'test@krrr.party';
        this.password = '123456';
        this.login();
    }

    async resetPassword() {
        if (this.email != '') {
            try {
                await this.userHandler.resetPassword(this.email);
            } catch (err) {
                this.openToast('请检查你输入的邮箱地址');
                return;
            }
            this.openToast('密码重设邮件已发送到你的邮箱');
        } else {
            this.openToast('请填写注册时使用的邮箱地址');
        }
    }

    login() {
        this.title = 'loading';
        this.userHandler.login(this.email, this.password).then(() => {
            this.title = 'success';
            setTimeout(() => this.back(), 200);
        }, () => {
            this.title = 'error';
        });
    }

    back() {
        if (this.lastHash && !this._inHash(this.lastHash, ['login', 'signup'])) {
            this.dispatchEvent(new CustomEvent('app-load', {
                bubbles: true, composed: true,
                detail: { page: this.lastHash }
            }));
        } else {
            this.dispatchEvent(new CustomEvent('app-load', {
                bubbles: true, composed: true,
                detail: { page: 'timeline' }
            }));
        }
    }

    signup() {
        this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: 'signup', keepLastHash: this.lastHash } }));
    }

    _titleChanged(title) {
        this.shadowRoot.querySelector(`h1[name=${title}],h2[name=${title}]`).classList.remove('hidden');
        for (let element of this.shadowRoot.querySelectorAll('h1[name],h2[name]')) {
            if (element.getAttribute('name') != title) element.classList.add('hidden');
        }
    }

    _listboxSelect() {
        if (this.$.listbox.selected == 0) {
            this.signup();
        } else if (this.$.listbox.selected == 1) {
            this.resetPassword();
        } else if (this.$.listbox.selected == 2) {
            this.anonymousLogin();
        }
        this.$.listbox.selected = null;
    }
}

window.customElements.define(KlogLogin.is, KlogLogin);