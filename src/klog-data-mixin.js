import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

const DataMixin = (superClass) => class extends superClass {

  static get properties() {
    return {
      lastResponse: {
        type: Array
      },
      errorCode: {
        type: Number
      },
    }
  }

  static get observers() {
    return ['_dataErrorHandle(errorCode)'];
  }

  _dataErrorHandle(errorCode) {
    this.dispatchEvent(new CustomEvent('data-error', {
      bubbles: true,
      composed: true,
      detail: { errorCode }
    }));
  }

}

export const KlogDataMixin = dedupingMixin(DataMixin);
