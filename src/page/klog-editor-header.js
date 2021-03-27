import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '../style/klog-style-toolbar.js';
import '../style/klog-style-dialog.js';

class KlogEditorHeader extends PolymerElement {
  static get template() {
    return html `
    <style include="klog-style-toolbar"></style>
    <style include="klog-style-dialog"></style>
    <style>
      :host {
        display: block;
        padding: 0;
        --klog-header-background: transparent;
      }

      app-toolbar {
        width: 100vw;
        position: fixed;
        left: 0;
        color: var(--primary-text-color);
        background: transparent;
        --paper-progress-container-color: transparent;
      }

      app-toolbar paper-icon-button {
        width: 48px;
        height: 48px;
        padding: 12px;
        flex-basis: 48px;
        flex-shrink: 0;
      }

      app-toolbar paper-button {
        font-size: 14px;
        color: var(--primary-text-color);
        background-color: var(--accent-color);
      }

      app-toolbar paper-button iron-icon {
        margin-right: 8px;
      }

      app-toolbar paper-progress {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: auto;
        width: 100%;
        --paper-progress-active-color: var(--primary-color);
        --paper-progress-container-color: transparent;
      }

      #infoFormDialog {
        width: 300px;
      }

      .divider {
        flex: 1;
      }

      @media (min-width: 1025px) {
        [hidden-on-desktop] {
          display: none!important;
        }
      }
      @media (min-width: 769px) and (max-width: 1023px) {
        [hidden-on-tablet] {
          display: none!important;
        }
      }
      @media (max-width: 768px) {
        [hidden-on-mobile] {
          display: none!important;
        }
      }
    </style>
    <iron-pages id="pages" selected="0">
      <app-toolbar>
        <paper-icon-button icon="arrow_back" on-click="back"></paper-icon-button>
        <div class="divider"></div>
        <paper-toggle-button checked="{{preview}}" hidden-on-desktop hidden-on-tablet></paper-toggle-button>
        <paper-icon-button icon="add_circle" on-click="insert" hidden-on-desktop></paper-icon-button>
        <paper-icon-button for="infoform" icon="highlight" on-click="activeFront" hidden="" id="infoformButton"></paper-icon-button>
        <paper-icon-button for="infoform" icon="settings" on-click="activeFront" hidden-on-desktop>
        </paper-icon-button>
        <paper-icon-button for="uploadzone" icon="insert_drive_file" on-click="upload" hidden-on-desktop></paper-icon-button>
        <paper-icon-button for="browser" icon="book" on-click="activeFront" disabled="{{loading}}" hidden="">
        </paper-icon-button>
        <paper-button raised="" id="saveButton" on-click="publish" disabled="{{loading}}" hidden-on-desktop>
          <iron-icon icon="publish"></iron-icon>保存
        </paper-button>
        <paper-progress indeterminate="" disabled="{{!loading}}"></paper-progress>
      </app-toolbar>
      <app-toolbar>
        <paper-icon-button icon="arrow_back" on-click="back"></paper-icon-button>
        <div class="divider"></div>
        <paper-icon-button icon="close" on-click="activeFront"></paper-icon-button>
      </app-toolbar>
    </iron-pages>
`;
  }

  static get is() { return 'klog-editor-header'; }

  static get properties() {
    return {
      articleId: {
        type: String,
        notify: true
      },
      title: {
        type: String,
        notify: true
      },
      selected: {
        type: Number,
        notify: true
      },
      preview: {
        type: Boolean,
        value: false,
        observer: '_updateSelected'
      },
    }
  }

  ready() {
    super.ready();
  }

  insert() {
    this.dispatchEvent(new CustomEvent('insert-drawer-open', { bubbles: true, composed: true }));
  }

  back() {
    this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }

  publish() {
    this.dispatchEvent(new CustomEvent('save', { bubbles: true, composed: true, detail: { quiet: false } }));
  }

  upload(e) {
    if (this.mobile) {
      this.activeFront(e);
    } else {
      this.$.uploadzone.$.input.click();
    }
  }

  activeFront(e) {
    if (!this.$.backdrop.active) {
      this.$.pages.selected = 1;
      this.dispatchEvent(new CustomEvent('active-backdrop-front', {
        bubbles: true,
        composed: true,
        detail: {
          selected: e.target.getAttribute('for')
        }
      }));
    } else {
      this.$.pages.selected = 0;
      this.$.backdrop.hide();
    }
  }

  _is(val) {
    return Boolean(val)
  }

  _updateSelected(preview) {
    this.selected = preview ? 1 : 0;
  }
}
window.customElements.define(KlogEditorHeader.is, KlogEditorHeader);