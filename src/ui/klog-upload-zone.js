import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogUiMixin } from '../framework/klog-ui-mixin.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-ripple/paper-ripple.js';
import './klog-icons.js';
import '../data/klog-data-uploader.js';

class KlogUploadZone extends KlogUiMixin(PolymerElement) {
    static get template() {
        return html `
    <style>
      :host {
        display: block;
        position: relative;
        min-width: 208px;
        border-radius: 16px;
        cursor: default;
        user-select: none;
        -webkit-user-select: none;
      }

      input[type=file] {
        z-index: 100;
        @apply --fit-layout;
        opacity: 0;
        cursor: default;
        outline: none;
        width: 100%;
        height: 100%;
        visibility: visible !important;
      }

      .info {
        padding: 16px 16px 40px;
        text-align: center;
        min-height: 168px;
        box-sizing: border-box;
      }

      iron-icon {
        height: 48px;
        width: 48px;
        padding: 8px;
        border-radius: 50%;
        color: var(--primary);
        transition: box-shadow .3s ease, color .2s ease;
      }

      :host([state=dropover]) iron-icon,
      :host([state=uploading]) iron-icon {
        color: var(--primary);
      }

      .state {
        position: absolute;
        left: 0;
        right: 0;
        color: var(--on-background);
        transition: opacity .25s ease;
      }

      .state.hidden {
        opacity: 0;
      }

      paper-progress {
        margin: 8px auto 0;
        border-radius: 3px;
        --paper-progress-height: 6px;
        --paper-progress-container-color: var(--surface-variant);
        --paper-progress-active-color: var(--on-surface-variant);
        --paper-progress-transition-duration: 0.5s;
        --paper-progress-transition-timing-function: ease-out;
        --paper-progress-transition-delay: 0s;
      }

      @media (min-width: 768px) {
        .moblie-only {
          display: none;
        }
      }

      @media (max-width: 767px) {
        .pc-only {
          display: none;
        }
      }
    </style>
    <klog-data-uploader id="uploader" uploading="{{uploading}}" bucketname="{{bucketname}}" remaining-number="{{remainingNumber}}" fileinfo="{{fileinfo}}" progress="{{progress}}"></klog-data-uploader>
    <input id="input" type="file" on-change="inputChange">
    <div id="info" class="info">
      <iron-icon icon="cloud_upload"></iron-icon>
      <div class="state hidden" name="idle">
        <div class="moblie-only">轻触这里上传</div>
        <div class="pc-only">单击或拖拽至此上传</div>
      </div>
      <div class="state hidden" name="dropover">松手上传</div>
      <div class="state hidden" name="uploading">上传文件至β时间线…（还剩{{remainingNumber}}个）<br>
        <paper-progress value="{{scaleProgress(progress,1000)}}" min="0" max="1000" class="transiting"></paper-progress>
      </div>
    </div>
    <paper-ripple></paper-ripple>
`;
    }

    static get is() { return 'klog-upload-zone'; }

    static get properties() {
        return {
            fileinfo: {
                type: Object,
                notify: true
            },
            state: {
                type: String,
                value: 'idle',
                observer: '_stateChanged',
                reflectToAttribute: true
            },
            bucketname: {
                type: String,
                value: 'klog2'
            },
            remainingNumber: {
                type: Number,
            },
            uploading: {
                type: Boolean,
                observer: '_uploadingChanged',
            }
        };
    }

    ready() {
        super.ready();
        this.addEventListener('dragover', e => this.dragover(e), false);
        this.addEventListener('dragleave', e => this.dragleave(e), false);
        this.addEventListener('drop', e => this.drop(e), false);
        this.$.uploader.addEventListener('upload-error', e=>this.openToast('文件上传不成功：' + e.detail.message));
    }

    dragover(e) {
        this.state = 'dropover';
    }

    dragleave(e) {
        if (this.state == 'dropover') this.state = 'idle';
    }

    drop(e) {
        e.stopPropagation();
        e.preventDefault();
        let files = e.dataTransfer.files;
        this._updateFiles(files);
        this.state = 'uploading';
    }

    click(e) {
        e.stopPropagation();
        console.log(e);
        this.$.input.value = '';
        this.$.input.click();
    }

    inputChange() {
        let files = this.$.input.files;
        this.state = 'uploading';
        this._updateFiles(files);
    }

    _updateFiles(files) {
        for (let file of files) {
            this.$.uploader.upload(file);
        }
    }

    _uploadingChanged(uploading) {
        if (!uploading && this.state != 'dropover') this.state = 'idle';
    }

    _stateChanged(state, oldState) {
        let oldStateElement = this.shadowRoot.querySelector(`.state[name=${oldState}]`);
        let newStateElement = this.shadowRoot.querySelector(`.state[name=${state}]`);
        if (oldState && oldStateElement) oldStateElement.classList.add('hidden');
        if (newStateElement) newStateElement.classList.remove('hidden');
    }

    scaleProgress(progress, scale) {
        return progress * scale;
    }
}

window.customElements.define(KlogUploadZone.is, KlogUploadZone);