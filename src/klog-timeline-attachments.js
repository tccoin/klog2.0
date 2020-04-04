import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class KlogTimelineAttachments extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
      }

      .app-grid {
        position: relative;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: calc(100% + 1px);
        overflow: hidden;
        transition: height 0.2s ease;
      }

      .attachments-item {
        position: relative;
        overflow: hidden;
        flex-shrink: 0;
        margin-right: var(--app-grid-gutter);
        margin-bottom: var(--app-grid-gutter);
        flex-basis: calc(100% / var(--app-grid-columns) - var(--app-grid-gutter));
      }

      .attachments-item::before {
        content: '';
        display: block;
        padding-bottom: 100%;
      }

      .attachments-item>* {
        @apply --fit-layout;
      }

      .attachments-item[image] img {
        width: 100%;
      }

      .attachments-item[file] {
        background: var(--primary-color);
      }

      .attachments-item[file] a {
        cursor: default;
        z-index: 10;
      }

      .attachments-item[file] iron-icon {
        fill: var(--accent-color);
        border-radius: 50%;
        padding: 25%;
        width: 50%;
        height: 50%;
      }

      .attachments-expend-button {
        position: absolute;
        bottom: 0;
        overflow: hidden;
        width: 100%;
        height: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, .3);
        color: var(--dark-theme-text-color);
        user-select: none;
        -webkit-user-select: none;
        cursor: default;
        transition: height 0.2s ease, opacity 0.15s ease;
      }

      .attachments-expend-button[hidden] {
        display: flex !important;
        height: 0;
        opacity: 0;
      }

      .attachments-expend-button iron-icon {
        margin-right: 8px;
      }
    </style>

    <div class="app-grid" id="attachmentsGrid">
      <template is="dom-repeat" items="{{attachments}}" as="attachment">
        <div class="attachments-item" image\$="{{attachment.image}}" file\$="{{attachment.file}}">
          <template is="dom-if" if="{{attachment.image}}">
            <img src="{{applyAttachmentImageUrl(attachment.url)}}">
          </template>
          <template is="dom-if" if="{{attachment.file}}">
            <a href="{{attachment.url}}">
              <iron-icon icon="attachment"></iron-icon>
            </a>
          </template>
          <paper-ripple></paper-ripple>
        </div>
      </template>
    </div>
    <div class="attachments-expend-button" on-click="_attachmentExpendedToggle" hidden\$="{{!_shouldShowAttachmentsExpendButton}}">
      <iron-icon icon="expand_more"></iron-icon>
      显示更多
      <paper-ripple></paper-ripple>
    </div>
`;
  }

  static get is() { return 'klog-timeline-attachments'; }

  ready() {
    super.ready();
    if (this.attachments.length > 3) {
      this._shouldShowAttachmentsExpendButton = true;
      setTimeout(() => {
        let grid = this.$.attachmentsGrid;
        let height = this.shadowRoot.querySelector('.attachments-item').scrollHeight;
        grid.style.height = height + 'px';
      }, 1);
    } else {
      this._shouldShowAttachmentsExpendButton = false;
    }
  }

  _attachmentExpendedToggle() {
    let grid = this.$.attachmentsGrid;
    let height = this.shadowRoot.querySelector('.attachments-item').scrollHeight;
    grid.style.height = height * Math.ceil(this.attachments.length / 3) + 'px';
    this._shouldShowAttachmentsExpendButton = false;
  }

  applyAttachmentImageUrl(url) {
    return url.replace('/content?imageslim', '') + '?imageView2/1/w/200/h/200/q/90|imageslim'
  }
}

window.customElements.define(KlogTimelineAttachments.is, KlogTimelineAttachments);
