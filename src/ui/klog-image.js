import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { materialDynamicColors, index_seedFromImage, intFromRgb } from 'material-dynamic-colors/index.mjs';

class KlogImage extends PolymerElement {
    static get template() {
        return html `
    <style>
      :host {
        display: block;
        overflow: hidden;
        position: relative;
        width: fit-content;
      }

      img {
        display: block;
        max-width: 100%;
        width: var(--klog-media-override-width, auto);
        border-radius: var(--klog-media-border-radius, 0px);
        z-index: 1;
        background: var(--primary);
      }

      :host #bg {
        opacity: 1;
        display: block;
        position: relative;
        max-width: var(--klog-media-width, 100%);
        width: var(--klog-media-override-width, auto);
        border-radius: var(--klog-media-border-radius, 0px);
        transition: opacity var(--klog-media-transition-time, 1s) ease;
        z-index: 2;
        background: var(--primary);
      }

      :host([gallery]) img {
        position: absolute;
      }

      :host([gallery]) #bg {
        background-color: var(--paper-blue-50);
        padding-bottom: 100%;
      }

      :host([content]) img {
        max-width: var(--klog-media-width, 100%);
      }

      :host([lazy]) img {
        opacity: 0;
      }

      :host([avatar]) {
        width: 32px;
        height: 32px;
        margin-right: 8px;
        flex-shrink: 0;
        --klog-media-border-radius: 50%;
      }
    </style>
    <!-- {{mediaInfo.stats.entropy}} -->
    <img id="img" src="{{_src}}">
    <div id="bg"></div>
`;
    }

    static get is() { return 'klog-image'; }

    static get properties() {
        return {
            src: {
                type: String,
                reflectToAttribute: true
            },
            avatar: {
                type: Boolean,
                reflectToAttribute: true,
            },
            timeline: {
                type: Boolean,
                reflectToAttribute: true,
            },
            editor: {
                type: Boolean,
                reflectToAttribute: true,
            },
            content: {
                type: Boolean,
                reflectToAttribute: true,
            },
            content: {
                type: Boolean,
                reflectToAttribute: true,
            },
            gallery: {
                type: Boolean,
                reflectToAttribute: true
            },
            galleryCover: {
                type: Boolean,
                reflectToAttribute: true
            },
            theme: {
                type: String
            },
            lazy: {
                type: Boolean,
                reflectToAttribute: true
            },
            fixed: {
                type: Boolean,
                value: false
            }
        };
    }

    static get observers() {
        return [
            'srcChanged(src)'
        ];
    }

    encode(url) {
        let result = url.replace(/(\?.*)?$/, '').match(/(.*\/)(.*)$/);
        return result[1] + encodeURIComponent(result[2]);
    }

    isKlogStorage(src) {
        return src.indexOf('storage.krrr.party') > -1;
    }

    srcChanged(src) {
        if (!src || !src.match(/^(http|https):\/\//)) return;
        this._initQueue();
        // process url
        let oriSrc = src;
        if (this.avatar && !src) {
            src = 'https://storage.krrr.party/storage/klog-avatar/default_avatar.jpg';
        } else if (this.content && src.indexOf('clouddn.com') > -1 && !src.indexOf(/\.svg$/)) {
            src += '?imageView2/2/w/1440/q/85/interlace/1';
        } else if (this.isKlogStorage(src)) {
            src = this.encode(src);
            oriSrc = src;
            if (this.avatar) {
                src += '?Magic/1/w/100/h/100/q/90';
            } else if (this.timeline) {
                src += '?Magic/1/w/320/h/180/q/75';
            } else if (this.content) {
                src += '?Magic/2/w/1440/q/90';
            } else if (this.galleryCover) {
                // src += '?Magic/1/w/584/h/584/q/75';
                src += '?Magic/1/w/412/h/412/q/80';
            } else if (this.gallery) {
                // src += '?Magic/1/w/584/h/584/q/75';
                src += '?Magic/1/w/274/h/274/q/75';
            }
            if (this.lazy) {
                this.loadPlaceholder(oriSrc);
            }
        } else {
            this._lazySrc = src;
            return this.lazyload();
        }
        this._lazySrc = src;
        if (this.lazy) {
            this.wasLazy = true;
        } else {
            this._addToQueue(this.load());
        }
    }

    lazyload() {
        setTimeout(() => {
            this.lazy = false;
            this.load()();
            this.dispatchEvent(new CustomEvent('media-loading', { bubbles: true, composed: true }));
        }, 1);
    }

    load() {
        this.resolve();
        const onload = () => {
            this.$.bg.style.opacity = 0;
            this.$.img.style.opacity = 1;
            this.resolve();
        };
        const onerror = () => {
            this._src = '';
            this.$.img.removeEventListener('load', onload);
            this.$.img.removeEventListener('error', onerror);
            setTimeout(() => this._addToQueue(this.load()), 3000);
            this.resolve();
        };
        return resolve => {
            this._resolve = resolve;
            this._src = this._lazySrc;
            this.$.img.style.opacity = 0;
            if (this.$.img.complete) {
                onload();
            } else {
                this.$.img.addEventListener('load', onload);
                this.$.img.addEventListener('error', onerror);
            }
        };
    }

    resolve() {
        if (this._resolve) {
            this._resolve();
            this._resolve = undefined;
        }
    }

    _initQueue() {
        if (!window._imageLoadingQueue) {
            window._imageLoadingCount = 0;
            window._imageLoadingQueue = [];
            for (let i = 0; i < 8; i++) {
                window._imageLoadingQueue.push(Promise.resolve());
            }
        }
    }

    _addToQueue(cb) {
        const queue = window._imageLoadingQueue;
        const count = window._imageLoadingCount;
        queue[count] = queue[count].then(() => new Promise(cb));
        window._imageLoadingCount = (window._imageLoadingCount + 1) % (queue.length - 1);
    }

    ready() {
        super.ready();
        //window resize
        window.addEventListener('resize', () => {
            if (this.wasLazy)
                this.updatePlaceholder();
        });
    }

    async loadPlaceholder(url, headless = false) {
        if (!this.isKlogStorage(url)) return { w: 1600, h: 900, stats: { entropy: 0 } };
        url += '?Magic/6';
        if (!this.fixed && !headless) {
            this.$.bg.style.height = '300px';
            this.$.bg.style.width = '1000px';
        }
        let req = new XMLHttpRequest();
        return await new Promise(resolve => {
            const emptyMediaInfo = { stats: { entropy: 0 } };
            req.addEventListener('load', () => {
                try {
                    this.mediaInfo = JSON.parse(req.response);
                } catch (error) {
                    resolve(emptyMediaInfo);
                }
                this.savePlaceholderData(url, this.mediaInfo);
                if (!headless) {
                    this.updatePlaceholder();
                }
                this.dispatchEvent(new CustomEvent('media-info-updated', { bubbles: true, composed: true, detail: { mediaInfo: this.mediaInfo } }));
                resolve(this.mediaInfo);
            });
            req.addEventListener('error', () =>resolve(emptyMediaInfo));
            req.open('get', url, true);
            req.send();
        });
    }

    savePlaceholderData(url, data) {
        // disabled
        // window.placeholders = window.placeholders || {};
        // window.placeholders[url.replace(/[^0-9a-zA-Z_$]/g, '')] = data;
        return;
    }

    updatePlaceholder() {
        let data = this.mediaInfo;
        if (!this.fixed) {
            let mediaWidth = getComputedStyle(this).getPropertyValue('--klog-media-width');
            let maxWidth = parseInt(mediaWidth);
            let w, h;
            if (!mediaWidth) {
                if (!this.offsetWidth) {
                    setTimeout(() => this.updatePlaceholder(), 10);
                    return;
                }
                w = Math.min(this.offsetWidth, data.w);
            } else {
                w = Math.min(maxWidth, data.w);
            }
            h = w / data.w * data.h;
            this.$.bg.style.width = `${w}px`;
            this.$.bg.style.height = `${h}px`;
        } else if (this.gallery) {
            this.$.bg.style.width = '100%';
            this.$.bg.style.height = '0';
        } else {
            this.$.bg.style.width = '100%';
            this.$.bg.style.height = '100%';
        }
        this.$.img.style.position = 'absolute';
        if (data && 'palette' in data) {
            let c = this.theme == 'light' ? data.palette.LightVibrant.rgb : data.palette.DarkVibrant.rgb;
            this.$.bg.style.backgroundColor = `rgb(${c[0]},${c[1]},${c[2]})`;
            this.$.img.style.backgroundColor = `rgb(${c[0]},${c[1]},${c[2]})`;
        }
    }
}

window.customElements.define(KlogImage.is, KlogImage);