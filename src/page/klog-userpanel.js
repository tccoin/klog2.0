import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogUiMixin } from '../framework/klog-ui-mixin.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '../ui/klog-icons.js';
import '../style/klog-style-card.js';
import '../style/klog-style-toolbar.js';
import '../style/klog-style-dialog.js';
import '../style/klog-style-form.js';
import '../ui/klog-render-timestamp.js';
import '../ui/klog-upload-zone.js';
import '../data/klog-data-user.js';
import '../ui/klog-input.js';
import '../ui/klog-dropdown-menu.js';
import '../ui/klog-render-license.js'
import { KlogDataLicenseMixin } from '../data/klog-data-license-mixin.js';
import { KlogDataUserPublicMixin } from '../data/klog-data-user-public-mixin.js';

class KlogUserpanel extends KlogUiMixin(KlogDataUserPublicMixin(KlogDataLicenseMixin(PolymerElement))) {
  static get template() {
    return html `
    <style include="klog-style-card"></style>
    <style include="klog-style-toolbar"></style>
    <style include="klog-style-dialog"></style>
    <style include="klog-style-form"></style>
    <style>
      :host {
        display: block;
        background: var(--klog-page-background);
        padding: 80px 0 32px var(--klog-layout-margin-left) !important;
        --klog-card-padding: 12px;
      }

      app-toolbar {
        position: fixed;
        top: 0;
        background: transparent;
      }

      .divider {
        flex: 1;
      }

      .klog-card {
        max-width: 400px;
        width: calc(100% - 16px);
        margin: 0 auto 32px;
        border-radius: 5px;
        box-sizing: border-box;
        background-color: var(--primary-background-color);
        transition: all .15s ease-out;
        @apply --shadow-elevation-2dp;
      }

      .klog-card .card-meta {
        font-weight: bold;
        margin-bottom: calc(var(--klog-card-padding) * 3);
        font-size: 1.1em;
      }

      .klog-card:last-child {
        margin-bottom: 0;
      }

      .klog-card .card-meta.header paper-icon-button {
        color: var(--primary-color);
      }

      .form>* {
        margin: 0 calc(var(--klog-card-padding) * 2);
        padding-bottom: calc(var(--klog-card-padding) * 2);
      }

      .form>*:last-child {
        padding-bottom: 0;
      }

      klog-upload-zone {
        width: 200px;
      }

      paper-listbox paper-item{
        white-space: nowrap;
      }

      span.primary{
        color: var(--primary-color);
        font-weight: bolder;
      }

      #licenseInput{
        cursor: pointer;
      }

      /*animation*/

      :host([exit]) .klog-card {
        opacity: 0;
        transform: translateY(5vh);
      }
    </style>
    <klog-data-user id="user" disabled=""></klog-data-user>

    <div class="klog-card" mobile="[[mobile]]" hidden="{{_hasUsername}}">
      <div class="card-meta">设置用户名</div>
      <div class="card-content">
        用户名与账户一一对应，设定后可以通过用户名快捷访问个人页面。
      </div>
      <div class="form">

        <klog-input label="用户名" value="{{username}}" outlined></klog-input>

        <div class="form-item">
          <div class="text-container">
            <span class="title">个人页面</span><br>
            <span class="description" hidden="{{!username}}">klog.app/<span class="primary">#/{{username}}</span></span>
            <span class="description" hidden="{{username}}">klog.app/#/zone/{{userinfo.publicinfo.id}}</span>
          </div>
        </div>

        <div class="form-item">
          <div class="text-container">
            <span class="title">确认并保存</span><br>
            <span class="description">之后将无法修改</span>
          </div>
          <paper-button on-click="updateUsername">
            <iron-icon icon="done"></iron-icon>
          </paper-button>
        </div>

      </div>
    </div>

    <div class="klog-card" mobile="[[mobile]]">
      <div class="card-meta">公开信息</div>
      <div class="form">
        <klog-input label="头像路径" value="{{userinfo.avatarUrl}}" outlined hidden>
        </klog-input>
        <klog-input label="昵称" on-change="updatePublicinfo" value="{{userinfo.displayName}}" outlined></klog-input>
        <klog-input label="个人介绍" on-change="updatePublicinfo" value="{{userinfo.introduction}}" outlined></klog-input>

        <div class="form-item">
          <div class="text-container">
            <span class="title">上传头像</span>
          </div>
          <paper-button on-click="openUploadAvatarDialog">
            <iron-icon icon="cloud_upload"></iron-icon>
          </paper-button>
        </div>
      </div>
    </div>

    <div class="klog-card" mobile="[[mobile]]">
      <div class="card-meta">版权</div>
      <div class="form">
        <klog-input label="版权协议" id="licenseInput" value="{{licenseAbbreviation}}" on-click="openLicenseDrawer" outlined></klog-input>

        <div class="form-item">
          <div class="text-container">
            <span class="title">预览</span><br>
            <div class="description"><klog-render-license license="{{userinfo.license}}" default-license="{{userinfo.license}}"></klog-render-license></div>
          </div>
        </div>

        <div class="form-item">
          <div class="text-container">
            <span class="title">选择协议</span><br>
            <span class="description">打开协议选择器</span>
          </div>
          <paper-button on-click="openLicenseChooser">
            <iron-icon icon="launch"></iron-icon>
          </paper-button>
        </div>
      </div>
    </div>

      <div class="klog-card" mobile="[[mobile]]">
        <div class="card-meta">外观</div>
        <div class="form">
          <klog-dropdown-menu label="主题" outlined vertical-offset="64" horizontal-offset="-16">
            <paper-tabs selected="{{preference.theme}}" slot="dropdown-content" class="dropdown-content" attr-for-selected="name">
              <paper-tab name="light">浅色</paper-tab>
              <paper-tab name="dark">深色</paper-tab>
              <paper-tab name="system">跟随系统</paper-tab>
              <paper-tab name="time">根据时间</paper-tab>
            </paper-tabs>
          </klog-dropdown-menu>
  
          <!-- <div class="form-item">
            <div class="text-container">
              <span class="title">毛玻璃效果</span><br>
              <span class="description">实验性</span>
            </div>
            <paper-toggle-button checked="{{preference.backdropBlurEnabled}}"></paper-toggle-button>
          </div>
          -->
        </div>


      <!-- <paper-toggle-button checked="{{preference.darkThemeDisabled}}">没有黑夜</paper-toggle-button> -->
      <!-- <paper-toggle-button checked="{{preference.gestureDisabled}}">手势什么的最讨厌了</paper-toggle-button> -->
    </div>
    <div class="fit"></div>


    <div class="klog-card" mobile="[[mobile]]" id="animation">
      <div class="card-meta">阅读</div>
      <div class="form">
        <klog-dropdown-menu label="标题序号" outlined vertical-offset="64" horizontal-offset="-16">
          <paper-tabs selected="{{preference.markdown.numberedHeading}}" slot="dropdown-content" class="dropdown-content" attr-for-selected="name">
            <paper-tab name="true">显示</paper-tab>
            <paper-tab name="auto">自动</paper-tab>
            <paper-tab name="false">隐藏</paper-tab>
          </paper-tabs>
        </klog-dropdown-menu>
        <klog-dropdown-menu label="标题位置" outlined vertical-offset="64" horizontal-offset="-16">
          <paper-tabs selected="{{preference.markdown.centeredHeading}}" slot="dropdown-content" class="dropdown-content" attr-for-selected="name">
            <paper-tab name="false">正常</paper-tab>
            <paper-tab name="true">居中</paper-tab>
          </paper-tabs>
        </klog-dropdown-menu>
        <klog-dropdown-menu label="大段代码" outlined vertical-offset="64" horizontal-offset="-16">
          <paper-tabs selected="{{preference.markdown.overflowCode}}" slot="dropdown-content" class="dropdown-content" attr-for-selected="name">
            <paper-tab name="true">滚动</paper-tab>
            <paper-tab name="false">全部显示</paper-tab>
          </paper-tabs>
        </klog-dropdown-menu>

        <div class="form-item">
          <div class="text-container">
            <span class="title">重设</span><br>
            <span class="description">恢复默认</span>
          </div>
          <paper-button on-click="resetMarkdownPreference">
            <iron-icon icon="settings_backup_restore"></iron-icon>
          </paper-button>
        </div>
      </div>

      <!-- <div class="klog-card" mobile="[[mobile]]">
      <div class="card-meta">启动时打开</div>
      <div class="form">
        <paper-radio-group selected="{{preference.defaultPage}}">
          <paper-radio-button name="timeline">时间轴</paper-radio-button>
          <paper-radio-button name="note">笔记</paper-radio-button>
        </paper-radio-group>
      </div>
    </div> -->

      <paper-dialog id="uploadAvatarDialog" with-backdrop="">
        <klog-upload-zone bucketname="klog-avatar" fileinfo="{{avatarinfo}}"></klog-upload-zone>
      </paper-dialog>
  </div>
`;
  }

  static get is() {
    return 'klog-userpanel';
  }

  static get properties() {
    return {
      mobile: {
        type: Boolean,
        reflectToAttribute: true
      },
      layout: {
        type: Object,
        value: {
          documentTitle: '个人设置 - Klog',
          drawer: 'auto',
          mainMenu: true,
          sidebar: 'auto',
          scrollToTop: false,
          header: {
            fixed: true,
            short: false,
            blur: { mobile: true, desktop: false },
            shadow: { mobile: 'scroll', desktop: 'off' },
          },
          styles: {
            '--klog-header-background': { mobile: 'var(--klog-page-background)', desktop: 'transparent' },
            '--klog-header-text-color': 'var(--primary-text-color)',
            '--klog-header-opacity': 0.8
          },
          customMenu: [{
            name: 'account',
            items: [
              { subtitle: true, text: '账户' },
              { name: 'logout', text: '注销', icon: 'power_settings_new' }
            ]
          }],
          toolbar: html `
            <app-toolbar>
              <paper-icon-button icon="menu" name="drawer-button"></paper-icon-button>
                <div class="title">
                  <div main-title><iron-icon icon="klog"></iron-icon></div>
                </div>
              <div class="divider"></div>
              <paper-button on-click="logout" mobile>
                <iron-icon icon="power_settings_new"></iron-icon>注销
              </paper-button>
            </app-toolbar>`
        }
      },
    };
  }

  static get observers() {
    return [
      '_updateLicenseAbbreviation(userinfo.license)',
      'updateAvatarUrl(avatarinfo)',
      'updatePreference(preference.theme,preference.defaultPage,preference.backdropBlurEnabled,preference.markdown.numberedHeading,preference.markdown.centeredHeading,preference.markdown.overflowCode)',
    ]
  }

  load(userLoadPromise) {
    this._hasUsername = true;
    if (!this.login) {
      return userLoadPromise.then(result => {
        if (!result.login) {
          this.dispatchEvent(new CustomEvent('user-login-page-open', {
            bubbles: true,
            composed: true
          }));
          return Promise.reject(new Error('Not Login.'))
        } else {
          this.preference = result.userinfo.preference;
          this.userinfo = result.userinfo;
          this.login = result.login;
          this._hasUsername = Boolean(this.userinfo.username);
        }
      });
    }
  }

  ready() {
    super.ready();
    this.$.uploadAvatarDialog.addEventListener('opened-changed', e => {
      this.dispatchEvent(new CustomEvent('editor-backdrop-opened-changed', {
        bubbles: true,
        composed: true,
        detail: { value: e.detail.value }
      }));
    });
  }

  updateUsername() {
    if (!/^[a-zA-Z]/.test(this.username)) {
      return this.openToast('用户名第一位请使用字母');
    } else if (this.username.length < 6) {
      return this.openToast('用户名长度至少6位');
    } else if (this.username.length > 20) {
      return this.openToast('用户名长度至多20位');
    }
    this.validateUsername(this.username).then(isValid => {
      if (isValid) {
        let newInfo = {
          username: {
            publicRead: true,
            value: this.username
          }
        };
        this._updateUserinfo(newInfo, false).then(() => {
          this.openToast('用户名已保存');
          this._hasUsername = true;
        });
      } else {
        return this.openToast('用户名已被占用');
      }
    });
  }

  openLicenseDrawer() {
    this.openDrawer('版权协议', [{ name: 'license', items: this.getLicenseMenu(this.licenseList) }]);
  }

  _updateLicenseAbbreviation(license) {
    this.licenseAbbreviation = this.fullLicenseList.find(x => x['name'] == license)['abbreviation'];
  }

  menuSelect(category, item) {
    if (category == 'account' && item == 'logout') {
      this.logout();
    } else if (category == 'license') {
      this.set('userinfo.license', item);
    }
  }

  openMainDrawer() {
    this.dispatchEvent(new CustomEvent('main-drawer-open', {
      bubbles: true,
      composed: true
    }));
  }

  logout() {
    this.userinfo.klogUser.logout();
    window.location = '/#/';
    setTimeout(() => window.location.reload(), 100);
  }

  newArticle() {
    this.dispatchEvent(new CustomEvent('app-load', {
      bubbles: true,
      composed: true,
      detail: {
        page: 'editor/'
      }
    }));
  }

  resetMarkdownPreference() {
    this.set("preference.markdown", Object.assign({}, this.$.user.defaultPreference.markdown));
    console.log(this.$.user.defaultPreference.markdown);
  }

  loadList() {
    this.$.data.load();
  }

  parseDate(date) {
    return Date.parse(date)
  }

  openUploadAvatarDialog() {
    this.$.uploadAvatarDialog.open();
  }

  openLicenseChooser() {
    window.open("https://chooser-beta.creativecommons.org/");
  }

  updateAvatarUrl(avatarinfo) {
    this.userinfo.avatarUrl = avatarinfo.host + '/' + avatarinfo.key;
    this.$.uploadAvatarDialog.close();
    this.updatePublicinfo();
  }

  _updateUserinfo(info, toast = true) {
    let klogUser = this.userinfo.klogUser;
    return klogUser.update(info).then(() => {
      if (toast) this.openToast('已更新账户');
      klogUser.updateUserinfo();
    });
  }

  updatePublicinfo() {
    setTimeout(() => {
      let newInfo = {
        displayName: {
          publicRead: true,
          value: this.userinfo.displayName
        },
        introduction: {
          publicRead: true,
          value: this.userinfo.introduction
        },
        avatarUrl: {
          publicRead: true,
          value: this.userinfo.avatarUrl
        },
        license: {
          publicRead: true,
          value: this.userinfo.license
        },
      };
      this._updateUserinfo(newInfo);
    }, 1);
  }

  updatePreference() {
    if (!this._preferenceInit) {
      this._preferenceInit = true;
      return;
    }
    this.userinfo.preference = this.preference;
    this._updateUserinfo({
      preference: {
        value: this.preference
      }
    });
  }
}

window.customElements.define(KlogUserpanel.is, KlogUserpanel);