import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import './klog-icons.js';
import '../style/klog-style.js';

class KlogBottomAppBar extends PolymerElement {
    static get template() {
        return html`
            <style>
            :host {
                display: flex;
                flex-direction: row;
                width: 100%;
                position: fixed;
                bottom: 0;
                right: 0;
                z-index: 99;
            }

            :host > .divider {
                flex: 1;
            }

            #actionContainer {
                display: flex;
                flex-direction: row;
                align-items: center;
                height: 56px;
                width: 100%;
                padding: 12px 16px calc(var(--safe-area-inset-bottom) + 12px);
                color: var(--on-surface-variant);
                transition: all .3s cubic-bezier(0.22, 0.61, 0.36, 1);
                position: relative;
            }

            #actionContainer.hidden {
                transform: translateY(100%);
            }

            :host([compact]) #actionContainer {
                height: 40px;
            }

            #actionContainer::after{
                @apply --overlay-style;
                background: var(--surface-variant);
                opacity: 0.9;
                z-index: -1;
                overflow: hidden;
                border-radius: 16px 16px 0 0;
            }

            #fabContainer {
                position: absolute;
                right: 16px;
                bottom: calc(var(--safe-area-inset-bottom) + 12px);
                transition: all .5s cubic-bezier(0.22, 0.61, 0.36, 1);
            }

            #fabContainer.hidden {
                transform: translateY(calc(var(--safe-area-inset-bottom) + 100% + 16px));
            }

            @media (min-width: 1024px) {
                :host {
                    width: auto;
                    right: 8vw;
                    bottom: 8vh;
                }

                #actionContainer {
                    transition: all .2s cubic-bezier(0.22, 0.61, 0.36, 1);
                }

                #actionContainer::after{
                    border-radius: 16px;
                }

                :host(:not([compact])) #actionContainer {
                    padding-right: 92px;
                }

                #fabContainer {
                    transition: all .3s cubic-bezier(0.22, 0.61, 0.36, 1);
                }

                #actionContainer.hidden,
                #fabContainer.hidden {
                    opacity: 0;
                }
            }
            </style>

            <div id="actionContainer">
                <slot></slot>
            </div>
            <div class="divider"></div>
            <div id="fabContainer">
                <slot name="fab"></slot>
            </div>
        `;
    }

    static get is() { return 'klog-bottom-app-bar'; }

    static get properties() {
        return {
            opened: {
                type: Boolean,
                value: true,
                reflectToAttribute: true
            },
            fabOpened: {
                type: Boolean,
                value: true,
                reflectToAttribute: true
            },
            disabled: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
            compact: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
        };
    }

    static get observers() {
        return [
            '_handleOpened(opened)',
            '_handleFabOpened(fabOpened)',
        ];
    }

    ready() {
        super.ready();
        this._initScroller();
        this._initButton();
    }


    updateScrollTarget(scrollTarget) {
        if (this.$.scrollTarget) {
            this.$.scrollTarget.removeEventListener('scroll', this._scrollHandler);
        }
        this.$.scrollTarget = scrollTarget;
        if (this.$.scrollTarget == document.scrollingElement) {
            document.addEventListener('scroll', this._scrollHandler);
        } else {
            this.$.scrollTarget.addEventListener('scroll', this._scrollHandler);
        }
    }

    _initButton() {
        const buttons = Array.from(this.querySelectorAll('paper-icon-button:not([hidden])'));
        for (let button of buttons.slice(0, -1)) {
            button.style.marginRight = '8px';
        }
    }

    _initScroller() {
        this._scrollHandler = e => {
            if (this.disabled) return;
            let y = this.$.scrollTarget.scrollTop;
            let speed = y - this._lastY;
            if (speed > 25) {
                this.opened = false;
            } else if (speed < -15) {
                this.opened = true;
                this.fabOpened = true;
            } else if (y < 32) {
                this.opened = true;
                this.fabOpened = true;
            }
            this._lastY = y;
        };
    }

    _handleOpened() {
        const container = this.$.actionContainer;
        if (this.opened) {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
        }
    }

    _handleFabOpened() {
        if (!this.querySelector('klog-fab')) return;
        const container = this.$.fabContainer;
        if (this.fabOpened) {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
        }
    }

    reload() {
        this.opened = true;
        this.fabOpened = true;
        this.disabled = false;
    }
}

window.customElements.define(KlogBottomAppBar.is, KlogBottomAppBar);