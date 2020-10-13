import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-dialog/paper-dialog.js';
import './klog-icons.js';

class KlogMenu extends PolymerElement {
  static get template() {
    return html`
    <style include="klog-style-scrollbar"></style>
    <style>
      :host {
        display: block;
        color: var(--primary-text-color);
      }

      iron-selector>.divider {
        margin: 8px 0;
        border-top: 1px solid var(--divider-color);
      }

      .subtitle {
        position: relative;
        display: flex;
        align-items: center;
        height: 24px;
        font-size: .9em;
        padding: 16px 16px 8px;
        overflow: hidden;
        color: var(--secondary-text-color);
      }

      .subtitle.button {
        padding: 16px;
      }

      .subtitle>.divider {
        width: 16px;
      }

      .label-item-container {
        overflow: hidden;
        transition: all .2s ease;
      }

      :host([collapsed]) .label-item-container {
        height: 0 !important;
      }

      .subtitle.button .collapsed-icon {
        transform: rotate(0);
        transition: all .2s ease;
      }

      :host([collapsed]) .subtitle.button .collapsed-icon {
        transform: rotate(90deg);
      }

      .item {
        position: relative;
        line-height: 32px;
        padding: 6px 8px;
        margin: 4px 8px;
        border-radius: 5px;
        box-sizing: border-box;
        overflow: hidden;
        font-size: 14px;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        -webkit-user-select: none;
        -webkit-tap-highlight-color: transparent;
      }

      .item.raised {
        background: var(--primary-color);
        color: #FFF;
        @apply(--shadow-elevation-4dp);
      }

      :host([round]) .item {
        padding: 4px 12px;
        margin: 4px 8px 0 0;
        border-radius: 0 22px 22px 0;
      }

      .item span {
        user-select: none;
        -webkit-user-select: none;
      }

      .item iron-icon {
        margin-right: 16px;
      }

      .item::after {
        @apply --overlay-style;
        opacity: 0;
      }

      .item:not(.iron-selected):hover::after {
        opacity: var(--secondary-overlay-opacity);
      }

      .item.iron-selected {
        font-weight: bolder;
        color: var(--primary-color);
        cursor: default;
      }

      .item.iron-selected::after {
        opacity: var(--secondary-overlay-opacity);
        background-color: var(--primary-color);
      }

      .item.secondary iron-icon {
        opacity: 0.6;
      }
    </style>
    <iron-selector id="itemsSelector" attr-for-selected="name" selected="{{itemsSelected}}" on-iron-select="itemsSelect">
      <div name="idle" id="idle"></div>
      <template is="dom-repeat" items="{{menu}}">
        <template is="dom-if" if="{{item.divider}}">
          <div class="divider"></div>
        </template>

        <template is="dom-if" if="{{item.subtitle}}">
          <div class="subtitle"><span>{{item.text}}</span></div>
        </template>

        <template is="dom-if" if="{{item.item}}">
          <div
            class\$="{{item.className}}"
            name\$="{{item.name}}"
            category\$="{{item.category}}"
            path\$="{{item.path}}"
            style\$="{{item.style}}"
          >
            <iron-icon icon="{{item.icon}}"></iron-icon>
            <span>{{item.text}}</span>
            <paper-ripple></paper-ripple>
          </div>
        </template>

      </template>
    </iron-selector>
`;
  }

  static get is() { return 'klog-menu'; }

  static get properties() {
    return {
      page: {
        type: String
      },
      login: {
        type: Boolean,
        value: false
      },
      items: {
        type: Object,
        observer: '_calcMenu'
      },
      menu: {
        type: Array,
        value: []
      }
    }
  }

  _calcMenu(items) {
    this._items = items;
    const menu = [];
    let hasRaised = false;
    for (let category of items) {
      if (menu.length != 0) {
        menu.push({
          divider: true
        });
      }
      if (category.text) {
        menu.push({
          subtitle: true,
          name: category.name,
          text: category.text
        });
      }
      for (let item of category.items) {
        let className = 'item';
        if (item.raised && !hasRaised) {
          hasRaised = true;
          className += ' raised';
        }
        menu.push({
          item: true,
          name: item.name,
          text: item.text,
          icon: item.icon,
          category: category.name,
          className: className,
          style: category.style || '',
          path: item.path || ''
        });
      }
    }
    this.set('menu', menu);
  }

  updatePage(e) {
    const name = e.detail.item.getAttribute('name');
    if (name) {
      this.dispatchEvent(new CustomEvent('app-load', {
        bubbles: true,
        composed: true,
        detail: { page: name }
      }));
      this.dispatchEvent(new CustomEvent('menu-select', { bubbles: true, composed: true }));
    }
  }

  itemsSelect(e) {
    const item = e.detail.item;
    const name = item.getAttribute('name');
    const path = item.getAttribute('path');
    const selectable = item.getAttribute('selectable');
    if (name == 'idle') { return; }
    else { this.$.itemsSelector.selected = 'idle'; }
    const category = item.getAttribute('category');
    if (category && name) {
      if (path) {
        this.dispatchEvent(new CustomEvent('app-load', {
          bubbles: true,
          composed: true,
          detail: { page: path }
        }));
      }
      this.dispatchEvent(new CustomEvent('menu-select', {
        bubbles: true,
        composed: true,
        detail: {
          category: category,
          item: name,
          target: item
        }
      }));
    }
  }
}

window.customElements.define(KlogMenu.is, KlogMenu);