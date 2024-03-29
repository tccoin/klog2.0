import '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-fit-behavior/iron-fit-behavior.js';
import '../style/klog-style-scrollbar.js';
import './klog-image.js';
import './klog-video.js';
import './klog-player-lite.js';
import '../style/klog-style-markdown.js';
import '../data/klog-data-user.js';
import './klog-markdown-scroller.js';
import './klog-markdown.js';
import './klog-icons.js';

class KlogIMarkdown extends KlogMarkdown {
    static get template() {
        return html`
    <style include="klog-style-scrollbar"></style>
    <style include="klog-style-markdown"></style>
    <style include="han-style"></style>
    <style>
      :host {
        cursor: default;
        user-select: none;
        -webkit-user-select: none;
      }

      #content {
        position: relative;
        z-index: 1;
      }

      #selection {
        width: calc(100% - 16px);
        border-radius: 5px;
        position: absolute;
        left: 8px;
        box-sizing: border-box;
        opacity: 0;
        z-index: 0;
        @apply(--shadow-elevation-16dp);
        transition: all .1s ease;
      }

      #input {
        height: 100%;
        width: 100%;
        border-radius: 5px;
        overflow: hidden;
        background: var(--surface);
        transition: .1s opacity .1s ease;
      }

      #textarea {
        height: 100%;
        width: 100%;
        padding: 0 16px;
        outline: none;
        border: none;
        resize: none;
        box-sizing: border-box;
        text-align: justify;
        --textarea-padding: 0px;
      }

      #confirm {
        color: var(--primary);
        position: absolute;
        right: 0px;
        top: 0;
        margin: 0;
      }
    </style>
    <klog-data-user disabled id="user"></klog-data-user>
    <klog-markdown-scroller id="scroller" link-prefix="{{linkPrefix}}"></klog-markdown-scroller>
    <article id="article" class="klog-article-content" theme\$="[[theme]]">
      <slot></slot>
      <div id="content"></div>
      <div id="selection">
        <div id="input">
          <klog-editor-textarea id="textarea" tokens="{{tokens}}" placeholder="摸了摸了"></klog-editor-textarea>
          <paper-icon-button id="confirm" icon="save_alt"></paper-icon-button>
        </div>
      </div>
      <slot name="after"></slot>
    </article>
`;
    }

    static get is() { return 'klog-imarkdown'; }

    static get properties() {
        return {
            result: {
                type: String,
                notify: true
            },
        };
    }

    ready() {
        super.ready();

        //lazy-init
        if (this.lazy) this.lazyInit();

        //renderer
        this.initRanderer();

        //scroller
        this.$.scroller.$.markdown = this;

        //bind
        this.$.textarea.$.preview = this;

        //listener
        this.addEventListener('mouseup', e => {
            if (this._selectionStart == undefined || this._selectionEnd == undefined) return;
            this.selectionStart = this._selectionStart;
            this.selectionEnd = this._selectionEnd;
            this._selectionStart = null;
            this._selectionEnd = null;
            this.editSelection(this.selectionStart, this.selectionEnd);
        });
    }

    render() {
    //load preference
        if (!this.preference) {
            this.preference = this.$.user.defaultMarkdownPreference;
        }
        // reset attributes
        this.$.content.innerHTML = '';
        this.collection = 'Daily';
        this.tags = [];
        this._headingIndex = 0;
        this._headings = [];
        this._hasToc = false;
        // no markdown
        if (!this.markdown) {
            this.$.scroller.reset();
            this._updateWordCount();
            return;
        }
        // translate markdown
        marked(this.markdown, this.options, (err, out, tokens) => {
            if (err) throw err;
            this.tokens = tokens;
            this._reflinks = tokens.links;
            //render
            this.$.content.innerHTML = out;
            //post-update
            this._updateHeadings();
            this._updateLists();
            this._updateEvents();
            // word count
            this._updateWordCount();
            //Han
            // Han(this.$.article, this.$.article).render();
            setTimeout(() => this.dispatchEvent(new CustomEvent('markdown-rendered', { bubbles: true, composed: true })), 1);
            // scroller
            if (this.$.scroller.query) {
                this.waitPlaceholders().then(() => this.$.scroller.scroll());
            }
            // lazy load image
            if (this.lazy) setTimeout(() => this.lazyObserve(), 1);
            // interaction
            this.updateBlocks();
        });
    }

    updateBlocks() {
        let blocks = [];
        let anchors = this.$.content.querySelectorAll('anchor');
        for (let anchor of anchors) {
            blocks.push(anchor.nextElementSibling);
            anchor.nextElementSibling.setAttribute('block-index', anchor.getAttribute('index'));
            anchor.parentNode.removeChild(anchor);
        }
        for (let block of blocks) {
            block.addEventListener('mousedown', e => {
                this._selectionStart = parseInt(e.currentTarget.getAttribute('block-index'));
                this._selectionEnd = parseInt(e.currentTarget.getAttribute('block-index'));
                this.updateSelection(this._selectionStart, this._selectionEnd);
                this.$.selection.style.setProperty('z-index', 2);
            });
            block.addEventListener('mousemove', e => {
                let block = e.currentTarget;
                if (this._selectionStart != null) {
                    this._selectionEnd = parseInt(e.currentTarget.getAttribute('block-index'));
                    this.updateSelection(this._selectionStart, this._selectionEnd);
                }
            });
        }
    }

    _findParentBlock(target) {
        while (true) {
            if (target.hasAttribute('block-index')) {
                return target;
            } else {
                if (target.parentNode) {
                    target = target.parentNode;
                } else {
                    return null;
                }
            }
        }
    }

    _swap(start, end) {
        if (start <= end) { return [start, end]; }
        else { return [end, start]; }
    }

    updateSelection(start, end) {
        [start, end] = this._swap(start, end);
        console.log(start, end);
        let startBlock = this.$.content.querySelector(`[block-index="${start}"]`);
        let endBlock = this.$.content.querySelector(`[block-index="${end}"]`);
        const marginTop = this._calculateBlockMarginTop(startBlock);
        const marginBottom = this._calculateBlockMarginBottom(endBlock);
        let articlePadding = parseInt(window.getComputedStyle(this.$.article).paddingTop);
        let top = startBlock.offsetTop + articlePadding - marginTop;
        let height = endBlock.offsetTop + endBlock.offsetHeight - startBlock.offsetTop + marginTop + marginBottom;
        this._showSelection(top, height, marginTop, marginBottom);
        this._hideInput();
    }

    async editSelection(start, end) {
        [start, end] = this._swap(start, end);
        let startToken = this.tokens.find(t => t.index == start);
        let endToken = this.tokens.find(t => t.index == end);
        let startLine = startToken.start;
        let endLine = endToken.start + endToken.length;
        let oldMarkdown = this._getLines(this.markdown, startLine, endLine);
        let newMarkdown = await this.selectionInputing(oldMarkdown);
        this.output = this._replaceLines(this.markdown, startLine, endLine, newMarkdown);
        this.markdown = this.output;
    }

    selectionInputing(str) {
        console.log(str, this.$.textarea);
        this.$.textarea.value = str;
        this._showInput(Math.max(str.split('\n').length * 14 * 1.7, 100));
        return new Promise(resolve => {
            this.$.confirm.addEventListener('click', e => {
                e.stopPropagation();
                this._hideInput();
                this._hideSelection();
                console.log('confirm-click', e.target, this.$.textarea.value);
                resolve(this.$.textarea.value);
            }, { once: true });
            this.$.selection.addEventListener('click', e => {
                e.stopPropagation();
            });
            // this.addEventListener('click', e => {
            //   console.log('outside-click', e.target, this.$.textarea.value);
            //   this._hideInput();
            //   this._hideSelection();
            //   resolve(str);
            // }, { once: true });
        });
    }

    _showInput(height = 100) {
        this.$.input.style.setProperty('visibility', 'visible');
        this.$.input.style.setProperty('opacity', '1');
        // if (this.$.selection.offsetHeight < height) {
        //   this.$.selection.style.setProperty('height', `${height}px`);
        // }
        this.$.selection.style.setProperty('height', '');
    }

    _hideInput() {
        this.$.input.style.setProperty('visibility', 'hidden');
        this.$.input.style.setProperty('opacity', '0');
        this.$.selection.style.setProperty('z-index', 0);
    }

    _showSelection(top, height, marginTop = 0, marginBottom = 0) {
        this.$.selection.style.setProperty('top', `${top}px`);
        this.$.selection.style.setProperty('height', `${height}px`);
        this.$.textarea.style.setProperty('padding-top', `${marginTop}px`);
        this.$.textarea.style.setProperty('padding-bottom', `${marginBottom}px`);
        this.$.selection.style.setProperty('opacity', 1);
    }

    _hideSelection() {
        this.$.selection.style.setProperty('opacity', 0);
    }

    _getLines(str, startLine, endLine) {
        let lines = str.split('\n');
        return lines.splice(startLine, endLine - startLine).join('\n');
    }

    _replaceLines(str, startLine, endLine, replace) {
        let lines = str.split('\n');
        lines.splice(startLine, endLine - startLine, replace);
        return lines.join('\n');
    }

    _calculateBlockMarginTop(target) {
        let m1 = 0, m2 = 0; // target-top, previousSibling-bottom
        m1 = parseInt(window.getComputedStyle(target).marginTop);
        while (target = target.previousElementSibling) {
            if (target.hasAttribute('block-index')) {
                m2 = parseInt(window.getComputedStyle(target).marginBottom);
                break;
            }
        }
        return Math.max(m1, m2) / 2;
    }

    _calculateBlockMarginBottom(target) {
        let m1 = 0, m2 = 0;// target-bottom, nextSibling-top
        m1 = parseInt(window.getComputedStyle(target).marginBottom);
        while (target = target.nextElementSibling) {
            if (target.hasAttribute('block-index')) {
                m2 = parseInt(window.getComputedStyle(target).marginTop);
                break;
            }
        }
        return Math.max(m1, m2) / 2;
    }
}

window.customElements.define(KlogIMarkdown.is, KlogIMarkdown);
