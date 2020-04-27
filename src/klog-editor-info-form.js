import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import './klog-style-form.js';
import './klog-input.js';
import './klog-style.js';

class KlogEditorInfoForm extends PolymerElement {
  static get template() {
    return html`
    <style include="klog-style-form"></style>
    <style>
      :host {
        display: block;
        --primary-background-color: var(--klog-page-background);
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

    <div class="form-item">
      <div class="text-container">
        <span class="title">私有</span><br>
        <span class="description">这篇文章不会被推送至时间轴</span>
      </div>
      <paper-toggle-button checked="{{private}}" disabled="{{immersive}}"></paper-toggle-button>
    </div>

    <div class="form-item">
      <div class="text-container">
        <span class="title">独立页面</span><br>
        <span class="description">分享时关闭 Klog UI</span>
      </div>
      <paper-toggle-button checked="{{immersive}}"></paper-toggle-button>
    </div>

    <div class="form-item" hidden\$="{{!articleId}}">
      <div class="text-container">
        <span class="title">保存但不置顶</span><br>
        <span class="description">防止时间轴扰动</span>
      </div>
      <paper-button on-click="save" disabled="{{_calcSaveButtonDisabled(articleId,loading,private,immersive)}}">
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
      immersive: {
        type: Boolean,
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
    return !this.articleId || this.private || this.loading || this.immersive;
  }

  _calcDeleteButtonDisabled() {
    return !this.articleId || this.loading;
  }
}

window.customElements.define(KlogEditorInfoForm.is, KlogEditorInfoForm);