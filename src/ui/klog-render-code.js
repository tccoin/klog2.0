import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '../style/klog-style-scrollbar.js';
import '../lib/prism.js';
import '../lib/prism-style.js';
class KlogRenderCode extends PolymerElement {
    static get template() {
        return html`
    <style include="klog-style-scrollbar"></style>
    <style include="prism-style"></style>
    <style>
      :host {
        display: block;
        margin: calc(1em + 12px) 0 1em;
      }

      code,
      pre {
        font-family: Menlo, Monaco, Consolas, "Andale Mono", "lucida console", "Courier New", -apple-system, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif !important;
      }

      pre {
        position: relative;
        margin: 0;
        padding: 0;
        line-height: 1.5;
        text-align: left;
        white-space: pre;
        word-spacing: normal;
        word-break: normal;
        word-wrap: normal;
        -moz-tab-size: 4;
        -o-tab-size: 4;
        tab-size: 4;
      }

      pre > *{
        position: relative;
        z-index: 1;
      }

      pre::after {
        @apply --overlay-style;
        background: var(--primary);
        opacity: 0.08;
        border-radius: 5px;
        z-index: 0;
      }

      pre code {
        display: block;
        width: 100%;
        padding: 16px;
        overflow: auto;
        box-sizing: border-box;
      }

      :not(pre)>code,
      .klog-article-content>code {
        padding: 1px 4px;
        border-radius: 3px;
        word-break: break-all;
        white-space: normal;
      }

      :host(.has-meta) code {
        padding-top: 24px;
      }

      :host(.overflow-code) code {
        max-height: 80vh;
        overflow: auto;
      }

      .meta {
        padding: 0 16px;
      }

      .meta .code-lang {
        padding: 2px 10px;
        border-radius: 5px;
        font-size: 0.875em;;
        background: var(--primary-container);
        color: var(--on-primary-container);
        user-select: none;
        -webkit-user-select: none;
        cursor: default;
        position: absolute;
        top: -12px;
        z-index: 10;
        @apply(--shadow-elevation-2dp);
      }

      pre code:first-child {
        padding-top: 0;
      }
    </style>
    <div id="container" theme\$="[[theme]]">
      <pre id="pre"><template is="dom-if" if="{{lang}}"><div class="meta"><span class="code-lang">{{lang}}</span></div></template><code id="code"></code></pre>
    </div>
`;
    }

    static get is() { return 'klog-render-code'; }

    static get properties() {
        return {
            lang: {
                type: String,
                value: ''
            },
            code: {
                type: String,
                value: ''
            },
            theme: {
                type: String,
                value: 'dark',
                reflectToAttribute: true,
            }
        };
    }

    ready() {
        super.ready();
        if (Prism) {
            this.placeHolderPromise = this.update();
        } else {
            console.error('Prism not found');
            this.placeHolderPromise = Promise.resolve();
        }
    }

    update() {
        return new Promise(resolve => {
            this.lang = this.lang.replace(/cpp/i, 'c++').toUpperCase();
            let highlightLang = this.lang in Prism.languages ? lang : 'clike';
            let grammar = Prism.languages[highlightLang];
            this.highlightCode = Prism.highlight(unescape(this.code), grammar, highlightLang) || '';
            this.$.container.setAttribute('theme', this.theme);
            this.$.pre.classList.add(`language-${this.lang}`);
            this.$.code.innerHTML = this.highlightCode;
            setTimeout(resolve, 1);
        });
    }
}

window.customElements.define(KlogRenderCode.is, KlogRenderCode);
