import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogUiMixin } from '../framework/klog-ui-mixin.js';

import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/app-route/app-route.js';
import '../ui/klog-icons.js';
import './klog-editor-backdrop-pages.js';
import './klog-editor-header.js';
import './klog-editor-textarea.js';
import '../data/klog-data-editor.js';
import '../style/klog-style-scrollbar.js';
import '../ui/klog-backdrop.js';
import '../ui/klog-pages.js';
import '../ui/klog-markdown.js';
import '../ui/klog-upload-zone.js';

class KlogEditor extends KlogUiMixin(PolymerElement) {

    static get template() {
        return html `
    <style include="klog-style-scrollbar"></style>
    <style>
      :host {
        display: block;
        overflow: hidden;
        padding: 0;
        padding-left: var(--klog-layout-margin-left);
        background-color: var(--klog-page-background);
        --klog-editor-padding: 24px;
        --klog-markdown-padding: var(--klog-editor-padding);
        --textarea-padding: var(--klog-editor-padding);
      }

      .layout {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      klog-backdrop {
        width: calc(100vw - var(--klog-layout-margin-left));
        display: flex;
        justify-content: center;
        align-content: center;

        --klog-backdrop-back: {
          --accent-color: var(--secondary-background-color);
        }
      }

      klog-backdrop klog-pages {
        --klog-pages-width: calc(100vw - var(--klog-layout-margin-left));
        background-color: var(--primary-background-color);
      }

      klog-editor-backdrop-pages {
        width: calc(100vw - var(--klog-layout-margin-left));
        max-height: calc(var(--klog-layout-page-height) - 152px - var(--safe-area-inset-top));
        margin: 0 auto;
        padding: 64px 16px 16px;
        scroll-behavior: smooth;
      }

      klog-upload-zone {
        width: 100%;
        height: fit-content;
      }

      .klog-editor-main-pages {
        width: 100%;
        max-width: 1280px;
        height: calc(var(--klog-layout-page-height) - var(--klog-backdrop-default-front-top));
        margin: auto;
        border-radius: 12px 12px 0 0;
        overflow: hidden;
        @apply --shadow-elevation-4dp;
      }

      klog-editor-textarea {
        width: calc(50vw - var(--klog-layout-margin-left) / 2);
        border-right: 1px solid var(--divider-color);
      }

      klog-markdown {
        width: calc(50vw - var(--klog-layout-margin-left) / 2);
        background: var(--primary-background-color);
      }

      klog-markdown .info {
        margin-top:16px;
        font-size: 12px;
        cursor: default;
        user-select: none;
        -webkit-user-select: none;
        color: var(--secondary-text-color);
      }

      /* floating toolbar */
      .floating-toolbar {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 100;
        border-radius: 4px;
        background: var(--primary-background-color);
        color: var(--primary-text-color);
        @apply --shadow-elevation-4dp;
      }

      @media (max-width: 767px) {
        :host {
          --klog-editor-padding: 16px;
        }
      }

      /*animation*/

      .klog-editor-main-pages {
        transition: opacity .2s ease, transform .1s ease;
      }

      klog-editor-backdrop-pages {
        transition: .2s all 0s ease;
      }

      :host([exit]) klog-editor-backdrop-pages,
      :host([exit]) .klog-editor-main-pages {
        opacity: 0;
        transform: translateY(5vh);
      }

      klog-editor-header {
        opacity: 1;
        transition: opacity .15s ease-out;
      }

      :host([exit]) klog-editor-header {
        opacity: 0;
      }

      /*media*/
      :host,
      klog-backdrop {
        --klog-backdrop-default-front-top: 64px;
      }
      @media (min-width: 1024px) {
        :host,
        klog-backdrop {
          --klog-backdrop-default-front-top: 16px;
        }
      }
      @media (min-width: 768px) {
        :host {
          --klog-markdown-media: {
            width: fit-content;
            @apply(--shadow-elevation-8dp);
          }
        }
      }
    </style>

    <!-- Data -->
    <app-route route="{{route}}" pattern="/:id" data="{{routeData}}"></app-route>
    <klog-data-editor id="data" userinfo="{{userinfo}}" article-id="{{articleId}}" tokens="{{tokens}}" title="{{title}}" path="{{path}}" license="{{license}}" random-path="{{randomPath}}" attachments="{{attachments}}" previews="{{previews}}" markdown="{{markdown}}" private="{{private}}" fileinfo="{{fileinfo}}" error="{{err}}" current-line="{{currentLine}}" word-count="{{wordCount}}">
    </klog-data-editor>

    <!-- Backdrop -->
    <klog-backdrop id="backdrop">

      <!-- header -->
      <klog-editor-header slot="back" id="header" loading="{{loading}}" article-id="{{articleId}}" title="{{title}}" mobile="{{mobile}}" userinfo="[[userinfo]]" back-to="{{backTo}}" selected="{{selected}}">
      </klog-editor-header>

      <!-- back -->
      <klog-editor-backdrop-pages id="backdropPages" slot="back" class="klog-editor-back-pages" selected="{{backdropSelected}}" loading="{{loading}}" article-id="{{articleId}}" title="{{title}}" path="{{path}}" collection="{{collection}}" tags="{{tags}}" markdown="{{markdown}}" license="{{license}}" random-path="{{randomPath}}" private="{{private}}"></klog-editor-backdrop-pages>

      <!-- front -->
      <klog-pages slot="front" class="klog-editor-main-pages" selected="{{selected}}" disabled="{{!mobile}}">
        <!-- <klog-pages slot="front" class="klog-editor-main-pages" selected="{{selected}}" disabled="{{!mobile}}"> -->
        <klog-editor-textarea id="textarea" loading="{{loading}}" tokens="{{tokens}}" value="{{markdown}}" preview="{{preview}}" placeholder="摸了摸了" current-line="{{currentLine}}"></klog-editor-textarea>
        <klog-markdown id="markdown" tokens="{{tokens}}" mobile="{{mobile}}" markdown="{{preview}}" theme="[[theme]]" word-count="{{wordCount}}" collection="{{collection}}" tags="{{tags}}" preference="{{userinfo.preference.markdown}}" breadcrumbs="">
          <div slot="after" class="info">字数统计: {{wordCount}}</div>
        </klog-markdown>
        <!-- <klog-imarkdown id="imarkdown" tokens="{{tokens}}" markdown="{{preview}}" theme="[[theme]]"
          word-count="{{wordCount}}" collection="{{collection}}" preference="{{userinfo.preference.markdown}}"
          breadcrumbs>
          <div slot="after" class="info">字数统计: {{wordCount}}</div>
        </klog-imarkdown> -->
      </klog-pages>

    </klog-backdrop>

    <!-- Drawer -->
    <klog-drawer id="insertDrawer" heading="{{insertDrawer.heading}}">
      <klog-menu page="{{page}}" items="{{insertDrawer.menu}}"></klog-menu>
    </klog-drawer>

    <!-- Floating Toolbar -->
    <div class="floating-toolbar"></div>
`;
    }

    static get is() { return 'klog-editor'; }

    static get properties() {
        return {
            articleId: {
                type: String,
                observer: '_idChanged'
            },
            selected: {
                type: Number,
            },
            loading: {
                type: Boolean,
                value: false
            },
            tokens: {
                type: Array
            },
            err: {
                observer: '_errChanged'
            },
            routeData: {
                type: Object,
                observer: '_updateArticleId'
            },
            mobile: {
                type: Boolean,
                reflectToAttribute: true
            },
            backTo: {
                type: String,
                value: ''
            },
            preset: {
                type: Object,
                value: {}
            },
            license: {
                type: String,
                value: 'default'
            },
            path: {
                type: String,
                observer: '_pathChanged'
            },
            layout: {
                type: Object,
                value: {
                    documentTitle: '写作 - Klog',
                    drawer: 'auto',
                    mainMenu: false,
                    sidebar: 'auto',
                    scrollToTop: false,
                    header: {
                        fixed: true,
                        short: false,
                        shadow: 'off',
                    },
                    collections: [],
                    styles: {
                        '--klog-header-background': 'var(--klog-page-background)',
                        '--klog-header-height': '0px',
                    },
                    toolbar: html ``
                }
            },
        };
    }

    ready() {
        super.ready();
        // layout
        this.editMenu = {
            name: 'edit',
            desktop: true,
            items: [
                { name: 'save', text: '保存', icon: 'publish', raised: true },
                { name: 'upload', text: '上传文件', icon: 'insert_drive_file' },
                { name: 'category', text: '分类和标签', icon: 'category', desktop: true },
                { name: 'settings', text: '其它设置', icon: 'settings' },
            ]
        };
        this.actionMenu = {
            name: 'action',
            items: [
                { subtitle: true, text: '插入', desktop: true },
                { name: 'table', text: '表格', icon: 'border_all' },
                { name: 'code', text: '代码', icon: 'code' },
                { name: 'formula', text: '公式', icon: 'functions' },
                { name: 'toc', text: '目录', icon: 'menu_book' },
                { name: 'quote', text: '引用', icon: 'format_quote' },
                { name: 'ref', text: '来源', icon: 'comment' },
                { name: 'heading-1', text: '一级标题', icon: 'title' },
                { name: 'heading-2', text: '二级标题', icon: 'title' },
                { name: 'heading-3', text: '三级标题', icon: 'title' },
                { name: 'ul', text: '无序列表', icon: 'format_list_bulleted' },
                { name: 'ol', text: '有序列表', icon: 'format_list_numbered' },
            ]
        };
        // init floating toolbar
        this._initFloatingToolbar();
        // preset
        this._defaultPreset = {
            markdown: '@(笔记)[]',
            private: true
        };
        // bind
        this.$.textarea.$.preview = this.$.markdown;
        this.$.markdown.updateScrollTarget(this.$.markdown);
        setTimeout(() => {
            //connect the components
            this.$.data.editor = this;
            this.scrollTarget = document.querySelector('html');
        }, 1);
        // activate the leancloud server
        AV.Cloud.run('warmup').then(function(data) {
            console.log(data);
        });
        //event
        this.addEventListener('open-insert-drawer', () => this.openDrawer('插入', [this.actionMenu]));
        this.$.textarea.addEventListener('editor-textarea-input', (e) => this._textareaInputHandle(e.detail));
        this.$.textarea.addEventListener('scroll', (e) => this.updateFloatingToolbar(false));
        this.$.textarea.addEventListener('mousedown', (e) => this.updateFloatingToolbar(false));
        this.addEventListener('editor-open-backdrop', (e) => this.openBackdrop(e.detail.selected));
        this.addEventListener('editor-close-backdrop', (e) => this.closeBackdrop());
        this.addEventListener('editor-toggle-backdrop', (e) => this.toggleBackdrop(e.detail.selected));
        this.addEventListener('editor-upload', (e) => this.upload());
        this.addEventListener('editor-exception', (e) => this._editorExceptionHandle(e.detail.exceptionType));
        this.addEventListener('upload-success', (e) => {
            e.stopPropagation();
            this._uploadSuccessHandle(e.detail.fileinfo);
        });
        this.addEventListener('editor-save', (e) => this.save(e.detail.quiet));
        this.addEventListener('editor-delete', () => this.delete());
        this.addEventListener('editor-back', (e) => this.back());
        this.addEventListener('keydown', (e) => this._keydownHandle(e));
        this.addEventListener('dragover', e => this.openBackdrop('uploadzone'), false);
        this.addEventListener('dragleave', e => this.$.backdrop.close(), false);
        this.addEventListener('drop', e => {
            e.stopPropagation();
            e.preventDefault();
        }, false);
    }

    load() {
        this.dispatchEvent(new CustomEvent('layout-update', {
            bubbles: true,
            composed: true,
            detail: {
                customMenu: [this.editMenu, this.actionMenu]
            }
        }));
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
        }
        // data
        this.route = route;
        this.$.textarea.load();
        this.dispatchEvent(new CustomEvent('editor-loaded', { bubbles: true, composed: true }));
        setTimeout(() => {
            this._loadPreset();
        }, 1);
    }

    unload() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.routeData.id = '';
                this.preset = {};
                this.$.textarea.unload();
                resolve();
            }, 150);
        });
    }

    _editorExceptionHandle(exceptionType) {
        if (exceptionType == 'unsupported-video') {
            this.openToast('目前仅支持直接播放mp4格式视频，上传的文件将作为链接显示', null, { duration: 4000 });
        }
    }

    _updateArticleId() {
        this.articleId = this.routeData.id;
    }

    _initFloatingToolbar() {
        const container = this.shadowRoot.querySelector('.floating-toolbar');
        container.style.setProperty('visibility', 'hidden');
        const buttons = [
            { name: 'strong', text: '加粗', icon: 'format_bold' },
            { name: 'highlight', text: '高亮', icon: 'highlight' },
            { name: 'strikethrough', text: '删除线', icon: 'format_strikethrough' },
            { name: 'inlinecode', text: '术语', icon: 'code' },
            { name: 'inlineformula', text: '行内公式', icon: 'functions' }
        ];
        for (let button of buttons) {
            let element = document.createElement('paper-icon-button');
            element.icon = button.icon;
            element.label = button.text;
            element.name = button.name;
            element.addEventListener('click', e => { this.menuSelect('format', e.target.name); });
            container.append(element);
        }
    }

    updateFloatingToolbar(visibility, position) {
        const container = this.shadowRoot.querySelector('.floating-toolbar');
        container.style.setProperty('visibility', visibility ? '' : 'hidden');
        if (position) {
            container.style.setProperty('left', position[0] + 'px');
            container.style.setProperty('top', position[1] - container.offsetHeight + 'px');
        }
    }

    menuSelect(category, item) {
        if (category == 'action') {
            if (item == 'table') {
                this.$.textarea.insert('\n|  header', `  |  header  |
|  :----:  | : ----:  |
| cell1  | cell2 |
| cell3  | cell4 |`);
            } else if (item == 'code') {
                this.$.textarea.insert('\n```c\nhelloworld();', '\n```');
            } else if (item == 'formula') {
                this.$.textarea.insert('\n$$E=mc^2', '$$');
            } else if (item == 'toc') {
                this.$.textarea.insert('\n[toc]', '');
            } else if (item == 'quote') {
                this.$.textarea.insert('\n> I thought what I\'d do was, I\'d pretend I was one of those deaf-mutes.', '');
            } else if (item == 'ref') {
                this.$.textarea.insert('', '[^1]');
                this.$.textarea.insertLine('', '\n[^1]: Blablabla...');
            } else if (item == 'ul') {
                this.$.textarea.insert('\n- item1\n- item2\n- item3');
            } else if (item == 'ol') {
                this.$.textarea.insert('\n1. item1\n2. item2\n3. item3');
            } else if (item.indexOf('heading-') > -1) {
                this.$.textarea.insert(`\n${'#'.repeat(item.replace('heading-', ''))} 标题`);
            }
        } else if (category == 'format') {
            if (item == 'strong') {
                this.$.textarea.autoPack('**');
            } else if (item == 'highlight') {
                this.$.textarea.autoPack('*');
            } else if (item == 'strikethrough') {
                this.$.textarea.autoPack('~~');
            } else if (item == 'inlinecode') {
                this.$.textarea.autoPack('`');
            } else if (item == 'inlineformula') {
                this.$.textarea.autoPack('$');
            }
        } else if (category == 'edit') {
            if (item == 'save') {
                this.save(false);
            } else if (item == 'upload') {
                this.upload();
            } else if (item == 'settings') {
                this.toggleBackdrop('settings');
            } else if (item == 'category') {
                this.toggleBackdrop('category');
            }
        } else if (category == 'license') {
            this.license = item;
        }
    }

    back() {
        this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: this.backTo || '/' } }));
    }

    _pathChanged(path) {
        if (path) {
            this.backTo = (/#\/(article|timeline)/.test(this.backTo) ? '#/article/' : '#/note/all/') + path;
        }
    }

    upload() {
        if (this.mobile) {
            this.openBackdrop('uploadzone');
        } else {
            this.$.backdropPages.$.uploadzone.$.input.click();
        }
    }

    toggleBackdrop(selected) {
        if (this.$.backdrop.opened && this.backdropSelected == selected) {
            this.closeBackdrop();
        } else {
            this.openBackdrop(selected);
        }
    }

    async openBackdrop(selected) {
        this.$.header.$.pages.selected = 1;
        let newSelected = selected;
        if (this.$.backdrop.opened && this.backdropSelected != newSelected) await this.$.backdrop.close();
        this.backdropSelected = newSelected;
        this.$.backdrop.open();
    }

    closeBackdrop() {
        this.$.header.$.pages.selected = 0;
        this.$.backdropPages.scrollTop = 0;
        this.$.backdrop.close();
    }

    _keydownHandle(e) {
        if (e.ctrlKey == true && e.keyCode == 83) {
            //ctrl s
            e.preventDefault();
            if (!this.loading) {
                this.dispatchEvent(new CustomEvent('editor-save', { bubbles: true, composed: true, detail: { quiet: true } }));
            }
        }
    }

    _uploadSuccessHandle(fileinfo) {
        this.set('fileinfo', fileinfo);
        if (this.$.backdropPages.$.uploadzone.remainingNumber == 1 && !this.mobile) {
            this.closeBackdrop();
        }
    }

    _textareaInputHandle(info) {
        const selection = info.selection;
        const position = info.caretPosition;
        const lineHeight = info.lineHeight;
        this.updateFloatingToolbar(
            (selection[0] != selection[1]) && !this.mobile, [position.x, position.y - lineHeight * 0.5]
        );
    }

    _idChanged(id) {
        this.reset(!this.articleId);
        if (id) {
            this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: 'editor/' + this.articleId } }));
            this.loading = true;
            this.$.data.load(id)
                .then(() => {
                    this.loading = false;
                    this.$.textarea.reset();
                });
        }
    }

    reset(requestNewPath) {
        this.loading = false;
        this.$.backdrop.close();
        this.$.data.reset(requestNewPath);
    }

    save(quiet = false) {
        if (this.loading) return;
        this.loading = true;
        this.$.data.quiet = quiet;
        this.$.data.save().then((updatedArticle) => {
            //data
            this.$.data.articleId = updatedArticle.id;
            //event
            this.dispatchEvent(new CustomEvent('require-update', { bubbles: true, composed: true, detail: { page: 'note' } }));
            //ui
            this.loading = false;
            this._pathChanged();
            this.openToast('已保存', { title: '查看', href: this.backTo });
        }, err => {
            this.set('err', err);
            this.loading = false;
        });
    }

    delete() {
        if (this.loading) return;
        this.loading = true;
        this.$.data.delete().then((success) => {
            //data
            this.$.data.reset();
            //event
            this.dispatchEvent(new CustomEvent('require-update', { bubbles: true, composed: true, detail: { page: 'note' } }));
            //ui
            this.loading = false;
            this.openToast('已删除', undefined, { duration: 500, noCancelOnOutsideClick: false });
            //route
            this.backTo = /#\/(article|timeline)/.test(this.backTo) ? '#/timeline' : '#/note/all/';
            setTimeout(() => {
                this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: this.backTo } }));
            }, 500);
        }, (err) => {
            this.set('err', err);
            this.loading = false;
        });
    }

    _loadPreset() {
        if (this.articleId) return;
        let preset = Object.assign({}, this._defaultPreset, this.preset);
        for (let key of Object.keys(preset)) {
            this[key] = preset[key];
        }
    }

    _errChanged() {
        if (this._errChangedTimeout) {
            clearTimeout(this._errChangedTimeout);
        }
        const err = this.err;
        if (!err) return;
        if (err.code == -1 && err.message.indexOf('offline') > -1) {
            this.openToast('无法保存, 请检查网络连接');
        } else if (err.message == 'empty') {
            this.openToast('球球李写点什么吧！');
        } else if (err.message == 'path illegal') {
            this.openToast('路径里不可以有奇怪的符号 ( ´ー`)');
        } else if (err.message == 'path used') {
            this.openToast('这个路径已经被使用啦，请换一个 ( ´ー`)');
        } else if (err.message == 'path start with hyphen') {
            this.openToast('路径不能以短横线开头 ( ´ー`)');
        } else if (err.message == 'path too short') {
            this.openToast('你设置的路径太短啦 ( ´ー`)');
        } else if (err.code == 403) {
            this.openToast('没有权限, 你只能编辑自己的文章哦');
        } else if (err.code == 404) {
            this.openToast('无法保存, 请备份后新建文章');
        } else if (err.message == '' && !err.code) {} else {
            this.openToast('保存失败, 请备份文章后再试一次');
            console.log(this.err);
        }
        this._errChangedTimeout = setTimeout(() => this.err = null, 3000);
    }
}

window.customElements.define(KlogEditor.is, KlogEditor);