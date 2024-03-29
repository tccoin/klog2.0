import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-selector/iron-selectable.js';

class KlogPages extends PolymerElement {
    static get template() {
        return html`
    <style>
      :host {
        display: flex;
        width: var(--klog-pages-width, 100%);
        height: var(--klog-pages-height, 100%);
        flex-direction: row;
        justify-content: center;
        position: relative;
        box-sizing: border-box;
      }

      :host> ::slotted(*) {
        position: relative;
        height: inherit;
        overflow-x: hidden;
        overflow-y: auto;
        @apply --klog-pages-everyone;
      }

      :host(:not([disabled]))> ::slotted(:not(.selected):not(.old-selected)) {
        display: none !important;
      }

      :host(:not([disabled]))> ::slotted(.old-selected) {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
      }

      :host(:not([disabled]))> ::slotted(.selected) {
        width: var(--klog-pages-width, 100%) !important;
        border: none !important;
      }
    </style>
    <slot></slot>
`;
    }

    static get is() { return 'klog-pages'; }

    static get properties() {
        return {
            selected: {
                type: Number,
                value: 0,
                observer: '_select',
                reflectToAttribute: true
            },
            disabled: {
                type: Boolean,
                value: false,
                reflectToAttribute: true,
                observer: '_disable'
            },
            progress: {
                type: Number,
                value: 100,
                observer: '_progressUpdate'
            }
        };
    }

    _select() {
    // trigger events
        this.dispatchEvent(new CustomEvent('pages-select', { bubbles: true, composed: true }));
        // index out of range
        if (this.selected > this.children.length - 1) return;
        // update selected page
        this.oldSelected = this.querySelector('.selected');
        this.newSelected = this.children[this.selected];
        // animation
        this._progressUpdate();
        // update classList
        if (this.oldSelected) this.oldSelected.classList.remove('selected');
        this.newSelected.classList.add('selected');
    }

    _progressUpdate() {
    // no animation
        if (!this.oldSelected) return;
        // set classList
        if (this.progress == 100) {
            this.oldSelected.classList.remove('old-selected');
        } else {
            this.oldSelected.classList.add('old-selected');
        }
        // if disabled
        if (this.disabled) return;
        // set opacity
        let percent = this.progress / 100;
        this.oldSelected.style.opacity = 1 - percent;
        this.newSelected.style.opacity = percent;
    }

    _disable() {
        for (let child of this.children) {
            child.style.opacity = 1;
        }
    }
}

window.customElements.define(KlogPages.is, KlogPages);
