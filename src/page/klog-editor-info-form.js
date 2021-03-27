import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogUiMixin } from '../framework/klog-ui-mixin.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '../style/klog-style-form.js';
import '../ui/klog-input.js';
import '../style/klog-style.js';
import { KlogDataLicenseMixin } from '../data/klog-data-license-mixin.js';

class KlogEditorInfoForm extends KlogUiMixin(KlogDataLicenseMixin(PolymerElement)) {
  static get template() {
    return html `
    <style include="klog-style-form"></style>
    <style>
      :host {
        display: block;
        --klog-input-background-color: var(--klog-page-background);
      }

      #licenseInput{
        cursor: pointer;
      }

      #deleteButton {
        color: var(--paper-red-500);
      }

      #deleteButton:hover {
        color: var(--paper-red-700);
      }
    </style>
    <!-- <klog-input label="标题" value="{{title}}" outlined></klog-input> -->
    <klog-input label="路径" id="pathInput" placeholder="{{randomPath}}" value="{{path}}" outlined></klog-input>
    <klog-input label="版权协议" id="licenseInput"  value="{{licenseAbbreviation}}" on-click="openLicenseDrawer" outlined></klog-input>

    <div class="form-item">
      <div class="text-container">
        <span class="title">私有</span><br>
        <span class="description">这篇文章不会被推送至时间轴</span>
      </div>
      <paper-toggle-button checked="{{private}}"></paper-toggle-button>
    </div>

    <div class="form-item" hidden\$="{{!articleId}}">
      <div class="text-container">
        <span class="title">保存但不置顶</span><br>
        <span class="description">防止时间轴扰动</span>
      </div>
      <paper-button on-click="save" disabled="{{_calcSaveButtonDisabled(articleId,loading,private)}}">
        <iron-icon icon="save_alt"></iron-icon>
      </paper-button>
    </div>

    <div class="form-item" hidden\$="{{!articleId}}">
      <div class="text-container">
        <span class="title">销毁</span><br>
        <span class="description">连击按钮以确认执行</span>
      </div>
      <paper-button id="deleteButton" on-click="delete" disabled="{{_calcDeleteButtonDisabled(articleId,loading)}}">
        <iron-icon icon="delete"></iron-icon>
        {{deleteCountdown}}
      </paper-button>
    </div>
`;
  }

  static get is() { return 'klog-editor-info-form'; }

  static get properties() {
    return {
      title: {
        type: String,
        notify: true
      },
      path: {
        type: String,
        notify: true
      },
      private: {
        type: Boolean,
        notify: true,
      },
      license: {
        type: String,
        notify: true,
        observer: '_updateLicenseAbbreviation',
      },
      loading: {
        type: Boolean,
        observer: '_resetCountdown',
      },
      deleteCountdown: {
        type: Number,
        value: 3,
      },
      deleteLock: {
        type: Boolean,
        value: false,
      },
      folded: {
        type: Boolean,
        value: false,
      },
      icon: {
        type: String,
        value: 'keyboard-arrow-up'
      },
      articleId: {
        type: String,
        observer: 'articleIdChanged'
      }
    }
  }

  articleIdChanged() {
    this.dispatchEvent(new CustomEvent('klog-backdrop-update', { bubbles: true, composed: true }));
  }

  save() {
    this.dispatchEvent(new CustomEvent('save', { bubbles: true, composed: true, detail: { quiet: true } }));
  }

  openLicenseDrawer() {
    this.openDrawer('版权协议', [{ name: 'license', items: this.getLicenseMenu(this.fullLicenseList) }]);
  }

  _updateLicenseAbbreviation(license) {
    this.licenseAbbreviation = this.fullLicenseList.find(x => x['name'] == license)['abbreviation'];
  }

  delete() {
    if (this.deleteCountdown > 0) {
      if (this.deleteLock) return
      this.deleteLock = true;
      setTimeout(() => {
        this.deleteLock = false;
        this.deleteCountdown--;
      }, 200);
      return
    }
    this.dispatchEvent(new CustomEvent('delete', { bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('klog-backdrop-toggle', { bubbles: true, composed: true }));
  }

  _resetCountdown() {
    if (!this.loading) this.deleteCountdown = 3;
  }

  _calcSaveButtonDisabled() {
    return !this.articleId || this.private || this.loading;
  }

  _calcDeleteButtonDisabled() {
    return !this.articleId || this.loading;
  }
}

window.customElements.define(KlogEditorInfoForm.is, KlogEditorInfoForm);