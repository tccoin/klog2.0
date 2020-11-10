import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '../lib/web-animations-next-lite.min.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '../ui/klog-icons.js';
import '../style/klog-style-login.js';
import '../ui/klog-input.js';

class KlogLogin extends PolymerElement {
  static get template() {
    return html `
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
        <paper-icon-button id="go" icon="arrow_forward" on-click="login" primary=""></paper-icon-button>
        <paper-menu-button>
          <paper-icon-button icon="more_horiz" slot="dropdown-trigger"></paper-icon-button>
          <paper-listbox slot="dropdown-content">
            <paper-item on-click="signup">注册</paper-item>
            <paper-item on-click="resetPassword">重设密码</paper-item>
            <paper-item on-click="anonymousLogin">匿名登录</paper-item>
          </paper-listbox>
        </paper-menu-button>
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
            shadow: 'off',
          },
          styles: {
            '--klog-layout-background': 'var(--primary-background-color)',
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

  openDrawer() {
    this.dispatchEvent(new CustomEvent('drawer-toggle', { bubbles: true, composed: true }));
  }

  ready() {
    super.ready();
    this.$.passwordInput.addEventListener('keyup', (e) => {
      if (e.keyCode == 13) this.login();
    });
    this.$.go.addEventListener('mousedown', function() {
      this.shadowRoot.querySelector('#ink').classList.remove('circle');
    });
  }

  load(userLoadPromise) {
    this.title = 'welcome';
    userLoadPromise.then(result => {
      this.user = result.user;
    });
    this.continue = this.continue || '#/timeline';
  }

  anonymousLogin() {
    this.email = 'test@krrr.party';
    this.password = '123456';
    this.login();
  }

  async resetPassword() {
    if (this.email != '') {
      try {
        await this.user.resetPassword(this.email);
      } catch (err) {
        this.showToast('请检查你输入的邮箱地址');
        return;
      }
      this.showToast('密码重设邮件已发送到你的邮箱');
    } else {
      this.showToast('请填写注册时使用的邮箱地址');
    }
  }

  showToast(text, link) {
    this.dispatchEvent(new CustomEvent('show-toast', {
      bubbles: true,
      composed: true,
      detail: {
        text: text,
        link: link
      }
    }));
  }

  login() {
    this.title = 'loading';
    this.user.login(this.email, this.password).then(() => {
      this.title = 'success';
      setTimeout(() => {
        this.continue = this.continue || '#/';
        window.location = '/#/';
        setTimeout(() => window.location.reload(), 100);
        this.password = '';
      }, 500);
    }, () => {
      this.title = 'error';
    });
  }

  signup() {
    this.dispatchEvent(new CustomEvent('user-signup-page-open', {
      bubbles: true,
      composed: true,
      detail: { continue: this.continue }
    }));
  }

  _titleChanged(title) {
    this.shadowRoot.querySelector(`h1[name=${title}],h2[name=${title}]`).classList.remove('hidden');
    for (let element of this.shadowRoot.querySelectorAll(`h1[name],h2[name]`)) {
      if (element.getAttribute('name') != title) element.classList.add('hidden')
    }
  }
}

window.customElements.define(KlogLogin.is, KlogLogin);