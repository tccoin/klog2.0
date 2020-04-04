import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
class KlogUploader extends PolymerElement {

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
      progress: {
        type: Number,
        value: 0,
        notify: true
      },
      host: {
        type: String,
        value: ''
      },
      shardSize: {
        type: Number,
        value: 20 * 1024 * 1024
      }
    }
  }

  _onResponse(response) {
    //update fileinfo
    let fileinfo = response[0];
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
    let size = file.size;
    let name = encodeURIComponent(file.name);
    let shardCount = Math.ceil(size / this.shardSize);
    let start = 0;
    for (let i = 0; i < shardCount; i++) {
      let stop = start + this.shardSize + i;
      let part = file.slice(start, Math.min(size, stop));
      start = stop;
      this._uploadPart(part, name, shardCount, i);
    }
  }

  _uploadPart(part, name, total, index) {
    let request = new XMLHttpRequest();
    let data = new FormData();
    data.append('file', part);
    request.addEventListener('load', () => {
      if (request.response.length) {
        this._onResponse(request.response);
      }
    });

    this._progresses = new Array(total);
    request.upload.addEventListener('progress', (e) => {
      let progresses = this._progresses;
      let i = e.total - this.shardSize - 192;
      if (i < 0) i = total - 1;
      progresses[i] = e.loaded / e.total;
      this.progress = progresses.reduce((x, y) => x + y) / progresses.length;
    });
    request.responseType = 'json';
    request.open('POST', `${this.host}/upload?bucketname=${this.bucketname}&name=${name}&total=${total}&index=${index}`);
    request.send(data);
  }

  _filesChanged() {
    this.remainingNumber = this.files.length;
  }

}

window.customElements.define(KlogUploader.is, KlogUploader);
