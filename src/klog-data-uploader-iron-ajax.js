import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';

class KlogUploader extends PolymerElement {
  static get template() {
    return html`
    <iron-ajax id="ajax" method="post" url="https://storage.krrr.party/upload" handle-as="json" lastprogress="{{progress}}"></iron-ajax>
    progress:{{progress}}
`;
  }

  static get is() { return 'klog-data-uploader'; }

  static get properties() {
    return {
      fileinfo: {
        type: Object,
        notify: true
      },
      bucketname: {
        type: String,
        value: 'klog2'
      },
      remainingNumber: {
        type: Number,
        notify: true
      },
      files: {
        type: Array,
        value: []
      },
      uploading: {
        type: Boolean,
        value: false,
        notify: true
      },
    }
  }

  _onResponse(e) {
    //update fileinfo
    let fileinfo = e.detail.response;
    fileinfo.host = 'https://storage.krrr.party/storage/' + this.bucketname;
    if (fileinfo) {
      fileinfo.remaining = this.files.length != 1;
      fileinfo.timestamp = Date.parse(new Date());
      this.set('fileinfo', fileinfo);
    }
    //fire
    this.dispatchEvent(new CustomEvent('upload-success', { bubbles: true, composed: true, detail: { fileinfo: this.fileinfo } }));
    //upload next file
    this.shift('files');
    this._filesChanged();
    if (this.files.length > 0) {
      this._uploadToServer(this.files[0]);
    } else {
      this.uploading = false;
    }
  }

  upload(file) {
    if (!file) return
    this.push('files', file);
    this._filesChanged();
    if (!this.uploading) {
      this._uploadToServer(this.files[0]);
    }
  }

  _uploadToServer(file) {
    if (!file) return
    this.uploading = true;
    let data = new FormData();
    data.append('file', file);
    data.append('bucketname', this.bucketname);
    this.$.ajax.body = data;
    this.$.ajax.generateRequest();
  }

  _filesChanged() {
    this.remainingNumber = this.files.length;
  }
}

window.customElements.define(KlogUploader.is, KlogUploader);
