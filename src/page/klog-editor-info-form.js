import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '../ui/klog-dropdown-menu.js';
import '../style/klog-style-form.js';
import '../ui/klog-input.js';
import '../style/klog-style.js';
import { KlogDataLicenseMixin } from '../data/klog-data-license-mixin.js';

class KlogEditorInfoForm extends KlogDataLicenseMixin(PolymerElement) {
  static get template() {
    return html `
    <style include="klog-style-form"></style>
    <style>
      :host {
        display: block;
        --klog-input-background-color: var(--klog-page-background);
      }

      paper-listbox{
        display: flex;
        flex-direction: row;
        max-width: 343px;
        flex-wrap: wrap;
      }

      paper-listbox paper-item{
        user-select: none;
        width: fit-content;
      }

      #deleteButton {
        color: var(--paper-red-500);
      }

      #deleteButton:hover {
        color: var(--paper-red-700);
      }
    </style>
    <!-- <klog-input label="标题" value="{{title}}" outlined></klog-input> -->
    <klog-input label="路径" id="pathInput" placeholder="{{randomPath}}" value="{{path}}" outlined=""></klog-input>

    <klog-dropdown-menu label="版权协议" outlined="" vertical-align="top" horizontal-align="left" vertical-offset="62" horizontal-offset="-16">
      <paper-listbox selected="{{license}}" slot="dropdown-content" class="dropdown-content" attr-for-selected="name">
      <template is="dom-repeat" items="{{fullLicenseList}}">
          <paper-item name="{{item.name}}">{{item.abbreviation}}</paper-item>
        </template>
      </paper-listbox>
    </klog-dropdown-menu>

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