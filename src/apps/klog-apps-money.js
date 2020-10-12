import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '../style/klog-style-layout.js';
import '../style/klog-style-card.js';
import '../ui/klog-icons.js';

class KlogAppsMoney extends PolymerElement {
  static get template() {
    return html`
    <style include="klog-style-layout"></style>
    <style include="klog-style-card"></style>
    <style>
      :host {
        display: block;
        min-height: var(--klog-layout-page-height);
        padding: 64px 0 32px;
        background-color: var(--klog-page-background);
      }

      app-header {
        --primary-text-color: #FFF;
        --secondary-text-color: #FFF;
        --primary-background-color: var(--paper-indigo-700);
        --secondary-background-color: var(--paper-indigo-500);
        --header-text-color: #FFF;
        overflow: hidden;
        box-shadow: 0 4px 4px rgba(0, 0, 0, .3);
      }

      .form {
        max-width: 720px;
        margin: 32px auto;
        padding: 32px;
      }

      paper-input:first-child {
        margin-top: 0 !important;
      }

      paper-dialog {
        overflow-y: auto;
        min-width: 350px;
        max-width: 400px;
      }

      paper-toast em {
        color: var(--paper-yellow-500);
        font-style: normal;
      }
    </style>
    <app-header fixed="">
      <app-toolbar>
        <div class="title">
          <div main-title="">打钱demo</div>
        </div>
        <paper-button on-click="process" raised="">
          <iron-icon icon="save"></iron-icon>
          生成
        </paper-button>
      </app-toolbar>
    </app-header>
    <app-localstorage-document key="number" data="{{number}}"></app-localstorage-document>
    <app-localstorage-document key="messages" data="{{messages}}"></app-localstorage-document>
    <div class="form klog-card">
      <paper-input label="金额" value="{{number}}"></paper-input>
      <paper-textarea label="备注" value="{{messages}}" placeholder="{{messages}}">
        <paper-textarea>
    </paper-textarea></paper-textarea></div>

    <paper-toast id="numberErrorToast" text="一毛不拔？"></paper-toast>

    <paper-dialog id="resultDialog" with-backdrop="">
      <h2>转账成功</h2>
      <p>备注：{{messages}}</p>
    </paper-dialog>
`;
  }

  static get is() { return 'klog-apps-money'; }

  ready() {
    super.ready();
    this._int = setInterval(() => { this.updateTheme() }, 10000);
  }

  static get properties() {
    return {
      messages: {
        type: String,
        value: '我 可爱 打钱'
      },
    }
  }

  updateTheme() {
    let htmlTheme = document.querySelector('html').getAttribute('theme');
    if (htmlTheme) {
      document.querySelector('html').setAttribute('theme', htmlTheme + ' custom');
      document.querySelector('html').style.background = 'var(--paper-indigo-700)';
    }
  }

  process() {
    if (!this.number) {
      this.$.numberErrorToast.open();
    } else {
      this.$.resultDialog.open();
    }

  }
}

window.customElements.define(KlogAppsMoney.is, KlogAppsMoney);
