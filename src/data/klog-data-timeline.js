import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import './klog-data-list.js';

class KlogDataTimeline extends PolymerElement {
    static get template() {
        return html`
    <klog-data-list id="list" type="timeline" last-response="{{lastResponse}}" loading="{{loading}}" keyword="{{keyword}}" key="updatedTime"></klog-data-list>
`;
    }

    static get is() { return 'klog-data-timeline'; }

    static get properties() {
        return {
            loading: {
                type: Boolean,
                value: true,
                notify: true,
            },
            lastResponse: {
                type: Array,
                notify: true
            },
            keyword: {
                type: String
            }
        };
    }

    load() {
        this.$.list.select = ['type', 'detail', 'referTo', 'author', 'title', 'text', 'createTime', 'markdown', 'type', 'image', 'topic', 'path', 'collection', 'updatedTime', 'attachments', 'collection', 'tags'];
        this.$.list.include = ['author', 'topic'];
        return this.$.list.load();
    }
}

window.customElements.define(KlogDataTimeline.is, KlogDataTimeline);
