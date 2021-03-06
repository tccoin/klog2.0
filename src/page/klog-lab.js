import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogUiMixin } from '../framework/klog-ui-mixin.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import { KlogDataMessageMixin } from '../data/klog-data-message-mixin.js';
import '../style/klog-style-layout.js';
import '../style/klog-style-card.js';
import '../ui/klog-markdown.js';
import '../data/klog-data-editor.js';
import '../ui/klog-input.js';
import '../data/klog-data-list.js';
import '../ui/klog-image.js';
import '../ui/klog-icons.js';

class KlogLab extends KlogUiMixin(KlogDataMessageMixin(PolymerElement)) {
  static get template() {
    return html `
    <style include="klog-style-layout"></style>
    <style include="klog-style-card"></style>
    <style>
      :host {
        display: block;
        background-color: var(--klog-page-background);
      }

      .card-container {
        margin: 32px;
      }

      .lab-card {
        max-height: 500px;
        max-width: 720px;
        margin: 0 auto;
        padding: 16px;
        overflow: auto;
      }

      textarea {
        height: calc(60vh - 72px);
        padding: 8px;
        width: 100%;
        box-sizing: border-box;
      }
    </style>
    <app-localstorage-document key="masterKey" data="{{masterKey}}"></app-localstorage-document>
    <app-localstorage-document key="articleId" data="{{articleId}}"></app-localstorage-document>
    <!-- <klog-data-editor id="data" markdown="{{markdown}}" quiet data="{{article}}"></klog-data-editor> -->
    <klog-data-list id="list" last-response="{{list}}" limit="1000"></klog-data-list>
    <div class="card-container">
      <div class="klog-card lab-card list">
        <klog-input outlined value="{{masterKey}}" label="Master Key"></klog-input>
        <klog-input outlined value="{{articleId}}" label="Article Id"></klog-input>
        <klog-input outlined value="{{article.title}}" label="Title"></klog-input>
        </div>
        <div class="klog-card lab-card list">
        <paper-button on-click="login">登录</paper-button>
        <paper-button on-click="loadList">加载列表</paper-button>
        <paper-button on-click="loadArticle">打开文章</paper-button>
        <paper-button on-click="saveArticle">保存文章</paper-button>
        <br>
        <paper-button on-click="loadNext">打开下一篇文章</paper-button>
        <paper-button on-click="saveNext">更新下一篇文章</paper-button>
        <paper-button on-click="saveList">更新所有文章</paper-button>
        <paper-button on-click="updateImageInfo">更新所有图片信息</paper-button>
      </div>
      <div class="klog-card lab-card list">
        <paper-progress value="[[listProgress]]"></paper-progress>
        等待处理：{{list.length}}
        <paper-toggle-button checked="{{stop}}">急停</paper-toggle-button>
      </div>
      <div class="klog-card lab-card list">
        {{article.updatedAt}}:{{listProgressDelta}}
        <klog-markdown id="markdown" markdown="{{markdown}}"></klog-markdown>
      </div>
      <div class="klog-card lab-card list">
        <textarea value="{{markdown::input}}"></textarea>
      </div>
    </div>
    <div class="card-container">
      <div class="klog-card lab-card list">
        <klog-input outlined value="{{globalMessage}}" label="全站通知"></klog-input>
        <paper-button on-click="sendGlobalMessage">发送</paper-button>
      </div>
    </div>
`;
  }

  static get is() { return 'klog-lab'; }

  static get properties() {
    return {
      layout: {
        type: Object,
        value: {
          documentTitle: '实验室 - Klog',
          drawer: 'off',
          mainMenu: false,
          sidebar: 'off',
          styles: {
            '--klog-header-background': 'translate',
            '--klog-header-text-color': 'var(--primary-text-color)',
          },
          header: {
            fixed: false,
            short: false,
            shadow: 'off'
          },
          toolbar: html `
      <app-toolbar>
        <paper-icon-button class="navigation" icon="arrow_back" on-click="back"></paper-icon-button>
      </app-toolbar>`
        }
      }
    };
  }

  ready() {
    super.ready();
    this.addEventListener('app-load', (e) => {
      e.stopPropagation();
    });
    this.listProgress = 0;
    AV._config.useMasterKey = true;
    this.$.image = document.createElement('klog-image');
    console.log(this);
    this._editor = this._createEditor();
  }

  login() {
    window.process = { env: { CLIENT_PLATFORM: 'hahaha' } };
    AV.masterKey = this.masterKey;
  }

  async loadArticle() {
    this._editor.articleId = this.articleId;
    await this._editor.load();
    this.article = this._editor.data;
    this.markdown = this._editor.markdown;
  }

  saveArticle() {
    return this._editor.save();
  }

  load(userLoadPromise) {
    return userLoadPromise.then(result => {
      if (!result.login) {
        this.dispatchEvent(new CustomEvent('user-login-page-open', {
          bubbles: true,
          composed: true
        }));
      }
    });
  }

  back() {
    this.parentElement.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: 'timeline' } }));
  }

  loadList() {
    this.$.list.select = ['title', 'text', 'path', 'collection', 'keywords', 'attachments'];
    this.$.list.load().then(() => {
      this.listProgressDelta = 100 / this.list.length;
      this.listProgress = 0;
      console.log(this.listProgressDelta, this.list.length);
    });
  }

  loadNext() {
    if (this.list.length > 0) {
      this.articleId = this.pop('list').objectId;
      this.loadArticle();
    }
  }

  saveNext() {
    if (this.list.length > 0) {
      this.articleId = this.pop('list').objectId;
      this.loadArticle().then(() => this.saveArticle());
    }
  }

  _createEditor() {
    const editor = document.createElement('klog-data-editor');
    editor.quiet = true;
    return editor;
  }

  updateImageInfo() {
    for (let i = 0; i < 4; i++) {
      this._updateImageInfo(i);
    }
  }

  async _updateImageInfo(i) {
    const editor = this._createEditor();
    while (this.list && this.list.length > 0) {
      if (this.stop) return;
      let article = this.pop('list');
      if (article.attachments.length == 0) continue;
      for (let image of article.attachments.filter(x => x.image)) {
        let req = new XMLHttpRequest();
        await this.$.image.loadPlaceholder(this.$.image.encode(image.url), true);
      }
      editor.articleId = article.objectId;
      await editor.load();
      this.article = editor.data;
      this.markdown = editor.markdown;
      await editor.save();
    }
  }

  saveList() {
    const editor = this._createEditor();
    if (this.stop) return;
    if (this.list.length > 0) {
      this.articleId = this.pop('list').objectId;
      // this.loadArticle().then(() => true).then(() => this.saveList());
      this.loadArticle().then(() => this.saveArticle()).then(() => this.saveList());
    }
    this.listProgress += this.listProgressDelta;
  }

  async sendGlobalMessage() {
    await this.createMessage('text', '5ea323e42f040b00087e42ae', ['channel-default'], { 'text': this.globalMessage });
    this.openToast('发送成功');
  }

}

window.customElements.define(KlogLab.is, KlogLab);