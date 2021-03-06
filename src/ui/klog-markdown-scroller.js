import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogUiMixin } from '../framework/klog-ui-mixin.js';

class klogMarkdownScroller extends KlogUiMixin(PolymerElement) {
  static get template() {
    return html `
    <div id="toastContainer"></div>
`;
  }

  static get is() { return 'klog-markdown-scroller'; }

  static get properties() {
    return {
      linkPrefix: {
        type: String
      }
    }
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
      const y = scrollTarget.scrollTop + element.getBoundingClientRect().top - htmlFix;
      scrollTarget.scrollTop = y;
    }
  }

  calcOffsetTop(element) {
    let offsetTop = 0;
    while (element) {
      offsetTop += element.offsetTop
    }
  }

  generateLink(hash) {
    let link = `${window.location.href.replace(/#.*/, '')}#/${this.linkPrefix}/${hash}`;
    this.openToast('复制链接到剪贴板？', {
      title: '确定',
      href: link,
      onclick: e => {
        e.preventDefault();
        const input = document.createElement('input');
        input.style.position = 'fixed';
        input.style.top = 0;
        input.style.opacity = 0;
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('value', e.target.href);
        document.body.appendChild(input);
        input.setSelectionRange(0, 9999);
        input.focus();
        document.execCommand('copy');
        document.body.removeChild(input);
        this.openToast('已复制');
        this.updateQueryByHash(hash);
        this.scroll();
      }
    });
  }

}

window.customElements.define(klogMarkdownScroller.is, klogMarkdownScroller);