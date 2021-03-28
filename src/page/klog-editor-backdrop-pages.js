import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogUiMixin } from '../framework/klog-ui-mixin.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '../ui/klog-input.js';
import '../style/klog-style-form.js';
import '../style/klog-style-media.js';
import { KlogDataLicenseMixin } from '../data/klog-data-license-mixin.js';

class KlogEditorBackdropPages extends KlogUiMixin(KlogDataLicenseMixin(PolymerElement)) {
  static get template() {
    return html `
    <style include="klog-style-form"></style>
    <style include="klog-style-media"></style>
    <style>
      :host {
        display: flex;
        box-sizing: border-box;
        overflow: auto;
        justify-content: center;
        --klog-input-background-color: var(--klog-page-background);
      }

      iron-pages {
        max-width: 360px;
        width: 100%;
        height: fit-content;
      }

      #licenseInput {
        cursor: pointer;
      }

      #deleteButton {
        color: var(--paper-red-500);
      }

      #deleteButton:hover {
        color: var(--paper-red-700);
      }
    </style>

    
    <iron-pages id="pages" slot="back" class="klog-editor-back-pages" selected="{{selected}}" attr-for-selected="name">

        <!-- Upload -->
        <klog-upload-zone name="uploadzone" id="uploadzone"></klog-upload-zone>

        <!-- Collection -->
        <div name="category" class="form">
            <klog-input label="分类" value="{{collection}}" on-change="_updateCategory" outlined></klog-input>
            <klog-input label="标签 (英文逗号分隔)" value="{{tagsString}}" on-change="_updateCategory" outlined></klog-input>
        </div>

        <!-- Settings -->
        <div name="settings" class="form">
            <klog-input label="路径" id="pathInput" placeholder="{{randomPath}}" value="{{path}}" outlined></klog-input>
            <klog-input label="版权协议" id="licenseInput"  value="{{licenseAbbreviation}}" on-click="openLicenseDrawer" outlined></klog-input>

            <div class="form-item" hidden-on-desktop>
            <div class="text-container">
                <span class="title">分类与标签</span>
            </div>
            <paper-button for="category" on-click="openBackdrop">
                <iron-icon icon="category"></iron-icon>
            </paper-button>
            </div>

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

      </iron-pages>
    </div>
`;
  }

  static get is() { return 'klog-editor-backdrop-pages'; }

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
      markdown: {
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
      collection: {
        type: String
      },
      tags: {
        type: Array,
        observer: '_updateTagsString'
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
    this.dispatchEvent(new CustomEvent('editor-save', { bubbles: true, composed: true, detail: { quiet: true } }));
  }

  openLicenseDrawer(e) {
    e.preventDefault();
    this.openDrawer('版权协议', [{ name: 'license', items: this.getLicenseMenu(this.fullLicenseList) }]);
  }

  _updateLicenseAbbreviation(license) {
    this.licenseAbbreviation = this.fullLicenseList.find(x => x['name'] == license)['abbreviation'];
  }

  openBackdrop(e) {
    let selected = (e.target.tagName == 'IRON-ICON' ? e.target.parentNode : e.target).getAttribute('for');
    this.dispatchEvent(new CustomEvent('editor-open-backdrop', { bubbles: true, composed: true, detail: { selected } }));
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
    this.dispatchEvent(new CustomEvent('editor-delete', { bubbles: true, composed: true }));
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

  _updateTagsString() {
    this.tagsString = this.tags.join(',');
  }

  _updateCategory() {
    let categoryReg = /(^|\n)@\((\S*?)\)(\[(\S*?)\])?/g;
    let categoryMarkdown = `@(${this.collection})[${this.tagsString}]`;
    if (categoryReg.test(this.markdown)) {
      this.markdown = this.markdown.replace(categoryReg, '');
    }
    this.markdown = categoryMarkdown + this.markdown;
    this.markdown.replace();
  }
}

window.customElements.define(KlogEditorBackdropPages.is, KlogEditorBackdropPages);