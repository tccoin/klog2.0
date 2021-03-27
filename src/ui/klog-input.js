import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '../style/klog-style.js';

class KlogInput extends PolymerElement {
  static get template() {
    return html `
    <style>
      :host {
        display: block;
        margin: 4px 0 16px 0;
      }

      :host([hidden]) {
        display: none;
      }

      :host(:not([outlined])) paper-input {
        background: var(--primary-overlay-color);
        padding-top: 8px;
        border-radius: 4px;

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

      :host([outlined]) paper-input {
        height: 24px;
        background: none;
        padding: 16px 14px 16px;
        border: var(--outlined-border-width) solid var(--outline-color);
        border-radius: 4px;
        transition: border-color .2s ease;

        --paper-input-container: {
          padding: 0;
          margin-top: -20px;
        }

        --paper-input-container-label-floating: {
          transform: translateY(-100%) scale(0.75);
          width: auto;
          padding: 0 8px;
          left: -8px;
          background: var(--klog-input-background-color, var(--primary-background-color));
        }

        --paper-input-container-underline: {
          display: none;
        }

        --paper-input-container-underline-focus: {
          display: none;
        }
      }

      :host([outlined]) paper-input:hover {
        border-color: var(--hover-outline-color);
      }

      :host([outlined]) paper-input[focused] {
        border-color: var(--primary-color);
      }
    </style>
    <paper-input label="{{label}}" placeholder="{{placeholder}}" value="{{value}}" disabled="{{disabled}}" type="{{type}}" name="{{name}}"></paper-input>
`;
  }

  static get is() { return 'klog-input'; }

  static get properties() {
    return {
      label: {
        type: String
      },
      value: {
        type: String,
        notify: true
      },
      type: {
        type: String
      }
    }
  }
}

window.customElements.define(KlogInput.is, KlogInput);