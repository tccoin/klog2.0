import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogUiMixin } from '../framework/klog-ui-mixin.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '../ui/klog-menu-button.js';
import '../ui/klog-icons.js';
import '../style/klog-style-login.js';
import '../style/klog-style-dialog.js';
import '../ui/klog-input.js';

class KlogSignup extends KlogUiMixin(PolymerElement) {
    static get template() {
        return html `
    <style include="klog-style-login"></style>
    <style include="klog-style-dialog"></style>
    <style>
      paper-dialog {
          max-width: 400px;
      }
    </style>
    <paper-dialog id="dialog">
      <h2>注册之前…</h2>
      <p>
        请放心，您的密码将不会被明文保存。
        <br><br>
        此外，您的所有个人信息均不会与第三方共享，还有您的文章和评论和图片和头像的著作权都属于您。
        <br><br>
        没错，这里很*文明*。
        <br><br>
        热忱地欢迎您。
      </p>
      <div class="actions">
        <paper-button primary="" dialog-confirm>了解</paper-button>
      </div>
    </paper-dialog>
    <div class="login-card">
      <div class="titles">
        <h2 name="welcome">注册条款：<br>一、您无权得知条款内容</h2>
        <h1 name="loading">登记中……</h1>
        <h1 name="success">拿好，<br>你的新人卡来了。</h1>
        <h1 name="error_email_format">这个邮箱地址…<br>好像哪里不对？</h1>
        <h1 name="error_info">信息有误…<br>检查一下？</h1>
        <h1 name="error_short_password">密码太短了欸</h1>
        <h1 name="error_email_taken">这个邮箱已经注册过了<br>直接<a href="#/login">登录</a>试试？</h1>
      </div>
      <div class="form">
        <klog-input label="邮箱地址" name="email" value="{{email}}" outlined=""></klog-input>
        <klog-input id="passwordInput" label="密码" name="password" value="{{password}}" outlined=""></klog-input>
      </div>
      <div class="actions">
        <paper-icon-button id="go" icon="done" on-click="signup" primary=""></paper-icon-button>
        <klog-menu-button>
          <paper-icon-button icon="more_horiz" slot="dropdown-trigger"></paper-icon-button>
          <paper-listbox slot="dropdown-content" id="listbox" on-iron-select="_listboxSelect">
            <paper-item>登录</paper-item>
          </paper-listbox>
        </klog-menu-button>
      </div>
    </div>
`;
    }

    static get is() { return 'klog-signup'; }

    static get properties() {
        return {
            email: {
                type: String,
                value: ''
            },
            password: {
                type: String,
                value: ''
            },
            title: {
                type: String,
                value: 'welcome',
                observer: '_titleChanged'
            },
            layout: {
                type: Object,
                value: {
                    documentTitle: '注册 - Klog',
                    drawer: 'auto',
                    mainMenu: true,
                    sidebar: 'auto',
                    scrollToTop: false,
                    header: {
                        fixed: true,
                        short: false,
                        shadow: 'off',
                    },
                    styles: {
                        '--klog-page-background': 'var(--surface)',
                        '--klog-header-opacity': 0.8
                    },
                    toolbar: html `
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
            if (e.keyCode == 13) this.signup();
        });
    }

    async update(userLoadPromise, route) {
        // user
        const result = await userLoadPromise;
        this.user = result.user;
        this.title = 'welcome';
        setTimeout(() => this.$.dialog.open(), 1000);
    }

    signup() {
        this.title = 'loading';
        if (this.password.length <= 6) {
            this.title = 'error_short_password';
            return;
        }
        this.user.signup(this.email, this.password).then(() => {
            this.title = 'success';
            setTimeout(()=>this.back(), 200);
        }, err => {
            window.err = err;
            console.log(err, err.code);
            if (err) {
                if (err.code == 125) {
                    this.title = 'error_email_format';
                } else if (err.code == 203) {
                    this.title = 'error_email_taken';
                } else {
                    this.title = 'error_info';
                }
            } else {
                this.title = 'error_info';
            }

        });
    }

    back() {
        if (!this._inHash(this.lastHash, ['login', 'signup'])) {
            this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true,
                detail: { page: this.lastHash }
            }));
        } else {
            this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true,
                detail: { page: 'timeline' }
            }));
        }
    }

    login() {
        this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: 'login', keepLastHash: this.lastHash } }));
    }

    _titleChanged(title) {
        this.shadowRoot.querySelector(`h1[name=${title}],h2[name=${title}]`).classList.remove('hidden');
        for (let element of this.shadowRoot.querySelectorAll('h1[name],h2[name]')) {
            if (element.getAttribute('name') != title) element.classList.add('hidden');
        }
    }

    _listboxSelect() {
        if (this.$.listbox.selected == 0) {
            this.login();
        }
        this.$.listbox.selected = null;
    }
}

window.customElements.define(KlogSignup.is, KlogSignup);