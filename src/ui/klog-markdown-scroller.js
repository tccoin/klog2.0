import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogUiMixin } from '../framework/klog-ui-mixin.js';

class klogMarkdownScroller extends KlogUiMixin(PolymerElement) {

    static get is() { return 'klog-markdown-scroller'; }

    static get properties() {
        return {
            linkPrefix: {
                type: String
            },
            scrollBias: {
                type: Number,
                value: 0
            }
        };
    }


    ready() {
        this.$ = {};
    }

    updateQuery(query) {
        this.query = query;
    }

    updateQueryByHash(hash) {
        if (!hash || hash == '/') {
            this.query = '';
        } else {
            this.query = hash.replace(/^id-/, '#').replace(/^class-/, '.');
        }
    }

    reset() {
        this.query = '';
    }

    scroll() {
        const query = this.query;
        if (!query) return;
        const element = this.$.markdown.$.content.querySelector(query);
        if (element) {
            const scrollTarget = this.$.target;
            //html will move while scrolling
            const htmlFix = scrollTarget.tagName == 'HTML' ? 0 : scrollTarget.getBoundingClientRect().top;
            const y = scrollTarget.scrollTop + element.getBoundingClientRect().top - htmlFix + this.scrollBias;
            scrollTarget.scrollTop = y;
        }
    }

    generateLink(hash) {
        let link = `${window.location.href.replace(/#.*/, '')}#/${this.linkPrefix}/${hash}`;
        this.copy(link);
        this.openToast('已复制分享链接');
    }

}

window.customElements.define(klogMarkdownScroller.is, klogMarkdownScroller);