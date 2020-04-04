import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-fab/paper-fab.js';
import './klog-style-card.js';

import { removeScrollLock } from '@polymer/iron-overlay-behavior/iron-scroll-manager.js';
class KlogEditorHelper extends PolymerElement {
  static get template() {
    return html`
    <style include="klog-style-card"></style>
    <style>
      :host {
        display: block;
        position: fixed;
        right: 32px;
        bottom: 32px;
        z-index: 100;
      }

      .helper-container {
        width: 300px;
        padding: 16px;
        border-bottom: 3px solid var(--paper-blue-100);
      }

      .helper-container #grammar {
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 8px;
      }

      paper-fab {
        --paper-fab-background: var(--paper-blue-500);
        --paper-fab-keyboard-focus-background: var(--paper-blue-500);
      }
    </style>

    <app-localstorage-document key="helperOpened" data="{{opened}}"></app-localstorage-document>
    <paper-menu-button id="menu">
      <div class="helper-container" slot="dropdown-content">
        <div id="grammar"></div>
        <div id="message"></div>
      </div>
    </paper-menu-button>
    <paper-fab id="trigger" icon="flash_on"></paper-fab>
`;
  }

  static get is() { return 'klog-editor-helper'; }

  static get properties() {
    return {
      markdown: {
        type: String
      },
      opened: {
        type: Boolean,
        observer: 'updateStatus',
        value: true
      },
    }
  }

  ready() {
    super.ready();
    this.initRender();
    this.initContainer();
    this.$.menu.open();
    this.$.trigger.addEventListener('click', () => {
      this.opened = !this.opened;
    });
    this._e = ['text', 'heading', 'at', 'toc', 'code', 'image', 'katex'].map(() => this.randomEmoticon());
  }

  initContainer() {
    this.$.menu.horizontalAlign = 'right';
    this.$.menu.verticalAlign = 'bottom';
    this.$.menu.horizontalOffset = -40;
    this.$.menu.verticalOffset = 8;
    this.$.menu.dynamicAlign = true;
    this.$.menu.ignoreSelect = true;
    this.$.menu.closeOnActivate = false;
    this.$.menu.$.dropdown.noCancelOnOutsideClick = true;
    this.$.menu.$.dropdown.allowOutsideScroll = true;
    removeScrollLock(this.$.menu.$.dropdown);
  }

  initRender() {
    let renderer = new marked.Renderer();
    let block = {};
    let inline = {};
    renderer.heading = (text, depth) => {
      this.grammar = '### 标题';
      this.message = `井号的个数表示标题级别，注意井号和标题中间的空格哦。\n\r全文最高级的标题会作为默认的文章标题，当然你也可以在设置里修改 ${this._e[1]}`;
      return '';
    };
    renderer.image = (href, title, text) => {
      this.grammar = '![图片描述](图片地址)';
      this.message = `图片描述会显示在图片下方 ${this._e[5]}`;
      return '';
    };
    renderer.code = function (code, lang, escaped) {
      this.grammar = '```使用的语言\n\ryour_code_here\n\r```';
      this.message = `Javascript是世界上最好的语言！ ${this._e[4]}`;
      return '';
    }
    block.toc = {
      reg: /^\n*\[toc\] *\n/i,
      lex: function (src, cap) {
        src = src.substring(cap[0].length);
        return { src: src, text: '' }
      },
      parse: () => {
        this.grammar = '[toc]';
        this.message = `在这个地方会根据标题生成全文目录 ${this._e[3]}`;
        return '';
      }
    };

    block.at = {
      reg: /^@\(([\s\S]*?)\)(\[([\s\S]*?)\])?/,
      lex: function (src, cap) {
        src = src.substring(cap[0].length);
        cap = [cap[1] ? marked.escape(cap[1]) : false, cap[3] ? marked.escape(cap[3]) : false];
        return { src: src, text: cap }
      },
      parse: (cap) => {
        this.tags = cap[1] ? cap[1].toLowerCase().split(',') : [];
        this.grammar = '@(文章分类)[文章标签]';
        this.message = `标签用英文逗号隔开，文章分类会影响在时间轴和笔记本中的分类 ${this._e[2]}`;
        return '';
      }
    };

    inline.katex = {
      reg: /^\$([^\$]+?)\$/,
      parse: (src, cap) => {
        this.grammar = '$TeX公式$';
        this.message = `前后一个美元符是行内公式，两个美元符是独立公式 ${this._e[6]}`;
        return '';
      }
    };

    inline.katexblock = {
      reg: /^\$\$([^\$]+?)\$\$/,
      parse: (src, cap) => {
        this.grammar = '$TeX公式$';
        this.message = `前后一个美元符是行内公式，两个美元符是独立公式 ${this._e[6]}`;
        return '';
      }
    };
    let inlineText = /^[\s\S]+?(?=[\\<!\[`*\$~]|https?:\/\/|ftp:\/\/|www\.|[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}\$~-]+@|\b_| *\n|$)/;
    this.options = {
      gfm: false,
      tables: true,
      breaks: true,
      sanitize: true,
      renderer: renderer,
      block: block,
      inline: inline,
      inlineText: inlineText
    };
  }

  load(markdown) {
    this.markdown = markdown;
    this.render(markdown);
  }

  randomEmoticon() {
    const emoticons = ['(｀･ω･)', '(=ﾟωﾟ)=', '| ω・´)', 'ﾟ∀ﾟ)σ', '(・∀・)', '(ゝ∀･)', '(〃∀〃)', '(つд⊂)', '(*´∀`)', '(*ﾟ∇ﾟ)', '(　ﾟ 3ﾟ)', '(￣∇￣)', '(￣3￣)', '(　^ω^)'];
    return emoticons[Math.floor(Math.random() * emoticons.length)];
  }

  render(markdown) {
    this.grammar = '普通文本';
    this.message = this._e[0];
    marked(markdown, this.options, (err, out) => {
      if (err) { throw err }
      this.$.grammar.innerText = this.grammar;
      this.$.message.innerText = this.message;
      this.$.menu.$.dropdown.notifyResize();
    });
  }

  updateStatus(opened) {
    this.$.menu.opened = opened;
  }
}


window.customElements.define(KlogEditorHelper.is, KlogEditorHelper);
