import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '../ui/klog-menu-button.js';
class KlogDropdownMenu extends PolymerElement {
    static get template() {
        return html `
    <style>
    :host {
      display: block;
      box-sizing: border-box;
    }

    klog-menu-button {
      width: 100%;
    }

    klog-input {
      cursor: pointer;
    }

    :host([hidden]) {
      display: none;
    }
    </style>

    <klog-menu-button id="menuButton" vertical-align="{{verticalAlign}}" horizontal-align="{{horizontalAlign}}" vertical-offset="{{verticalOffset}}">
      <klog-input label="{{label}}" id="licenseInput" slot="dropdown-trigger" readonly outlined$="{{outlined}}" value="{{_selected}}">
        <iron-icon icon="keyboard_arrow_down" slot="suffix"></iron-icon>
      </klog-input>
      <slot id="slot" name="dropdown-content" slot="dropdown-content"></slot>
    </klog-menu-button>

`;
    }

    static get is() { return 'klog-dropdown-menu'; }

    ready() {
        super.ready();
        for (let child of this.$.slot.assignedNodes()) {
            child.addEventListener('selected-item-changed', (e) => {
                let item = e.detail.value;
                if (item) {
                    this._selected = this.value || item.innerText;
                    this.$.menuButton.close();
                }
            });
        }

    }

    static get properties() {
        return {
            label: {
                type: String
            },
            value: {
                type: String
            },
            _selected: {
                type: String
            },
            outlined: {
                type: Boolean
            },
            verticalAlign: {
                type: String,
                value: 'top'
            },
            horizontalAlign: {
                type: String,
                value: 'left'
            },
            verticalOffset: {
                type: Number
            },
            horizontalOffset: {
                type: Number
            }
        };
    }
}

window.customElements.define(KlogDropdownMenu.is, KlogDropdownMenu);