import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-input/iron-input.js';

class KlogNoteSearch extends PolymerElement {
    static get template() {
        return html `
    <style>
      :host {
        display: block;
        position: absolute;
        display: inline-block;
        overflow: hidden;
        transition-property: width border-radius;
      }

      :host,
      :host input,
      :host .container .bg {
        transition: all .1s ease !important;
      }

      .container {
        position: relative;
        overflow: hidden;
        border-radius: 5px;
      }

      .container .bg {
        @apply --overlay-style;
        background: var(--primary);
        opacity: 0.08;
        transform-origin: left top;
        transition-property: opacity transform;
        z-index: 1;
      }

      .placeholder {
        display: flex;
        align-items: center;
        @apply --fit-layout;
        z-index: 1;
        padding: 16px;
        color: var(--on-background);
        cursor: default;
        user-select: none;
        -webkit-user-select: none;
      }

      iron-icon {
        position: absolute;
        z-index: 1;
        height: 100%;
        left: 8px;
        color: var(--on-background);
        cursor: pointer;
        z-index: 10;
        -webkit-tap-highlight-color: transparent;
      }

      input {
        position: relative;
        z-index: 2;
        padding: 11.5px 12px 11.5px 40px;
        outline: none;
        border: none;
        width: 100%;
        color: var(--on-surface);
        background: transparent;
        box-sizing: border-box;
        font-size: 15px;
        cursor: default;
        opacity: 1;
        transition-property: opacity;
      }

      .hidden {
        display: none;
      }
      
      ::placeholder {
        color: var(--on-surface);
        opacity: 0.5;
      }
    </style>

    <div class="container" id="container">
      <iron-icon id="icon" icon="search">
      </iron-icon>
      <paper-ripple></paper-ripple>
      <input id="input" placeholder="在知识的沙漠中搜索…">
      <div class="bg" id="bg"></div>
    </div>

    <!-- <div class="menu">
      <template is="dom-repeat" items="{{collections}}">{{item}}</template>
    </div> -->
`;
    }

    static get is() { return 'klog-note-search'; }

    static get properties() {
        return {
            keyword: {
                type: String,
                notify: true,
                observer: '_updateInput'
            },
            active: {
                type: Boolean,
                value: true
            }
        };
    }

    ready() {
        super.ready();
        this.$.icon.addEventListener('click', () => this.search());
        this.$.input.addEventListener('keyup', (e) => {
            if (e.keyCode == 13)
                this.search();
        });
        this.$.input.addEventListener('input', () => {
            this.countdown();
        });

        this._width = this.offsetWidth;
        window.addEventListener('resize', () => this._width = this.offsetWidth);
    }

    _updateInput(value) {
        this.$.input.value = value;
    }

    countdown() {
        if (this._timeout) clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            this.search();
        }, 500);
    }

    setWidth(width) {
        this._width = width;
    }

    focus() {
        this.$.input.focus();
    }

    blur() {
        this.$.input.blur();
    }

    select() {
        this.$.input.select();
    }

    search() {
        if (this.active) this.keyword = this.$.input.value;
    }

    setAnimation(p) {
        requestAnimationFrame(() => this._setAnimation(p));
    }

    _setAnimation(p) {
        p = Math.min(Math.max(p, 0), 1);
        let opacityInput = p == 1 ? 1 : 0,
            opacityBg = Math.max(1 - (1 - p) * 1.5, 0),
            width = p * (this._width - 72) + 72,
            radius = 24 - p * 19,
            x = (this._width - width) * (1 - p),
            y = -48 * (1 - p);
        this.style = `transform: translate(${x}px, ${y}px);width: ${width}px; border-radius: ${radius}px;`;
        this.$.input.style = `opacity:${opacityInput};`;
        this.$.bg.style = `opacity:calc(${opacityBg} * var(--overlay-style_-_opacity));transform:scaleX(${p});`;
        this.$.container.style = (p == 0 ? 'border-radius: 24px;' : '');
        this.active = p > 0;
    }
}

window.customElements.define(KlogNoteSearch.is, KlogNoteSearch);