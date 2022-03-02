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
        box-sizing: border-box;
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
        <paper-button on-click="updateAllImages">更新所有图片</paper-button>
        <paper-toggle-button checked="{{quiet}}">不更新timeline</paper-toggle-button>
      </div>
      <div class="klog-card lab-card list">
        <paper-progress value="[[listProgress]]"></paper-progress>
        等待处理：{{list.length}}
        <paper-toggle-button checked="{{stop}}">急停</paper-toggle-button>
      </div>
      <div class="klog-card lab-card list">
        {{article.updatedAt}}:{{listProgressDelta}}
        <klog-markdown id="markdown" markdown="{{markdown}}" no-media></klog-markdown>
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
            quiet: {
                type: Boolean,
                value: true,
                observer: '_quiteChanged'
            },
            layout: {
                type: Object,
                value: {
                    documentTitle: '实验室 - Klog',
                    drawer: 'off',
                    mainMenu: true,
                    sidebar: 'on',
                    styles: {
                        '--klog-header-background': 'translate',
                        '--klog-header-text-color': 'var(--on-surface)',
                    },
                    header: {
                        fixed: false,
                        short: false,
                        shadow: 'off'
                    },
                    toolbar: html `
      <app-toolbar>
        <paper-icon-button icon="menu" name="drawer-button"></paper-icon-button>
        <div class="title">
            <div main-title><iron-icon icon="klog"></iron-icon></div>
            <div class="divider"></div>
            <div page-title>控制台</div>
        </div>
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

    async loadArticle(render = true) {
        this._editor.articleId = this.articleId;
        await this._editor.load();
        this.article = this._editor.data;
        this.markdown = this._editor.markdown;
    }

    saveArticle() {
        let labels = [];
        if (this.quiet) {
            labels = ['keep-article-time', 'keep-timeline-time'];
        }
        // add test here
        // labels.push('force-time-reset');
        console.log('saving with label', labels);
        return this._editor.save(labels);
    }

    async update(userLoadPromise, route) {
        // user
        const result = await userLoadPromise;
        if (!result.login) {
            console.log(result);
            this.parentElement.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: 'login' } }));
        }
    }

    async loadList() {
        this.$.list.select = ['title', 'text', 'path', 'collection', 'keywords', 'attachments'];
        await this.$.list.load();
        this.listProgressDelta = 100 / this.list.length;
        this.listProgress = 0;
        console.log(this.listProgressDelta, this.list.length);
        this.list.reverse();
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

    async updateAllImages() {
        if (this.stop) return;
        if (this.list.length > 0) {
            this.articleId = this.pop('list').objectId;
            await this.loadArticle(false);
            for (let image of this.article.attachments.filter(x=>x.image)) {
                if (this.$.image.isKlogStorage(image.url)) {
                    let retry = 0;
                    while (retry < 3) {
                        try {
                            await fetch(image.url + '?Magic/6');
                            break;
                        } catch (error) {
                            retry += 1;
                            console.log(error);
                            await new Promise(resolve=>setTimeout(resolve, 500));
                        }
                    }
                }
            }
            this.listProgress += this.listProgressDelta;
            this.updateAllImages();
        }
    }

    _createEditor() {
        const editor = document.createElement('klog-data-editor');
        editor.headless = true;
        return editor;
    }

    async saveList() {
        if (this.stop) return;
        if (this.list.length > 0) {
            this.articleId = this.pop('list').objectId;
            await this.loadArticle(false);
            await this.saveArticle();
            this.listProgress += this.listProgressDelta;
            this.saveList();
        }
    }

    async sendGlobalMessage() {
        await this.createMessage('text', '5ea323e42f040b00087e42ae', ['channel-default'], { 'text': this.globalMessage });
        this.openToast('发送成功');
    }

}

window.customElements.define(KlogLab.is, KlogLab);