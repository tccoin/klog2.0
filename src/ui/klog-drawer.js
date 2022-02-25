import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '../style/klog-style-scrollbar.js';

class KlogDrawer extends PolymerElement {
  static get template() {
    return html `
    <style include="klog-style-scrollbar"></style>
    <style>
      :host {
        display: block;
        color: var(--on-surface);
      }

      app-drawer {
        z-index: 10000;
        user-select: none;
        -webkit-user-select: none;
        --app-drawer-width: 272px;

        --app-drawer-content-container: {
          background: var(--surface);
          @apply --shadow-elevation-16dp;
        }
      }

      .container {
        padding-top: var(--safe-area-inset-top);
        height: var(--klog-layout-page-height);
        overflow: auto;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        user-select: none;
        -webkit-user-select: none;
        cursor: default;
      }

      .title {
        line-height: 32px;
        padding: 16px;
        box-sizing: border-box;
        font-size: 20px;
      }
    </style>
    <app-drawer id="drawer" swipe-open="{{!disabled}}" opened="{{opened}}">
      <div class="container" id="scrollTarget">
        <template is="dom-if" if="{{heading}}">
          <div class="title">{{heading}}</div>
        </template>
        <slot></slot>
      </div>
    </app-drawer>
`;
  }

  static get is() { return 'klog-drawer'; }

  static get properties() {
    return {
      heading: {
        type: String
      },
      disabled: {
        type: Boolean,
        value: false
      },
      opened: {
        type: Boolean
      }
    }
  }

  ready() {
    super.ready();
    this.addEventListener('menu-select', () => this.close());
    this.addEventListener('collection-select', () => this.close());
  }

  toggle() {
    this.$.drawer.toggle();
  }

  open() {
    this.$.drawer.open();
  }

  close() {
    this.$.drawer.close();
  }
}

window.customElements.define(KlogDrawer.is, KlogDrawer);