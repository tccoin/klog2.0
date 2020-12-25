import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class KlogTransferStation extends PolymerElement {

  static get is() { return 'klog-transfer-station'; }

  async update(subroute) {
    console.log(subroute);
  }
}

window.customElements.define(KlogTransferStation.is, KlogTransferStation);