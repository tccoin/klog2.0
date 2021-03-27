import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-toast/paper-toast.js';
import '../lib/web-animations-next-lite.min.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/app-route/app-route.js';
import '../ui/klog-icons.js';
import './klog-editor-info-form.js';
import './klog-editor-header.js';
import './klog-editor-textarea.js';
import '../data/klog-data-editor.js';
import '../style/klog-style-scrollbar.js';
import '../ui/klog-backdrop.js';
import '../ui/klog-pages.js';
import '../ui/klog-markdown.js';
import '../ui/klog-upload-zone.js';

class KlogEditor extends PolymerElement {
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

      .klog-editor-back-pages {
        width: calc(100vw - var(--klog-layout-margin-left));
        margin: 0 auto;
        padding: 64px 16px 32px;
        max-height: calc(var(--klog-layout-page-height) - 152px);
        box-sizing: border-box;
        overflow: auto;
        display: flex;
        justify-content: center;
      }

      klog-editor-info-form {
        width: 100vw;
        max-width: 360px;
        height: fit-content;
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

      .klog-editor-back-pages {
        transition: .2s all 0s ease;
      }

      :host([exit]) .klog-editor-back-pages,
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
      @media (min-width: 1025px) {
        :host,
        klog-backdrop {
          --klog-backdrop-default-front-top: 16px;
        }
      }
      @media (min-width: 769px) {
        :host {
          --klog-markdown-media: {
            width: fit-content;
            @apply(--shadow-elevation-8dp);
          }
        }
      }
    </style>
    <app-route route="{{route}}" pattern="/:id" data="{{routeData}}"></app-route>
    <klog-data-editor id="data" userinfo="{{userinfo}}" article-id="{{articleId}}" tokens="{{tokens}}" title="{{title}}" path="{{path}}" license="{{license}}" random-path="{{randomPath}}" attachments="{{attachments}}" previews="{{previews}}" markdown="{{markdown}}" private="{{private}}" immersive="{{immersive}}" fileinfo="{{fileinfo}}" error="{{err}}" current-line="{{currentLine}}" word-count="{{wordCount}}">
    </klog-data-editor>
    <div class="layout">
      <klog-backdrop id="backdrop">
        <klog-editor-header slot="back" id="header" loading="{{loading}}" article-id="{{articleId}}" title="{{title}}" mobile="{{mobile}}" userinfo="[[userinfo]]" back-to="{{backTo}}" selected="{{selected}}">
        </klog-editor-header>
        <iron-pages slot="back" class="klog-editor-back-pages" selected="{{backSelected}}" attr-for-selected="name">
          <klog-editor-info-form id="infoform" name="infoform" loading="{{loading}}" article-id="{{articleId}}" title="{{title}}" path="{{path}}" license="{{license}}" random-path="{{randomPath}}" private="{{private}}" immersive="{{immersive}}"></klog-editor-info-form>
          <klog-upload-zone name="uploadzone" id="uploadzone"></klog-upload-zone>
        </iron-pages>
        <klog-pages slot="front" class="klog-editor-main-pages" selected="{{selected}}" disabled="{{!mobile}}">
          <!-- <klog-pages slot="front" class="klog-editor-main-pages" selected="{{selected}}" disabled="{{!mobile}}"> -->
          <klog-editor-textarea id="textarea" loading="{{loading}}" tokens="{{tokens}}" value="{{markdown}}" preview="{{preview}}" placeholder="摸了摸了" current-line="{{currentLine}}"></klog-editor-textarea>
          <klog-markdown id="markdown" tokens="{{tokens}}" mobile="{{mobile}}" markdown="{{preview}}" theme="[[theme]]" word-count="{{wordCount}}" collection="{{collection}}" preference="{{userinfo.preference.markdown}}" breadcrumbs="">
            <div slot="after" class="info">字数统计: {{wordCount}}</div>
          </klog-markdown>
          <!-- <klog-imarkdown id="imarkdown" tokens="{{tokens}}" markdown="{{preview}}" theme="[[theme]]"
            word-count="{{wordCount}}" collection="{{collection}}" preference="{{userinfo.preference.markdown}}"
            breadcrumbs>
            <div slot="after" class="info">字数统计: {{wordCount}}</div>
          </klog-imarkdown> -->
        </klog-pages>
      </klog-backdrop>
    </div>
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

  load(userLoadPromise) {
    this.updateMenu();
    return userLoadPromise.then(result => {
      if (!result.login) {
        this.dispatchEvent(new CustomEvent('user-login-page-open', {
          bubbles: true,
          composed: true
        }));
        return Promise.reject(new Error('Not Login.'))
      } else {
        this.userinfo = result.userinfo;
      }
    });
  }

  async update(route) {
    this.route = route;
    this.$.textarea.load();
    this.dispatchEvent(new CustomEvent('editor-loaded', { bubbles: true, composed: true }));
    setTimeout(() => {
      this._loadPreset();
    }, 1);
  }

  _updateArticleId() {
    this.articleId = this.routeData.id;
  }

  unload() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.routeData.id = ''
        this.preset = {};
        this.$.textarea.unload();
        resolve();
      }, 150);
    });
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
      element.addEventListener('click', e => { this.menuSelect('format', e.target.name) });
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


  updateMenu() {
    this.dispatchEvent(new CustomEvent('layout-update', {
      bubbles: true,
      composed: true,
      detail: {
        drawerHeading: '插入',
        customMenu: [{
          name: 'edit',
          desktop: true,
          items: [
            { name: 'save', text: '保存', icon: 'publish', raised: true },
            { name: 'upload', text: '上传文件', icon: 'insert_drive_file' },
            { name: 'collection', text: '分类和标签', icon: 'category' },
            { name: 'settings', text: '其它设置', icon: 'settings' },
          ]
        }, {
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
        }]
      }
    }));
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
        this.$.textarea.insert('\n> I thought what I\'d do was, I\'d pretend I was one of those deaf-mutes.', "");
      } else if (item == 'ref') {
        this.$.textarea.insert('', '[^1]');
        this.$.textarea.insertLine('', "\n[^1]: Blablabla...");
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
        this.$.header.publish();
      } else if (item == 'upload') {
        this.$.header.upload();
      } else if (item == 'collection') {
        this.$.header.$.infoformButton.click();
      } else if (item == 'settings') {
        this.$.header.$.infoformButton.click();
      }
    }
  }

  ready() {
    super.ready();
    // init floating toolbar
    this._initFloatingToolbar();
    // preset
    this._defaultPreset = {
      markdown: '@(笔记)[]',
      private: true
    };
    // bond
    this.$.textarea.$.preview = this.$.markdown;
    this.$.markdown.updateScrollTarget(this.$.markdown);
    // this.$.imarkdown.updateScrollTarget(this.$.imarkdown);
    this.$.header.$.uploadzone = this.$.uploadzone;
    this.$.header.$.backdrop = this.$.backdrop;
    this.$.infoform.$.header = this.$.header;
    // activate the leancloud server
    AV.Cloud.run('warmup').then(function(data) {
      console.log(data);
    });
    //event
    this.$.textarea.addEventListener('klog-editor-input', (e) => {
      const selection = e.detail.selection;
      const position = e.detail.caretPosition;
      const lineHeight = e.detail.lineHeight;
      this.updateFloatingToolbar(
        (selection[0] != selection[1]) && !this.mobile, [position.x, position.y - lineHeight * 0.5]
      );
    });
    this.$.textarea.addEventListener('scroll', (e) => {
      this.updateFloatingToolbar(false);
    });
    this.$.textarea.addEventListener('mousedown', (e) => {
      this.updateFloatingToolbar(false);
    });
    this.addEventListener('active-backdrop-front', (e) => {
      let newSelected = e.detail.selected;
      if (this.$.backdrop.active && this.backSelected != newSelected) this.$.backdrop.toggle();
      this.backSelected = newSelected;
      this.$.backdrop.show();
    });
    this.addEventListener('upload-success', (e) => {
      e.stopPropagation();
      this.set("fileinfo", e.detail.fileinfo);
      if (this.$.uploadzone.remainingNumber == 1) {
        this.$.backdrop.toggle();
      }
    });
    this.addEventListener('new', (e) => {
      e.stopPropagation();
      if (this.loading) return
      this.$.data.reset(true);
      //browser
      this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: 'editor/' } }));
    });
    this.addEventListener('reset', (e) => {
      e.stopPropagation();
      if (this.loading) return
      this.$.data.reset();
      //browser
      this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: 'editor/' } }));
    });
    this.addEventListener('save', (e) => {
      e.stopPropagation();
      if (this.loading) return
      this.loading = true;
      this.$.data.quiet = e.detail.quiet || false;
      this.$.data.save().then((updatedArticle) => {
        //data
        this.$.data.articleId = updatedArticle.id;
        //event
        this.dispatchEvent(new CustomEvent('require-update', { bubbles: true, composed: true, detail: { page: 'note' } }));
        //ui
        this.loading = false;
        this._pathChanged();
        this.showToast('已保存', { title: '查看', href: this.backTo });
      }, err => {
        this.set('err', err);
        this.loading = false;
      });
    });
    this.addEventListener('delete', (e) => {
      e.stopPropagation();
      if (this.loading) return
      this.loading = true;
      this.$.data.delete().then((success) => {
        //data
        this.$.data.reset();
        //event
        this.dispatchEvent(new CustomEvent('require-update', { bubbles: true, composed: true, detail: { page: 'note' } }));
        //ui
        this.loading = false;
        this.showToast('已删除', undefined, { duration: 500, noCancelOnOutsideClick: false });
        //route
        this.backTo = /#\/(article|timeline)/.test(this.backTo) ? '#/timeline' : '#/note/all/';
        setTimeout(() => {
          this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: this.backTo } }));
        }, 500);
      }, (err) => {
        this.set('err', err);
        this.loading = false;
      });
    });
    this.addEventListener('keydown', (e) => {
      if (e.ctrlKey == true && e.keyCode == 83) {
        //ctrl s
        e.preventDefault();
        if (!this.loading) {
          this.dispatchEvent(new CustomEvent('save', { bubbles: true, composed: true, detail: { quiet: true } }));
        }
      }
    });
    this.addEventListener('back', (e) => this.back());
    this.addEventListener('dragover', e => this.dragover(e), false);
    this.addEventListener('dragleave', e => this.dragleave(e), false);
    this.addEventListener('drop', e => this.drop(e), false);
    setTimeout(() => {
      //connect the components
      this.$.data.editor = this;
      this.scrollTarget = document.querySelector('html');
    }, 1);
  }

  back() {
    this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: this.backTo || '/' } }));
  }

  _pathChanged(path) {
    if (path) {
      this.backTo = (/#\/(article|timeline)/.test(this.backTo) ? '#/article/' : '#/note/all/') + path;
    }
  }

  dragover() {
    this.dispatchEvent(new CustomEvent('active-backdrop-front', {
      bubbles: true,
      composed: true,
      detail: {
        selected: 'uploadzone'
      }
    }));
  }

  dragleave() {
    this.$.backdrop.hide();
  }

  drop(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  _idChanged(id) {
    this.reset(!Boolean(this.articleId));
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
    this.$.backdrop.hide();
    this.$.data.reset(requestNewPath);
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
      this.showToast('无法保存, 请检查网络连接');
    } else if (err.message == 'empty') {
      this.showToast('球球李写点什么吧！');
    } else if (err.message == 'path illegal') {
      this.showToast('路径里不可以有奇怪的符号 ( ´ー`)');
    } else if (err.message == 'path used') {
      this.showToast('这个路径已经被使用啦，请换一个 ( ´ー`)');
    } else if (err.message == 'path start with hyphen') {
      this.showToast('路径不能以短横线开头 ( ´ー`)');
    } else if (err.message == 'path too short') {
      this.showToast('你设置的路径太短啦 ( ´ー`)');
    } else if (err.code == 403) {
      this.showToast('没有权限, 你只能编辑自己的文章哦');
    } else if (err.code == 404) {
      this.showToast('无法保存, 请备份后新建文章');
    } else if (err.message == '' && !err.code) {} else {
      this.showToast('保存失败, 请备份文章后再试一次');
      console.log(this.err);
    }
    this._errChangedTimeout = setTimeout(() => this.err = null, 3000);
  }

  showToast(text, link) {
    this.dispatchEvent(new CustomEvent('show-toast', {
      bubbles: true,
      composed: true,
      detail: {
        text: text,
        link: link
      }
    }));
  }
}

window.customElements.define(KlogEditor.is, KlogEditor);