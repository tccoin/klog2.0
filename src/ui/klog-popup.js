import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { IronFitBehavior } from '@polymer/iron-fit-behavior/iron-fit-behavior.js';
import { IronOverlayBehavior } from '@polymer/iron-overlay-behavior/iron-overlay-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

class KlogPopup extends mixinBehaviors(IronOverlayBehavior, PolymerElement) {
  static get template() {
    return html`
    <style>
      :host{
        max-width: 300px;
        z-index: 10;
      }

      #container {
        width: 100%;
        box-sizing: border-box;
        text-align: justify;
        font-size: calc(var(--klog-markdown-font-size, 14px) * 0.9);
        font-weight: normal;
        padding: 8px;
        word-break: break-all;
        line-height: 1.7;
        border-radius: 4px;
        z-index: 10;
        cursor: default;
        color: var(--on-surface);
        background: var(--surface);
        box-shadow: 0 20px 30px -5px rgba(0, 0, 0, 0.3), 0 0 1px 1px rgba(0, 0, 0, 0.05);
      }

      :host([theme~=dark]) #container {
        background: var(--on-secondary-container);
      }

      :host([tooltip]) #container {
        background: var(--on-secondary-container);
      }

      #arrow {
        position: relative;
        z-index: 9;
      }

      #arrow::before {
        content: '';
        position: absolute;
        border: 6px solid transparent;
        border-top: 0;
        border-bottom: 7px solid rgba(0, 0, 0, 0.05);
        transform: translate(8px, -100%);
      }

      #arrow::after {
        content: '';
        position: absolute;
        border: 6px solid transparent;
        border-top: 0;
        border-bottom: 8px solid var(--surface);
        transform: translate(8px, -70%);
      }

      :host([theme~=dark]) #arrow::after{
        border-bottom: 8px solid var(--on-secondary-container);
      }
    </style>
    <!--<div id="arrow"></div>-->
    <div id="container">
      <slot></slot>
    </div>
    `;
  }

  static get is() { return 'klog-popup'; }

  static get properties() {
    return {
      for: {
        type: String
      },
      tooltip: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      }
    }
  }

  ready() {
    super.ready();
    this.noOverlap = true;
    this.horizontalAlign = 'left';
    this.verticalAlign = 'auto';
    this.dynamicAlign = true;
    this.addEvent();
  }

  addEvent() {
    if (this.parentElement) {
      const trigger = this.parentElement.querySelector(`[id="${this.for}"]`);
      if (trigger) {
        trigger.addEventListener('mouseover', () => this.open());
        this.parentElement.addEventListener('mouseleave', () => this.close());
      }
    }
  }

}

window.customElements.define(KlogPopup.is, KlogPopup);
