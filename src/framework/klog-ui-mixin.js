import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

const UiMixin = (superClass) => class extends superClass {

  initUiEvent() {
    this.addEventListener('toast-open', e => this._openToast(e.detail.text, e.detail.link, e.detail.option));
    this.addEventListener('drawer-open', e => this._openDrawer(e.detail.heading, e.detail.menu, e.detail.option));
  }

  _openToast(text, link, option = {}) {
    const toast = document.createElement('paper-toast');
    Object.assign(toast, { text: text, duration: 2000, withBackdrop: false }, option);
    if (link) {
      toast.innerHTML = `<a ${link.href ? 'href='+link.href : ''}>${link.title}</a>`;
      toast.querySelector('a').addEventListener('click', e => link.onclick(e));
    }
    this.shadowRoot.append(toast);
    toast.addEventListener('opened-changed', function(e) {
      if (!e.detail.value) {
        this.parentNode.removeChild(this);
      }
    });
    toast.open();
  }

  openToast(text, link, option = {}) {
    this.dispatchEvent(new CustomEvent('toast-open', { bubbles: true, composed: true, detail: { text, link, option } }));
  }

  _openDrawer(heading, items, option = {}) {
    const drawer = document.createElement('klog-drawer');
    const menu = document.createElement('klog-menu');
    Object.assign(drawer, { heading, withBackdrop: true }, option);
    menu.items = items;
    drawer.append(menu);
    this.shadowRoot.append(drawer);
    drawer.addEventListener('opened-changed', function(e) {
      if (!e.detail.value) {
        this.parentNode.removeChild(this);
      }
    });
    drawer.open();
  }

  openDrawer(heading, menu, option = {}) {
    this.dispatchEvent(new CustomEvent('drawer-open', { bubbles: true, composed: true, detail: { heading, menu, option } }));
  }


}

export const KlogUiMixin = dedupingMixin(UiMixin);