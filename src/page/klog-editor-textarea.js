import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js';
import '../data/klog-data-uploader.js';

class KlogEditorTextarea extends PolymerElement {
    static get template() {
        return html `
    <style>
      :host {
        display: block;
        background-color: var(--surface);
      }

      .textarea {
        display: block;
        border: none;
        padding: 0;
        transition: top 100ms linear !important;
        width: 100%;

        --iron-autogrow-textarea: {
          color: var(--on-surface);
          padding: var(--textarea-padding, 24px);
          font-size: var(--textarea-font-size, 14px);
          word-break: break-all;
          box-sizing: border-box;
          overflow: hidden;
        }
      }

      .placeholder {
        height: calc(100% - 2 * var(--textarea-padding));
      }
    </style>
    <klog-data-uploader id="uploader"></klog-data-uploader>
    <iron-autogrow-textarea id="input" class="textarea" placeholder="{{placeholder}}" value="{{value}}">
    </iron-autogrow-textarea>
    <div class="placeholder"></div>
`;
    }

    static get is() { return 'klog-editor-textarea'; }

    static get properties() {
        return {
            value: {
                type: String,
                notify: true,
                observer: '_changed',
                value: ''
            },
            preview: {
                type: String,
                notify: true
            },
            tokens: {
                type: Array,
                observer: '_tokensChanged',
                value: []
            },
            placeholder: {
                type: String
            },
            cursorPosition: {
                type: Number,
                value: 0,
                notify: true
            },
            currentLine: {
                type: String,
                notify: true,
                value: ''
            },
            currentLineStart: {
                type: Number,
                notify: true
            },
            currentLineEnd: {
                type: Number,
                notify: true
            }
        };
    }

    ready() {
        super.ready();
        this._input = this.$.input.$.textarea;
        this._input.addEventListener('editor-textarea-input', () => this._updateCurrentStatus());
        this._input.addEventListener('keyup', (e) => this._updateCurrentStatus());
        this.addEventListener('click', () => this._updateCurrentStatus());
        this._input.addEventListener('keydown', (e) => this.keydown(e));
        this._input.addEventListener('paste', (e) => this.paste(e));

        this._updateCurrentStatus();

        setTimeout(() => {
            if (this.$.preview) {
                this.$.preview.addEventListener('markdown-rendered', () => this._updatePointers());
            }
            this.addEventListener('scroll', (e) => this.scroll(e));
        }, 1);
        this._currentLine = '';
    }

    scroll(e) {
        let scrollTarget = this.$.preview;
        let y = e.target.scrollTop;
        if (!this._p1 || !this._p2 || this._p1.length != this._p2.length) {
            let ratio = y / (e.target.scrollHeight - e.target.clientHeight);
            let _ratio = this._ratio || 0;
            let newScrollTop = scrollTarget.scrollTop + (ratio - _ratio) * (scrollTarget.scrollHeight - scrollTarget.clientHeight);
            scrollTarget.scrollTop = newScrollTop;
            this._ratio = ratio;
        } else {
            let p1 = this._p1;
            let p2 = this._p2;
            let position = this._position || 0;
            while (y < p1[position]) --position;
            while (y >= p1[position + 1]) ++position;
            let t1 = p1[position];
            let b1 = p1[position + 1];
            let t2 = p2[position];
            let b2 = p2[position + 1];
            let newScrollTop = t2 + (y - t1) / (b1 - t1) * (b2 - t2);
            scrollTarget.scrollTop = newScrollTop;
            this._position = position;
        }
    }

    _changed() {
    // preview
        if (!this.preview) {
            this._updatePreview();
            return;
        }
        if (this._timer) clearTimeout(this._timer);
        let delay = 50;
        if (this.value.length > 1000) delay = 300 + Math.floor(this.value.length / 1000) * 40;
        this._timer = setTimeout(() => this._updatePreview(), delay);
    }

    _updatePreview() {
    // update preview
        this.preview = this.value;
    }

    _updatePointers() {
    //p1
        let p1 = [0]; // p represents pointers
        let input = this.$.input;
        let mirror = input.$.mirror;
        mirror.style.whiteSpace = 'pre-wrap';
        mirror.innerHTML = mirror.innerHTML.replace(/( *(`{3,}|~{3,}).*?<br>.*?(<br>)? *\2 *)|(^|<br>)(#{1,6} [^<]+?)(<br>|&nbsp)/mg, '$4<span>$1$5</span>$6');
        let spans = mirror.querySelectorAll('span');
        for (let span of spans) {
            if (span.innerHTML.indexOf('```') > -1) continue;
            p1.push(span.offsetTop);
        }
        p1.push(input.clientHeight);
        this._p1 = p1;
        //p2
        let p2 = [0];
        let content = this.$.preview.$.content;
        let headings = content.querySelectorAll('[depth]');
        for (let heading of headings) p2.push(heading.offsetTop);
        p2.push(content.clientHeight);
        this._p2 = p2;
    }

    reset() {
        this.scrollTop = 0;
    }

    load() {
        if (this._interval) clearInterval(this._interval);
    // this._interval = setInterval(() => this._updateCurrentStatus(), 500);
    }

    unload() {
        clearInterval(this._interval);
    }
    //editor function

    keydown(e) {
    //console.log(e, e.keyCode);
    // determine whether shortcuts are triggered
        if (e.ctrlKey && e.keyCode == 66) {
            //ctrl b
            e.preventDefault();
            this.autoPack('**');
        } else if (e.ctrlKey && e.keyCode == 73) {
            //ctrl i
            e.preventDefault();
            this.autoPack('*');
        } else if (e.ctrlKey && e.keyCode == 192) {
            //ctrl `
            e.preventDefault();
            this.autoPack('~~');
        } else if (e.ctrlKey && e.keyCode == 75) {
            //ctrl k
            e.preventDefault();
            let before = this.getBefore(2);
            let after = this.getAfter(2);
            let b1 = before.length < 2 || before.indexOf('\n') > -1 || before == '$$';
            let b2 = after.length < 2 || after.indexOf('\n') > -1 || after == '$$';
            if (b1 && b2) {
                this.autoPack('$$');
            } else {
                this.autoPack('$');
            }
        } else if (e.keyCode == 13) {
            //enter
            let listGrammar = /^(\s*)(\-|\d{1}\.)(\s+)(.*)/.exec(this.currentLine);
            //[1]=list level;[2]=['-','1'];[3]=space after[2];[4]list content
            if (listGrammar) {
                let isOrdered = listGrammar[2] != '-';
                if (!listGrammar[4]) {
                    //remove list
                    e.preventDefault();
                    this.backspace(listGrammar[1].length + listGrammar[3].length + (isOrdered ? 2 : 1));
                    return;
                } else if (listGrammar[4]) {
                    // add list
                    e.preventDefault();
                    this.insert(`\n${listGrammar[1]}${isOrdered ? parseInt(listGrammar[2]) + 1 + '.' : '-'} `, '');
                }
            }
        } else if (e.shiftKey && e.keyCode == 219) {
            //{}
            if (this.getAfter(1) != '}') this.insert('', '}');
        } else if (e.shiftKey && e.keyCode == 52) {
            //$$
            this.insert('', '$');
        } else if (e.keyCode == 67 && this.getBefore(4) == '\\fra') {
            //\frac{}{}
            e.preventDefault();
            this.insert('c{', '}{}');
        } else if (!e.shiftKey && e.keyCode == 9) {
            e.preventDefault();
            this.insert('  ');
        } else if (e.shiftKey && e.keyCode == 9 && this.getBefore(2) == '  ') {
            e.preventDefault();
            this.backspace(2);
        } else {
            //console.log(e.keyCode);
        }
    }

    paste(e) {
        let clipboard = e.clipboardData || window.clipboardData;
        for (let file of clipboard.files) {
            if (file.type.indexOf('image') > -1) this.$.uploader.upload(file);
            //console.log(file);
        }
    }

    autoPack(pattern) {
        if (this.getBefore(pattern.length) == pattern && this.getAfter(pattern.length) == pattern) this.unpack(pattern);
        else this.pack(pattern);
    //console.log(this.getBefore(pattern.length), this.getAfter(pattern.length));
    }

    pack(pattern) {
        this.insert(pattern, pattern);
    }

    unpack(pattern) {
        this.backspace(pattern.length);
        this.delete(pattern.length);
    }

    //input function

    _setSelection(start, end) {
        end = end || start;
        this._input.selectionStart = start;
        this._input.selectionEnd = end;
    }

    getBefore(len) {
        let [value, selectionStart] = [this.value, this._input.selectionStart];
        return value.substr(selectionStart - len, len);
    }

    getAfter(len) {
        let [value, selectionEnd] = [this.value, this._input.selectionEnd];
        return value.substr(selectionEnd, len);
    }

    backspace(len) {
        let [value, input, selectionStart, selectionEnd] = [this.value, this._input, this._input.selectionStart, this._input.selectionEnd];
        this.value = value.substr(0, selectionStart - len) + value.substr(selectionStart);
        this._setSelection(selectionStart - len, selectionEnd - len);
        this._fireInput();
    }

    delete(len) {
        let [value, input, selectionStart, selectionEnd] = [this.value, this._input, this._input.selectionStart, this._input.selectionEnd];
        this.value = value.substr(0, selectionEnd) + value.substr(selectionEnd + len);
        this._setSelection(selectionStart, selectionEnd);
        this._fireInput();
    }

    insert(before = '', after = '') {
        let [value, input, selectionStart, selectionEnd] = [this.value, this._input, this._input.selectionStart, this._input.selectionEnd];
        this.value = value.substr(0, selectionStart) + before + value.substr(selectionStart, selectionEnd - selectionStart) + after + value.substr(selectionEnd);
        this._setSelection(selectionStart + before.length, selectionEnd + before.length);
        this._fireInput();
    }

    insertLine(before = '', after = '') {
        let [value, input, currentLineStart, currentLineEnd] = [this.value, this._input, this.currentLineStart, this.currentLineEnd];
        this.value = value.substr(0, currentLineStart) + (before ? before + '\n' : '') + value.substr(currentLineStart, currentLineEnd - currentLineStart) + (after ? after + '\n' : '') + value.substr(currentLineEnd);
        if (before) {
            this._setSelection(currentLineStart + before.length + before.split('\n').length - 1);
        } else {
            this._setSelection(currentLineEnd + after.length + after.split('\n').length - 1);
        }
        setTimeout(() => {
            console.log(this.value.substr(this.currentLineStart, this.currentLineEnd - this.currentLineStart));
        }, 1);
        // console.log(currentLineStart, currentLineEnd);
        this._fireInput();
    }

    _tokensChanged(tokens) {
        if (tokens) {
            this._tokens = tokens.filter(t => 'start' in t);
        } else {
            this._tokens = [];
        }
        this._updateCurrentStatus();
    }

    _updateCurrentStatus() {
        let input = this.$.input.$.textarea;
        let lines = this.value.split('\n');
        //get cursor position
        this.cursorPosition = input.selectionStart;
        //get current line
        let lengthSum = 0;
        for (let i = 0; i < lines.length; i++) {
            lengthSum += lines[i].length + 1;
            if (lengthSum > this.cursorPosition) {
                this.currentLine = lines[i];
                this.currentLineNumber = i;
                this.currentLineStart = lengthSum - lines[i].length - 1;
                this.currentLineEnd = lengthSum;
                this.cursorLinePosition = this.cursorPosition - (lengthSum - lines[i].length - 1);
                break;
            }
        }
        // get current token
        let currentToken;
        for (let token of this._tokens) {
            if (this.currentLineNumber >= token.start) {
                currentToken = token;
            } else {
                break;
            }
        }
        this.currentToken = currentToken;
        // get caret position
        const mirror = this.$.input.$.mirror;
        let _lineNumber = this.currentLineNumber;
        let mirrorLine;
        if (_lineNumber == 0) {
            mirrorLine = mirror.length == 0 ? null : mirror.childNodes[0];
        } else {
            for (mirrorLine of mirror.querySelectorAll('br')) {
                _lineNumber -= 1;
                if (_lineNumber == 0) {
                    break;
                }
            }
        }
        // let _anchor = mirror.querySelector('span.anchor');
        // if (_anchor) _anchor.parentNode.removeChild(_anchor);
        let anchor = document.createElement('span');
        anchor.classList.add('anchor');
        anchor.innerHTML = this.currentLine.slice(0, this.cursorLinePosition) + '<span class="pin">.</span>';
        if (mirrorLine) {
            mirrorLine.parentNode.insertBefore(anchor, mirrorLine.nextSibling);
        } else {
            mirror.append(anchor);
        }
        let anchorPosition = anchor.querySelector('.pin').getBoundingClientRect();
        // anchor.style.background = '#333';
        // mirror.style.visibility = 'initial';
        anchor.parentNode.removeChild(anchor);
        // kick
        this.dispatchEvent(new CustomEvent('input', {
            bubbles: true,
            composed: true,
            detail: {
                currentLine: this.currentLine,
                currentLineNumber: this.currentLineNumber,
                currentToken: this.currentToken,
                selection: [input.selectionStart, input.selectionEnd],
                lineHeight: parseInt(window.getComputedStyle(input).lineHeight),
                caretPosition: { x: anchorPosition.x, y: anchorPosition.y }
            }
        }));

    }

    _fireInput() {
        this._input.focus();
        this._input.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
    }

    // $0.innerHTML='<span>'+$0.innerHTML.replace(/<br>/g,'</span><br><span>')+'</span>'
}

window.customElements.define(KlogEditorTextarea.is, KlogEditorTextarea);