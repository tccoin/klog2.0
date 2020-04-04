import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-ripple/paper-ripple.js';

class KlogPlayerLite extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        position: relative;
        overflow: hidden;
        border-radius: var(--klog-player-border-radius);
        background: var(--klog-player-background-color);
      }

      video {
        width: 100%;
        max-height: var(--klog-layout-page-height);
        display: block;
        object-fit: contain;
      }

      .actions {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0 16px 16px 16px;
        z-index: 2;
        opacity: 0;
        transition: opacity .15s ease;
      }

      :host([paused]) .actions {
        opacity: 1;
      }

      .actions iron-icon {
        margin: 16px;
        transform: scale(2);
        color: var(--primary-text-color);
        transition: opacity .1s ease;
      }

      #icon {
        opacity: 0.3;
      }

      #volume {
        float: right;
        cursor: pointer;
      }

      #volume[muted] {
        opacity: 0.3;
      }
    </style>
    <div class="actions">
      <iron-icon id="icon" icon="videocam"></iron-icon>
      <iron-icon id="volume" icon="volume_up" muted\$="{{muted}}" on-click="mute"></iron-icon>
    </div>
    <video id="video" src="{{src}}" preload="none"></video>
    <paper-ripple></paper-ripple>
`;
  }

  static get is() { return 'klog-player-lite'; }

  static get properties() {
    return {
      src: {
        type: String,
      },
      alt: {
        type: String,
      },
      paused: {
        type: Boolean,
        value: true,
        reflectToAttribute: true
      },
      muted: {
        type: Boolean,
        value: false,
      }
    }
  }

  ready() {
    super.ready();
    this.addEventListener('click', () => {
      this._click = this._click ? 2 : 1;
      setTimeout(() => {
        if (this._click == 2) {
          this._fullscreen = !this._fullscreen;
          if (this._fullscreen) {
            if (this.requestFullscreen) {
              this.requestFullscreen();
            } else if (this.mozRequestFullScreen) {
              this.mozRequestFullScreen();
            } else if (this.webkitRequestFullScreen) {
              this.webkitRequestFullScreen();
            }
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen();
            }
          }
        } else if (this._click == 1) {
          let video = this.$.video;
          if (video.paused) video.play();
          else video.pause();
          this.paused = video.paused;
        }
        this._click = 0;
      }, 250);
    });
  }

  mute(e) {
    e.stopPropagation();
    let video = this.$.video;
    this.muted = !this.muted;
    video.muted = this.muted;
  }
}

window.customElements.define(KlogPlayerLite.is, KlogPlayerLite);
