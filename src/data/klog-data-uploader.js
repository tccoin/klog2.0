import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import HugeUploader from 'huge-uploader';
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
            chunkSize: {
                type: Number,
                value: 1
            },
            maxSize: {
                type: Number,
                value: 100
            }
        };
    }

    test() {
        // instanciate the module with a settings object

        // subscribe to events
    }

    upload(file) {
        if (!file) return;
        this.push('files', file);
        this._updateUI();
        if (!this.uploading) {
            this._upload(this.files[0]);
        }
    }

    _upload(file) {
        if (!file) return;
        this.uploading = true;
        let size = file.size;
        if (size > this.maxSize * 1024 * 1024) {
            this.dispatchEvent(new CustomEvent('upload-error', { bubbles: true, composed: true, detail: { message: 'file too large' } }));
            this._uploadNext();
        }

        const uploader = new HugeUploader({
            endpoint: `${this.host}/upload`,
            file,
            chunkSize: this.chunkSize,
            postParams: {
                bucketname: this.bucketname,
                name: encodeURIComponent(file.name)
            }
        });

        uploader.on('error', (e) => {
            this.dispatchEvent(new CustomEvent('upload-error', { bubbles: true, composed: true, detail: { message: e.detail } }));
            this._uploadNext();
        });

        uploader.on('progress', (e) => {
            this.progress = e.detail;
        });

        uploader.on('finish', (body) => {
            try {
                let fileinfo = JSON.parse(body.detail)[0];
                fileinfo.host = 'https://storage.krrr.party/storage/' + this.bucketname;
                fileinfo.remaining = this.files.length != 1;
                fileinfo.timestamp = Date.parse(new Date());
                this.set('fileinfo', fileinfo);
                this.dispatchEvent(new CustomEvent('upload-success', { bubbles: true, composed: true, detail: { fileinfo: this.fileinfo } }));
            } catch (error) {
                console.log(error);
                this.dispatchEvent(new CustomEvent('upload-error', { bubbles: true, composed: true, detail: { message: error.message } }));
            }
            this._uploadNext();
        });
    }

    _uploadNext() {
        this.shift('files');
        this._updateUI();
        if (this.files.length > 0) {
            this._upload(this.files[0]);
        } else {
            this.uploading = false;
        }
    }

    _updateUI() {
        this.remainingNumber = this.files.length;
    }

}

window.customElements.define(KlogUploader.is, KlogUploader);
