import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import './klog-icons.js';
import '../style/klog-style.js';

class KlogChip extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: inline-block;
        user-select: none;
        -webkit-user-select: none;
        cursor: default;
        outline: none;
        overflow: hidden;
        --klog-chip-border-radius: 24px;
      }

      .container {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
      }

      iron-icon {
        height: var(--klog-chip-icon-size, 24px);
        width: var(--klog-chip-icon-size, 24px);
        flex-shrink: 0;
      }

      :host([label]) iron-icon {
        margin-right: 4px;
      }

      .checkmark {
        width: 0;
        height: 24px;
        vertical-align: middle;
        color: var(--on-surface);
        -webkit-transition: width .15s cubic-bezier(.4, 0, .2, 1);
        -o-transition: width .15s cubic-bezier(.4, 0, .2, 1);
        transition: width .15s cubic-bezier(.4, 0, .2, 1);
      }

      :host([active]) .checkmark {
        width: 24px;
      }

      .checkmark path {
        -webkit-transition: stroke-dashoffset .15s cubic-bezier(.4, 0, .6, 1) 50ms;
        -o-transition: stroke-dashoffset .15s 50ms cubic-bezier(.4, 0, .6, 1);
        transition: stroke-dashoffset .15s cubic-bezier(.4, 0, .6, 1) 50ms;
        stroke-width: 2px;
        stroke-dashoffset: 29.78334;
        stroke-dasharray: 29.78334;
        stroke: var(--klog-chip-text-color, --on-surface);
      }

      :host([active]) .checkmark path {
        stroke-dashoffset: 0;
        stroke: var(--primary);
      }

      .checkmark[hidden] {
        display: none;
      }

      :host .expand-container {
        overflow: hidden;
        display: flex;
        width: 0px;
        transition: width .15s cubic-bezier(.4, 0, .6, 1) 50ms;
      }

      :host([active]) .expand-container {
        width: var(--klog-chip-expand-width, 0px);
      }

      paper-button {
        padding: 6px 16px;
        font-size: 18px;
        margin: 0;
        min-width: auto;
        color: var(--klog-chip-text-color, var(--on-surface));
        overflow: hidden;
        text-transform: none;
        background: transparent;
        width: 100%;
        outline: none;
        @apply --klog-chip-style;
        border-radius: var(--klog-chip-border-radius);
      }

      paper-button::after {
        @apply --overlay-style;
        z-index: -1;
        background-color: var(--klog-chip-background-color);
        opacity: var(--klog-chip-background-opacity);
      }

      :host([disabled]) paper-button {
        color: var(--disabled-text-color);
      }

      :host([active]) paper-button {
        color: var(--primary);
      }

      :host([active]) paper-button::after {
        @apply --overlay-style-selected;
      }

      :host([outlined]) paper-button {
        border: var(--outlined-border-width) solid var(--outline, --divider);
      }

      :host([outlined]) paper-button::after {
        opacity: 0;
      }

      :host([outlined][active]) paper-button {
        border: var(--outlined-border-width) solid var(--primary);
      }
    </style>

    <paper-button disabled="{{disabled}}">
      <svg class="checkmark" hidden\$="{{checkmarkAnimationDisabled}}" viewBox="-2 -3 30 30">
        <path fill="none" stroke="black" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
      </svg>
      <template is="dom-if" if="{{icon}}">
        <iron-icon icon="{{icon}}"></iron-icon>
      </template>

      <div class="container">
        {{label}}
        <slot></slot>
      </div>
      <div class="expand-container">
        <slot name="expand-content"></slot>
      </div>
    </paper-button>
`;
  }

  static get is() { return 'klog-chip'; }

  static get properties() {
    return {
      active: {
        type: Boolean,
        reflectToAttribute: true
      },
      disabled: {
        type: Boolean,
        reflectToAttribute: true
      },
      checkmarkAnimationDisabled: {
        type: Boolean,
        value: false
      },
      icon: {
        type: String
      },
      label: {
        type: String,
        reflectToAttribute: true
      },
      href: {
        type: String
      },
    };
  }

  ready() {
    super.ready();
    this.addEventListener('click', e => {
      if (this.href) {
        e.stopPropagation();
        e.preventDefault();
        window.open(this.href);
      }
    });
  }
}

window.customElements.define(KlogChip.is, KlogChip);