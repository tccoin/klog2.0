import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '../lib/web-animations-next-lite.min.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';

class KlogDropdownMenu extends PolymerElement {
  static get template() {
    return html `
    <style>
      :host {
        display: block;
        margin: 0 0 16px 0;
      }

      :host([hidden]) {
        display: none;
      }

      paper-dropdown-menu {
        width: 100%;
      }

      :host(:not([outlined])) paper-dropdown-menu {
        background: var(--primary-overlay-color);
        padding-top: 8px;
        border-radius: 4px;

        /*dropdown-menu*/
        --paper-dropdown-menu-ripple: {
          top: -8px;
          bottom: 0;
          border-radius: 4px 4px 0 0;
        }

        /*input*/
        --paper-input-container-underline: {
          border-color: var(--secondary-overlay-color);
        }

        --paper-input-container: {
          padding: 0;
        }

        --paper-input-container-label: {
          padding: 0 16px;
          box-sizing: border-box;
          transform: translate(0, -7px);
        }

        --paper-input-container-label-floating: {
          padding: 0 16px;
          box-sizing: border-box;
        }

        --paper-input-container-input: {
          padding: 0 12px 8px;
          box-sizing: border-box;
        }
      }

      :host([outlined]) paper-dropdown-menu {
        height: 24px;
        width: calc(100% - 32px);
        background: none;
        padding: 16px 14px 16px;
        border: var(--outlined-border-width) solid var(--secondary-overlay-color);
        border-radius: 4px;
        transition: border-color .2s ease;


        /*dropdown-menu*/
        --paper-dropdown-menu-ripple: {
          display: none;
        }

        /*input*/
        --paper-input-container: {
          padding: 0;
          margin-top: -20px;
        }

        --paper-input-container-label-floating: {
          transform: translateY(-100%) scale(0.75);
          width: auto;
          padding: 0 8px;
          left: -8px;
          background: var(--primary-background-color);
        }

        --paper-input-container-underline: {
          display: none;
        }

        --paper-input-container-underline-focus: {
          display: none;
        }
      }

      :host([outlined]) paper-dropdown-menu:hover {
        border-color: var(--primary-text-color);
      }

      :host([outlined]) paper-dropdown-menu[focused] {
        border-color: var(--primary-color);
      }
    </style>
    <paper-dropdown-menu id="menu" label="{{label}}" vertical-align="{{verticalAlign}}" horizontal-align="{{horizontalAlign}}" vertical-offset="{{verticalOffset}}">
      <div slot="dropdown-content">
        <slot id="content" name="dropdown-content" slot="dropdown-content"></slot>
      </div>
    </paper-dropdown-menu>
`;
  }

  static get is() { return 'klog-dropdown-menu'; }

  ready() {
    super.ready();
  }

  static get properties() {
    return {
      label: {
        type: String
      },
      verticalAlign: {
        type: String
      },
      horizontalAlign: {
        type: String
      },
      verticalOffset: {
        type: Number
      },
      horizontalOffset: {
        type: Number
      }
    }
  }

  static get observers() {
    return [
      'updatehorizontalOffset(horizontalOffset)',
    ]
  }

  updatehorizontalOffset() {
    this.$.menu.$.menuButton.$.dropdown.horizontalOffset = this.horizontalOffset;
  }
}

window.customElements.define(KlogDropdownMenu.is, KlogDropdownMenu);