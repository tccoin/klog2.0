import { repeat } from 'lit-html/directives/repeat';
import { LitElement, html } from 'lit-element';
import '../node_modules/marked/lib/marked.js';

export default class MoonEditor extends LitElement {

  static get properties() {
    return {
      blocks: {
        type: Array,
        noAccessor: true
      },
      markdown: {
        type: String,
        noAccessor: true
      }
    };
  }

  set blocks(newVal) {
    this._oldBlocks = JSON.parse(JSON.stringify(this._blocks));
    this._blocks = newVal;
    this.requestUpdate('blocks', this._oldBlocks);
  }

  get blocks() {
    return this._blocks;
  }

  get markdown() {
    return this._markdown;
  }

  set markdown(newVal) {
    this._markdown = newVal;
    this.lexer(newVal);
  }

  constructor() {
    super();
    //     this._blocks = [
    //       {
    //         id: 0,
    //         type: 'heading1',
    //         text: '# Testing!'
    //       },
    //       {
    //         id: 1,
    //         type: 'paragraph',
    //         text: 'Cool'
    //       },
    //       {
    //         id: 2,
    //         type: 'blockquote',
    //         text: `> 我的心被挤在狭隘的缝隙里，
    // 远离我，我的心被置于一个偏远的岛上。
    // 白色的鸟儿飞来飞去带来我的心活着的消息。
    // 我知道它靠什么活着——
    // 靠煤块和沙子在锐利的石头上`
    //       },
    //     ];
    this._blocks = [];
  }

  /* Life Cycle */

  render() {
    let blocks = this.blocks;
    return html`
      <link rel="stylesheet" href="../bower_components/Han/dist/han.min.css">
      <style>
        :host { display: block; }
        :host([hidden]) { display: none; }
        ${this.blockStyle}
      </style>
      <div id="container" @keydown="${this.keydownHandler}">
      ${repeat(blocks, (block) => block.id, (block, index) => this.blockRender(block, index))}
      </div>
    `;
  }

  blockRender(block, index) {
    // clear the input
    if (block.hasUpdated) {
      let childNodes = this.shadowRoot.querySelector(`[input-index="${index}"]`).childNodes;
      for (let node of childNodes) {
        if (node.nodeType == 3) node.textContent = '';
      }
      block.hasUpdated = false;
    }
    // concat the template
    let inputTemplate = html`<div class="article-${block.type}" placeholder="${block.type}" @input="${this.inputHandler}" @click="${this.clickHandler}" @blur="${() => this.blocks = this.blocks}" contenteditable="true" type="text" spellcheck="true" style="max-width: 100%;width: 100%;white-space: pre-wrap;word-break: break-word;caret-color: rgb(255, 0, 0);-webkit-user-modify: read-write-plaintext-only;background: transparent;border: none;color: inherit;"  input-index=${index}>${block.text || ''}</div>`;
    if (block.type == 'heading') {
      if (block.depth == 1) {
        return html`<h1>${inputTemplate}</h1>`;
      } else if (block.depth == 2) {
        return html`<h2>${inputTemplate}</h2>`;
      } else if (block.depth == 3) {
        return html`<h3>${inputTemplate}</h3>`;
      } else if (block.depth == 4) {
        return html`<h4>${inputTemplate}</h4>`;
      } else if (block.depth == 5) {
        return html`<h5>${inputTemplate}</h5>`;
      } else if (block.depth == 6) {
        return html`<h6>${inputTemplate}</h6>`;
      }
    } else if (block.type == 'blockquote') {
      return html`<blockquote>${block.children.map((b, i) => this.blockRender(b, i))}</blockquote>`;
    } else if (block.type == 'code') {
      return html`<pre><code>${inputTemplate}</code></pre>`;
    } else {
      return html`<p>${inputTemplate}</p>`;
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('blocks')) {
      for (let i = 0; i < this._blocks.length; i++) {
        let block = this._blocks[i];
        if (block.focus) {
          block.focus = false;
          this.shadowRoot.querySelector(`[input-index="${i}"]`).focus();
        }
      }
    }
  }

  /* Event Handler */

  keydownHandler(e) {
    let target = e.target;
    let i = parseInt(target.getAttribute('input-index'));
    if (e.key == 'Enter' && !e.shiftKey) {
      let blocks = this.blocks;
      blocks.splice(i + 1, 0, {
        id: this.blocks.length,
        type: 'paragraph',
        value: '',
        focus: true
      });
      this.blocks = blocks;
      e.preventDefault();
    }
  }

  inputHandler(e) {
    let target = e.target;
    let i = parseInt(target.getAttribute('input-index'));
    this.input(i, target);
  }

  clickHandler(e) {
    let selection = this.shadowRoot.getSelection();
    //console.log(selection, selection.anchorOffset, selection.focusOffset);
  }

  /* Helper */

  /**
   * lexer
   * @description convert markdown to blocks
   * @param {*} markdown
   * @todo generate id for every block
   */
  lexer(markdown) {
    let tokens = marked.lexer(markdown);
    let blocks = [];
    let branch = [blocks];
    let node = blocks;
    let last;
    for (let token of tokens) {
      if (token.type.indexOf('_start') > -1) {
        let block = { type: token.type.replace('_start', ''), children: [] };
        branch.push(block);
        node.push(block);
        node = block.children;
      } else if (token.type.indexOf('_end') > -1) {
        if (node.length == 0) {
          delete last.children;
        }
        branch.pop();
        node = branch[branch.length - 1];
        if ('children' in node) {
          node = node.children;
        }
      } else if (token.type == 'text') {
        last.text = token.text;
      } else {
        if (branch != blocks)
          node.push(token);
      }
      last = branch[branch.length - 1];
    }
    console.log(tokens);
    console.log(blocks);
    this.blocks = blocks;
  }

  input(i, input) {
    let text = input.innerText;
    // if (/^#{1,6}\s?/.test(text)) {
    //   this.blocks[i].type = 'heading1';
    // } else if (/^\>\s?/.test(text)) {
    //   this.blocks[i].type = 'blockquote';
    // } else if (/^```[\s\S]*```/m.test(text)) {
    //   this.blocks[i].type = 'code';
    // } else {
    //   this.blocks[i].type = 'paragraph';
    // }
    this.blocks[i].text = text;
    this.blocks[i].hasUpdated = true;
  }

  get blockModal() {
    return new Map([
      ['paragraph', { type: '', text: '' }],
      ['heading', { type: '', depth: '', text: '' }],
      ['code', { type: '', lang: '', text: '' }],
    ]);
  };

  get blockStyle() {
    return `
    :host p {
      margin: 0 0 1.5em;
      text-align: justify;
    }

    :host li p {
      margin-bottom: 0;
    }

    :host p:first-child,
    :host h1:first-child,
    :host h2:first-child,
    :host h3:first-child,
    :host h4:first-child,
    :host h5:first-child,
    :host h6:first-child {
      margin-top: 0;
    }

    :host h1,
    :host h2,
    :host h3,
    :host h4,
    :host h5,
    :host h6 {
      color: var(--klog-markdown-title-color);
    }

    :host a {
      color: var(--primary-color);
      text-decoration: none;
      border-bottom: 1px solid currentColor;
    }

    :host a:visited {
      color: var(--primary-color);
    }

    :host em {
      font-family: "Biaodian Pro Serif GB", "Numeral LF Serif", Georgia, "Times New Roman", "Han Kaiti GB", cursive, serif;
      padding: 0 2px;
      font-style: normal;
      -moz-text-emphasis: none !important;
      -webkit-text-emphasis: none !important;
      text-emphasis: none !important;
      display: inline;
    }

    :host strong {
      color: var(--primary-text-color);
      font-weight: bold;
      font-family: inherit !important;
    }

    :host blockquote {
      font-family: "Biaodian Pro Serif GB", "Numeral LF Serif", Georgia, "Times New Roman", 'Noto Serif CJK SC', 'Source Han Serif SC', â€˜Source Han Serifâ€™, source-han-serif-sc, 'å®‹ä½“', serif !important;
      font-weight: 400;
      padding-left: 2em;
      margin: 2em 0;
      font-size: .9em;
      position: relative;
    }

    :host blockquote::before {
      content: '';
      position: absolute;
      left: 2.5px;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--divider-color);
      border-radius: 1.5px;
    }

    :host code,
    :host pre {
      font-family: Menlo, Monaco, Consolas, "Andale Mono", "lucida console", "Courier New", -apple-system, "PingFang SC", "Hiragino Sans GB", "Source Han Sans CN", "Source Han Sans SC", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif !important;
      background: var(--klog-markdown-block-color);
    }

    :host pre {
      padding: 16px 0 0;
      line-height: 1.5;
      border-radius: 5px;
      text-align: left;
      white-space: pre;
      word-spacing: normal;
      word-break: normal;
      word-wrap: normal;
      -moz-tab-size: 4;
      -o-tab-size: 4;
      tab-size: 4;
      overflow: hidden;
    }

    :host pre code {
      display: block;
      width: 100%;
      padding: 16px;
      overflow: auto;
      box-sizing: border-box;
    }

    :host :not(pre)>code,
    :host>code {
      padding: 1px 4px;
      border-radius: 3px;
      word-break: break-all;
      white-space: normal;
    }

    :host .meta {
      padding: 0 16px;
    }

    :host pre .code-lang {
      padding: 2px 10px;
      border-top: 1px solid var(--divider-color);
      border-radius: 12px;
      background: var(--primary-background-color);
      font-size: 0.875em;
      color: var(--secondary-text-color);
      user-select: none;
      cursor: default;
    }

    :host pre code:first-child {
      padding-top: 0;
    }

    :host klog-player-lite {
      width: 100%;
      --klog-player-border-radius: 5px;
      --klog-player-background-color: var(--klog-markdown-block-color);
    }

    :host [image] {
      @apply(--klog-markdown-image-container);
    }

    :host klog-image {
      max-width: 100%;
      border-radius: 5px;
      --klog-image-border-radius: 5px;
      @apply(--klog-markdown-image);
    }

    :host [image] .description::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      margin: 0 8px 0 0;
      background: var(--divider-color);
      clip-path: polygon(45% 0, 55% 0, 100% 80%, 0 80%);
      border-radius: 50%;
      transition: clip-path .3s ease;
    }

    :host [image]:hover .description::before {
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    }

    :host [image] .description {
      color: var(--secondary-text-color);
      padding: 12px 0 0;
    }

    :host table {
      margin: 1em 0;
      text-align: left;
      background: var(--klog-markdown-block-color);
      padding: 16px 8px 16px 16px;
      border-radius: 5px;
    }

    :host td {
      padding-right: 8px;
    }

    :host [toc]>ol {
      padding-left: 0;
    }

    :host [toc] ol {
      counter-reset: section;
      list-style-type: none;
    }

    :host [toc] li::before {
      counter-increment: section;
      content: counters(section, ".") " ";
    }

    :host [toc] li>span {
      cursor: pointer;
    }

    :host [toc] li.selected:hover>span {
      text-decoration: underline;
    }

    ::selection {
      background: var(--klog-markdown-selection-background);
    }
    `;
  }
}

customElements.define('moon-editor', MoonEditor);
