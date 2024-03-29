import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '../ui/klog-render-timestamp.js';

import '../lib/clamp.js';
class KlogNoteItem extends PolymerElement {
    static get template() {
        return html`
    <style>
      :host {
        display: block;
        position: relative;
        padding: 8px 16px;
        cursor: default;
        user-select: none;
        -webkit-user-select: none;
        overflow: hidden;
      }

      :host([hidden]) {
        opacity: 0;
      }

      [hidden] {
        display: none !important;
      }

      .title {
        font-size: 16px;
        color: var(--on-surface);
      }

      .secondary {
        max-height: 56.5px;
        font-size: 12px;
        color: var(--on-background);
      }

      klog-render-timestamp {
        color: var(--primary);
        padding-right: 4px;
      }

      iron-icon {
        width: 12px;
        height: 12px;
        padding-right: 4px;
        vertical-align: text-top;
        color: var(--primary);
      }
    </style>
    <div class="title">
      {{data.title}}
    </div>
    <div class="secondary">
      <klog-render-timestamp time-stamp="{{parseDate(data.createdAt)}}"></klog-render-timestamp>
      <iron-icon icon="bookmark" hidden\$="{{!data.bookmarks}}"></iron-icon>
      <div id="text" hidden\$="{{data.bookmarks}}">{{data.text}}</div>
    </div>
    <paper-ripple></paper-ripple>
`;
    }

    static get is() { return 'klog-note-item'; }

    static get properties() {
        return {
            selected: {
                type: Boolean,
                notify: true
            },
        };
    }

    ready() {
        super.ready();
        setTimeout(() => $clamp(this.$.text, { clamp: 2 }), 1);
        this.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('note-select-page', { bubbles: true, composed: true, detail: { selected: 1 } }));
            this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: 'note/' + this.collection + '/' + this.data.path } }));
        });
    }

    parseDate(date) {
        return Date.parse(date);
    }
}

window.customElements.define(KlogNoteItem.is, KlogNoteItem);
