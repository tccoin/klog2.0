import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-ripple/paper-ripple.js';

class KlogVideo extends PolymerElement {
    static get template() {
        return html`
    <style>
      :host {
        display: block;
        overflow: hidden;
        position: relative;
      }

      video {
        display: block;
        max-width: 100%;
        width: var(--klog-media-override-width, auto);
        border-radius: var(--klog-video-border-radius, 0px);
        overflow: hidden;
        z-index: 1;
      }

      :host #bg {
        opacity: 1;
        display: block;
        position: relative;
        background: #161616;
        max-width: var(--klog-media-width, 100%);
        width: var(--klog-media-override-width, auto);
        border-radius: var(--klog-video-border-radius, 0px);
        transition: opacity var(--klog-video-transition-time, 1s) ease;
        z-index: 2;
      }

      paper-ripple {
        color: var(--primary);
        z-index: 3;
      }

      .tips {
        position: absolute;
        z-index: 10;
        bottom: 0;
        width: 100%;
        text-align: center;
        margin-bottom: 16px;
        color: rgba(255, 255, 255, 0.3);
        user-select: none;
        -webkit-user-select: none;
        cursor: default;
      }

      .tips [for=paused] {
        opacity: 0;
        transition: opacity .3s ease;
      }

      :host([paused]) .tips [for=paused] {
        opacity: 1;
      }

      .tips [hidden] {
        display: none;
      }

      :host([content]) video {
        max-width: var(--klog-media-width, 100%);
      }
    </style>
    <div class="tips" hidden="{{!playable}}">
      <span hidden="{{!mobile}}" for="paused">轻触此处开始播放<br></span>
      <!--<span hidden="{{!mobile}}">双击静音</span>-->
      <span hidden="{{mobile}}" for="paused">移入鼠标开始播放</span>
    </div>
    <div class="tips" hidden="{{playable}}">
      <span>加载中...</span>
    </div>
    <video id="video" preload="metadata" loop="{{!mobile}}" playsinline>
      <source src="{{_src}}#t=0.001" type="video/mp4">
    </video>
    <paper-ripple></paper-ripple>
    <div id="bg"></div>
`;
    }

    static get is() { return 'klog-video'; }

    static get properties() {
        return {
            src: {
                type: String,
                reflectToAttribute: true
            },
            mobile: {
                type: Boolean,
                reflectToAttribute: true,
                value: false
            },
            paused: {
                type: Boolean,
                reflectToAttribute: true,
                value: true
            },
            playable: {
                type: Boolean,
                reflectToAttribute: true,
                value: false
            },
        };
    }

    static get observers() {
        return [
            'srcChanged(src)'
        ];
    }

    ready() {
        super.ready();
        if (this.mobile) {
            this.addEventListener('click', () => this.clickHandle());
        } else {
            this.$.video.volume = 0;
            this.addEventListener('mouseover', () => this.play());
            this.addEventListener('mouseout', () => this.pause());
        }
        this.$.video.addEventListener('timeupdate', () => this.timeupdateHandle());
        this.$.video.addEventListener('playing', () => this.updatePaused());
        this.$.video.addEventListener('pause', () => this.updatePaused());
        this.$.video.addEventListener('playing', () => this.playingHandle());
        this.$.video.addEventListener('loadedmetadata', () => { this.playable = true; });
        // this.$.video.addEventListener('waiting', () => { this.playable = false; });
        this.updatePlaceholder();
        if (!this.lazy) {
            this.lazyload();
        }
        this._lock = 0;
    }

    updatePaused() {
        this.paused = this.$.video.paused;
    }

    playingHandle() {
        this.bath();
    }

    async play() {
        this.$.video.play();
    }

    async pause() {
        await this.dewater();
        this.$.video.pause();
    }

    async bath(duration = 2000) {
        const lock = (this._lock += 1);
        let lastTime = Date.now();
        let progress = this.$.video.volume;
        while (progress < 1) {
            if (lock != this._lock) return;
            progress += (Date.now() - lastTime) / duration;
            lastTime = Date.now();
            progress = Math.min(progress, 1);
            this.$.video.volume = parseInt(progress * 100) / 100;
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }

    async dewater(duration = 500) {
        const lock = (this._lock += 1);
        let lastTime = Date.now();
        let progress = this.$.video.volume;
        while (progress > 0) {
            if (lock != this._lock) return;
            progress -= (Date.now() - lastTime) / duration;
            lastTime = Date.now();
            progress = Math.max(progress, 0);
            this.$.video.volume = parseInt(progress * 100) / 100;
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }

    timeupdateHandle() {
        let timeRemained = (this.$.video.duration - this.$.video.currentTime) * 1000;
        if (timeRemained < 1000) {
            this.dewater(timeRemained);
        }
    }

    clickHandle() {
        const video = this.$.video;
        if (this._clicking) {
            if (this._singleClickTimeout) {
                clearTimeout(this._singleClickTimeout);
            }
            video.muted = !video.muted;
            this._clicking = false;
        } else {
            this._clicking = true;
            this._singleClickTimeout = setTimeout(() => {
                if (video.paused) {
                    this.play();
                } else {
                    this.pause();
                }
                this._clicking = false;
            }, 300);
        }
    }



    updatePlaceholder() {
        let data = this.mediaInfo;
        if (!this.fixed) {
            let mediaWidth = getComputedStyle(this).getPropertyValue('--klog-media-width');
            let maxWidth = parseInt(mediaWidth);
            let w, h;
            w = mediaWidth ? maxWidth : window.innerWidth;
            h = w / 16 * 9;
            this.$.bg.style.width = `${w}px`;
            this.$.bg.style.height = `${h}px`;
        }
        this.$.video.style.position = 'absolute';
    }

    srcChanged(src) {
        if (!src) return;
        this._src = src;
    }

    async lazyload() {
        const loadHandle = () => {
            this.$.bg.style.opacity = 0;
            this.$.bg.style.width = 0;
            this.$.bg.style.height = 0;
            this.$.video.style.opacity = 1;
            this.$.video.style.position = 'relative';
        };
        if (!this.playable) {
            await new Promise(resolve => this.$.video.addEventListener('loadedmetadata', resolve, { once: true }));
        }
        loadHandle();
    }
}

window.customElements.define(KlogVideo.is, KlogVideo);