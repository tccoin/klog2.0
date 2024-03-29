import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class KlogRenderTimestamp extends PolymerElement {
    static get template() {
        return html `
    <style>
       :host {
        display: inline;
      }
    </style>
    <slot></slot>{{time}}
`;
    }

    static get is() { return 'klog-render-timestamp'; }

    static get properties() {
        return {
            time: {
                type: String
            }
        };
    }

    ready() {
        super.ready();
        this.autoRefresh();
    }

    static get observers() {
        return [
            '_updateDate(timeStamp)'
        ];
    }

    autoRefresh() {
        setInterval(() => this._updateDate(this.timeStamp), 30000);
    }

    _updateDate(timeStamp) {
        this.time = this._computedDate(timeStamp);
    }

    _computedDate(timeStamp, compact = false) {
        var date = new Date(timeStamp);
        var currentTimeStamp = Date.parse(new Date());
        var d = (currentTimeStamp - timeStamp) / 1000;
        if (typeof (timeStamp) != 'number') {
            return '';
        } else if (d < 60) {
            return '刚刚';
        } else if (d < 3600) {
            return Math.floor(d / 60) + '分钟前';
        } else if (d < 3600 * 48 && new Date().getDate() == date.getDate()) {
            return Math.floor(d / 3600) + '小时前';
        } else if (d < 3600 * 72 && new Date().getDate() - date.getDate() == 1) {
            return '昨天 ' + (compact ? '' : (this._two(date.getHours()) + ':' + this._two(date.getMinutes())));
        } else if (d < 3600 * 96 && new Date().getDate() - date.getDate() == 2) {
            return '前天 ' + (compact ? '' : (this._two(date.getHours()) + ':' + this._two(date.getMinutes())));
        } else if (date.getFullYear() == new Date().getFullYear()) {
            return (date.getMonth() + 1) + '.' + date.getDate();
        } else {
            return date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate();
        }
    }

    _two(num) {
        if (num < 10) return '0' + num;
        return num;
    }
}

window.customElements.define(KlogRenderTimestamp.is, KlogRenderTimestamp);