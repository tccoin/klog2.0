import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import './klog-style-layout.js';
import './klog-data-car.js';
import './klog-data-tag.js';

class KlogDrive extends PolymerElement {
  static get template() {
    return html`
    <style include="klog-style-layout"></style>
    <style>
      :host {
        display: block;
      }

      app-header {
        box-shadow: none;
        background: transparent;
      }
    </style>

    <app-header fixed="">
      <app-toolbar>
        <paper-icon-button icon="menu" on-click="openDrawer"></paper-icon-button>
        <div class="title">
          <div main-title="">
            <iron-icon icon="klog"></iron-icon>
          </div>
          <div class="divider"></div>
          <div page-title="">Drive</div>
        </div>
      </app-toolbar>
    </app-header>

    <klog-data-car cars="{{cars}}"></klog-data-car>

    <template is="dom-repeat" items="{{cars}}">
      {{item.filename}}
    </template>
`;
  }

  static get is() { return 'klog-drive'; }

  ready() {
    super.ready();
  }
}

window.customElements.define(KlogDrive.is, KlogDrive);
