import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class KlogBackdrop extends PolymerElement {
    static get template() {
        return html `
    <style>
      :host {
        display: block;
        position: relative;
        height: var(--klog-layout-page-height);
        width: 100vw;
        --klog-backdrop-default-front-top: 64px;
      }

      #back {
        height: 0;
        z-index: 1;
        @apply --klog-backdrop-back;
      }

      #front {
        position: absolute;
        top: 0px;
        bottom: var(--klog-backdrop-default-front-top);
        transform: translateY(var(--klog-backdrop-default-front-top));
        transition: transform .2s ease;
        z-index: 99;
      }
    </style>
    <div id="back">
      <slot name="back"></slot>
    </div>
    <div id="front">
      <slot name="front"></slot>
    </div>
`;
    }

    static get is() { return 'klog-backdrop'; }

    static get properties() {
        return {
            opened: {
                type: Boolean,
                value: false,
                observer: 'update'
            },
            moving: {
                type: Boolean,
                value: false,
                reflectToAttribute: true,
                notify: true
            },
            frontSwitchDisabled: {
                type: Boolean,
                value: false
            },
            gestureDisabled: {
                type: Boolean,
                value: false
            },
        };
    }

    ready() {
        super.ready();
        this.addEventListener('klog-backdrop-toggle', () => this.toggle());
        this.addEventListener('klog-backdrop-update', () => this.update());
        this.$.front.addEventListener('click', () =>
            this.dispatchEvent(new CustomEvent('klog-backdrop-front-click', { bubbles: true, composed: true }))
        );
        this.$.front.addEventListener('klog-backdrop-touchstart', e => {
            this.movestart(e.detail.touches[0].clientY);
        });
        this.$.front.addEventListener('touchmove', e => {
            if (this.moving) e.preventDefault();
            this.move(e.touches[0].clientY);
        });
        this.$.front.addEventListener('touchend', e => {
            this.moveend();
        });
    }

    deactive() {
        this.opened = false;
        this.update();
    }

    toggle() {
        this.opened = !this.opened;
    }

    open() {
        this.opened = true;
    }

    close() {
        this.opened = false;
        return new Promise((resolve) => setTimeout(() => resolve(), 200));
    }

    movestart(clientY) {
        if (this.gestureDisabled) return;
        this.moving = true;
        this._clientYStart = clientY;
        this._transformYStart = this.$.front.getBoundingClientRect().top;
        this.$.front.style.transition = 'none';
    }

    move(clientY) {
        if (this.gestureDisabled) return;
        if (!this.moving) return;
        let backHeight = this.$.back.scrollHeight;
        let clientYDiff = clientY - this._clientYStart;
        let transformY = Math.max(Math.min(clientYDiff + this._transformYStart, backHeight), 64);
        this.$.front.style.transform = `translateY(${transformY}px)`;
    }

    moveend() {
        if (this.gestureDisabled) return;
        this.moving = false;
        this.$.front.style.transition = 'transform .2s ease';
        let backHeight = this.$.back.scrollHeight;
        let currentY = this.$.front.getBoundingClientRect().top;
        this.opened = currentY > backHeight * 0.8;
        this.update();
    }

    update() {
    // event
        this.dispatchEvent(new CustomEvent('opened-changed', { bubbles: true, composed: true, detail: { value: this.opened } }));

        // transform
        let backHeight = this.$.back.scrollHeight;
        this.$.front.style.transform = this.opened ? `translateY(${backHeight}px)` : 'translateY(var(--klog-backdrop-default-front-top))';
    }
}

window.customElements.define(KlogBackdrop.is, KlogBackdrop);