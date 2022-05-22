import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-ripple/paper-ripple.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
const containerKlogFab = document.createElement('template');

containerKlogFab.innerHTML = `<dom-module id="klog-fab">
  <template strip-whitespace="">
    <style include="paper-material-styles">
      :host {
        @apply --layout-horizontal;
        @apply --layout-center-center;

        background: var(--klog-fab-background, var(--primary));
        border-radius: 16px;
        box-sizing: border-box;
        color: var(--on-primary);
        cursor: pointer;
        height: 56px;
        width: 56px;
        min-width: 0;
        outline: none;
        padding: 16px;
        position: relative;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
        -webkit-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        -webkit-user-select: none;
        z-index: 0;
        transition: all .15s ease-out;
        transform: scale(1) translateY(0px);
        opacity: 1;

        /* NOTE: Both values are needed, since some phones require the value \`transparent\`. */
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-tap-highlight-color: transparent;
      }

      iron-icon {
        width: 24px;
        width: 24px;
        box-sizing: border-box;
        flex-shrink: 0;
        transition: all 150ms ease;
      }

      .label-container {
        overflow: hidden;
      }

      #label {
        opacity: 0;
        white-space: nowrap;
        overflow: hidden;
        text-align: center;
        font-weight: bold;
        transition: all 150ms ease;
      }

      :host([extended]) iron-icon {
        margin-right: 12px;
      }

      :host([extended]) #label {
        opacity: 1;
      }

      :host([hidden]) {
        transform: scale(0);
        opacity: 0;
      }

      [hidden] {
        display: none !important;
      }

      :host([disabled]) {
        color: var(--klog-fab-disabled-text, var(--paper-grey-500));
        background: var(--klog-fab-disabled-background, var(--paper-grey-300));

        @apply --klog-fab-disabled;
      }

      :host {
        @apply(--shadow-elevation-2dp);
      }

      :host(:hover) {
        @apply(--shadow-elevation-8dp);
      }

      :host(:active) {
        @apply(--shadow-elevation-4dp);
      }
    </style>

    <iron-icon id="icon" src="[[src]]" icon="[[icon]]"></iron-icon>
    <div class="label-container">
      <span id="label">{{label}}</span>
    </div>
    <paper-ripple></paper-ripple>
  </template>


</dom-module>`;

document.head.appendChild(containerKlogFab.content);
class KlogFab extends PolymerElement {

  static get is() { return 'klog-fab'; }

  static get properties() {
    return {
      icon: {
        type: String,
        value: ''
      },
      label: {
        type: String
      },
      extended: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      hidden: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
  }

  static get observers() {
    return [
      '_updateStyle(extended,label,hidden)'
    ];
  }

  _updateStyle() {
    let width;
    if (this.extended) {
      this._labelWidth = this.$.label.offsetWidth || this._labelWidth;
      if (!this._labelWidth && this.label && !this.hidden) {
        setTimeout(() => this._updateStyle(), 10);
        return;
      }
      width = 68 + this._labelWidth;
    } else {
      width = 56;
    }
    this.style.width = width + 'px';
  }
}
window.customElements.define(KlogFab.is, KlogFab);
