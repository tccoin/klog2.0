import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/app-layout/app-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '../style/klog-style-card.js';
import { KlogDataMessageMixin } from '../data/klog-data-message-mixin.js';

class KlogMessage extends KlogDataMessageMixin(PolymerElement) {

  static get is() { return 'klog-message'; }

  static get properties() {
    return {
      isOwner: {
        type: Boolean,
        value: false
      },
      loading: {
        type: Boolean,
        value: true,
        reflectToAttribute: true,
      },
      immersive: {
        type: Boolean,
        reflectToAttribute: true,
      },
      layout: {
        type: Object,
        value: {
          documentTitle: '通知中心 - Klog',
          drawer: 'auto',
          mainMenu: true,
          sidebar: 'auto',
          header: {
            fixed: true,
            short: false,
            shadow: 'off',
          },
          styles: {
            '--klog-header-background': 'transparent',
            '--klog-header-text-color': 'var(--primary-text-color)',
          },
          customMenu: [{
            name: 'message',
            items: [
              { subtitle: true, text: '通知' },
              { name: 'refresh', text: '刷新', icon: 'refresh' },
            ]
          }],
          toolbar: html `
          <app-toolbar>
            <paper-icon-button icon="menu" name="drawer-button"></paper-icon-button>
            <div class="title">
              <div main-title><iron-icon icon="klog"></iron-icon></div>
              <div class="divider"></div>
              <div page-title>通知中心</div>
            </div>
            <div class="divider"></div>
            <paper-button on-click="refresh" mobile>
              <iron-icon icon="refresh"></iron-icon>
              <span>刷新</span>
            </paper-button>
          </app-toolbar>`
        }
      }
    };
  }

  menuSelect(category, item) {
    if (category == 'message' && item == 'refresh') {
      this.refresh();
    }
  }


  static get styleTemplate() {
    return html `
    <style include="klog-style-card"></style>
    <style>
      :host {
        display: block;
        padding: 64px 0 0;
      }

      .main-container{
        padding:16px;
      }

      .group-container{
        margin-bottom: 32px;
      }

      .klog-card-label,
      .message-card{
        max-width: 500px;
        width: 100%;
      }

      .message-card{
        cursor: pointer;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-tap-highlight-color: transparent;
      }
    </style>`
  }

  static get template() {
    return html `
      ${this.styleTemplate}
      <div class="main-container">${this.messageTemplate}</div>
      `;
  }

  static get messageTemplate() {
    return html `
      <template is="dom-repeat" items="{{messageGroups}}" as="group">
        <div class="group-container">
          <div class="klog-card-label">{{group.name}}</div>
          <template is="dom-repeat" items="{{group.items}}" as="item">
            <div class="klog-card message-card list" on-click="view" link="{{item.link}}">
                <!--meta-->
                <div class="card-meta">
                  <div class="meta-container">
                    <div class="meta-title">{{item.info}}</div>
                  </div>
                  <div class="meta-date">
                    <klog-render-timestamp time-stamp="{{item.createdAt}}"></klog-render-timestamp>
                  </div>
                </div>
                <!--content-->
                <div class="card-content" hidden\$="{{!item.text}}">
                  <p class="content-text" id="text">{{item.text}}</p>
                </div>
              <paper-ripple></paper-ripple>
            </div>
          </template>
        </div>
      </template>`;
  }

  static get observers() {
    return []
  }


  ready() {
    super.ready();
  }

  load(userLoadPromise) {
    return userLoadPromise.then(result => {
      if (!result.login) {
        this.dispatchEvent(new CustomEvent('user-login-page-open', {
          bubbles: true,
          composed: true
        }));
        return Promise.reject(new Error('Not Login.'))
      } else {
        this.userinfo = result.userinfo;
        this.login = result.login;
        this.refresh(false);
      }
    });
  }

  view(e) {
    const link = this._getLink(e.target);
    if (link) {
      this.dispatchEvent(new CustomEvent('app-load', {
        bubbles: true,
        composed: true,
        detail: { page: link, backTo: 'message' }
      }));
    }
  }

  refresh(toast = true) {
    this.loadMessages(this.userinfo.follow, this.userinfo.publicinfo.id).then(messages => {
      this.messages = messages;
      this.messageGroups = this.groupByDate(messages);
    }).then(() => {
      if (toast) this.showToast('通知已更新');
    });
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

  _getLink(container) {
    while (container && container.className.indexOf('message-card') == -1) {
      container = container.parentNode;
    }
    if (!container) return null;
    else return container.link;
  }


}

window.customElements.define(KlogMessage.is, KlogMessage);