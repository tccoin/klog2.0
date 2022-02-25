import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogUiMixin } from '../framework/klog-ui-mixin.js';

import '@polymer/app-layout/app-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '../style/klog-style-card.js';
import { KlogDataMessageMixin } from '../data/klog-data-message-mixin.js';

class KlogMessage extends KlogUiMixin(KlogDataMessageMixin(PolymerElement)) {

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
                        blur: { mobile: true, desktop: false },
                        shadow: { mobile: 'scroll', desktop: 'off' },
                    },
                    styles: {
                        '--klog-header-background': { mobile: 'var(--klog-page-background)', desktop: 'transparent' },
                        '--klog-header-text-color': 'var(--on-surface)',
                        '--klog-header-opacity': 0.8
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
            <paper-button on-click="refresh" hidden-on-desktop>
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
        transition: all .2s ease-out;
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

      /*animation*/ {
      :host([exit]) .main-container,
      :host([loading]) .main-container {
        transform: translateY(25vh);
        opacity: 0;
      }
    </style>`;
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
        return [];
    }


    ready() {
        super.ready();
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
            this.userinfo = result.userinfo;
            this.login = result.login;
            await this.refresh(false);
        }
        // data
        this.route = route;
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

    async refresh(toast = true) {
        this.loading = true;
        const messages = await this.loadMessages(this.userinfo.follow, this.userinfo.publicinfo.id);
        this.messages = messages;
        this.messageGroups = this.groupByDate(messages);
        this.loading = false;
        if (toast) this.openToast('通知已更新');
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