import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '../style/klog-style.js';
import '../style/klog-style-layout.js';
import '../style/klog-style-card.js';
import '../ui/klog-icons.js';

class KlogAppsKdoc extends PolymerElement {
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
        --primary: var(--paper-indigo-500);
        --secondary: #FFF;
      }

      [page-title] {
        opacity: 0.8;
      }

      .form {
        max-width: 720px;
        margin: 32px auto;
        padding: 32px;
      }

      paper-button[primary] {
        color: var(--primary);
      }

      paper-button iron-icon {
        margin-right: 8px;
      }

      paper-input {
        background: rgba(0, 0, 0, 0.05);
        padding-top: 8px;
        margin: 0 0 16px 0;
        border-radius: 4px;

        --paper-input-container: {
          padding: 0;
        }

        --paper-input-container-label: {
          padding: 0 16px;
          box-sizing: border-box;
        }

        --paper-input-container-input: {
          padding: 0 12px 8px;
          box-sizing: border-box;
        }
      }
    </style>
    <app-header fixed="">
      <app-toolbar>
        <div class="title">
          <div main-title="">Kdoc</div>
          <div class="divider"></div>
          <div page-title="">Alpha</div>
        </div>
      </app-toolbar>
    </app-header>
    <div class="form klog-card">
      <paper-input label="网址" value="{{url}}"></paper-input>
      <paper-button on-click="generate" primary="">
        <iron-icon icon="save"></iron-icon>
        生成
      </paper-button>
      <paper-button on-click="preview">
        <iron-icon icon="edit"></iron-icon>
        预览
      </paper-button>
    </div>
`;
    }

    static get is() { return 'klog-apps-kdoc'; }

    ready() {
        super.ready();
    }

    generate() {
        console.log(123);
    }
}

window.customElements.define(KlogAppsKdoc.is, KlogAppsKdoc);
