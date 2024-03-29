import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/app-storage/app-localstorage/app-localstorage-document.js';
import '../style/klog-style-layout.js';
import '../style/klog-style-card.js';
import '../ui/klog-icons.js';

class KlogAppsCalendar extends PolymerElement {
    static get template() {
        return html`
    <style include="klog-style-layout"></style>
    <style include="klog-style-card"></style>
    <style>
      :host {
        display: flex;
        justify-content: center;
        background-color: #000;
        color: #FFF;
        height: var(--klog-layout-page-height);
        padding: 0;
      }

      .main-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        max-width: 720px;
        margin: auto;
        cursor: default;
        user-select: none;
        -webkit-user-select: none;
      }

      .main-container .time {
        font-size: 15em;
        font-family: "product sans", "Roboto";
        margin: 0;
      }

      .main-container .disabled-button {
        position: fixed;
        bottom: 32px;
      }
    </style>

    <app-localstorage-document key="calendar-fullscreen-disabled" data="{{disabled}}"></app-localstorage-document>
    <div class="main-container">
      <h1 class="time">{{hour}}:{{minute}}</h1>
      <paper-toggle-button class="disabled-button" checked="{{!disabled}}"></paper-toggle-button>
    </div>
`;
    }

    static get is() { return 'klog-apps-calendar'; }

    static get properties() {
        return {
            minute: {
                type: Number,
            },
            hour: {
                type: Number,
            },
            disabled: {
                type: Boolean,
                value: false
            },
            autoFullscreenTime: {
                type: Number,
                value: 1000
            },
        };
    }

    ready() {
        super.ready();
        this.ticktock();
        setInterval(() => this.ticktock(), 1000);
        this._moveTimeout = setTimeout(() => this.activate(), this.autoFullscreenTime);
        // this.addEventListener('mousemove', () => this.moveHandle());
        // this.addEventListener('click', () => this.deactivate());
        this.addEventListener('click', () => this.moveHandle());
    }

    moveHandle() {
        if (this._moveTimeout) {
            clearTimeout(this._moveTimeout);
        }
        this._moveTimeout = setTimeout(() => this.activate(), this.autoFullscreenTime);
    }

    activate() {
        if (!this.disabled) {
            this.requestFullscreen();
            this._deactivateDisabled = true;
            this.removeEventListener('mousemove', () => this.moveHandle());
            setTimeout(() => this._deactivateDisabled = false, 1000);
        }
    }

    deactivate() {
        if (document.fullscreenElement && !this._deactivateDisabled) {
            document.exitFullscreen();
        }
    }

    _makezero(number, totalLength) {
        return '0'.repeat(totalLength - String(number).length) + String(number);
    }

    ticktock() {
        const now = new Date();
        this.hour = this._makezero(now.getHours(), 2);
        this.minute = this._makezero(now.getMinutes(), 2);
    }
}

window.customElements.define(KlogAppsCalendar.is, KlogAppsCalendar);
