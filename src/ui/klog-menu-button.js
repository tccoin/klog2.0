import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-dropdown/iron-dropdown.js';
import '../style/klog-style-card.js';

class KlogMenuButton extends PolymerElement {
  static get template() {
    return html `
      <style include="klog-style-card"></style>
      <style>
        :host {
            display: inline-block;
            position: relative;
        }
      </style>
  
      <div on-click="toggle">
        <slot name="dropdown-trigger"></slot>
      </div>
      <iron-dropdown id="dropdown" opened="{{opened}}">
        <div slot="dropdown-content" class="dropdown-content klog-card">
            <slot id="content" name="dropdown-content"></slot>
        </div>
      </iron-dropdown>
    `;
  }

  static get is() { return 'klog-menu-button'; }

  static get properties() {
    return {
      opened: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    }
  }

  ready() {
    super.ready();
    this.positionTarget = this.$.container;
    this.sizingTarget = this.$.container;
  }

  toggle() {
    this.opened = !this.opened;
  }
}
customElements.define(KlogMenuButton.is, KlogMenuButton);