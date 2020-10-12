import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import katex from '../lib/katex.js';
import '../lib/katex-style.js';

class KlogRenderKatex extends PolymerElement {
    static get template() {
        return html`
        <style include="katex-style"></style>
        <style>
            :host {
                display: inline;
            }

            :host([block]) {
                display: block;
                text-align: center;
                margin: 8px 0;
                max-width: 100%;
                overflow-x: auto;
                overflow-y: hidden;
                padding: 4px 0;
            }
        </style>
        <span id="placeholder">
            <slot></slot>
        </span>
        <span id="container" class="formular-container"></span>
`;
    }

    static get is() {
        return 'klog-render-katex';
    }

    static get properties() {
        return {
            code: {
                type: String,
            },
            block: {
                type: Boolean,
                reflectToAttribute: true
            },
            error: {
                type: Boolean,
                reflectToAttribute: true
            }
        }
    }

    ready() {
        super.ready();
        this.update();
    }

    update() {
        this.code = this.code
            .replace(/−/mg, '-')
            .replace(/align\*/mg, 'aligned');
        try {
            this.$.container.innerHTML = katex.renderToString(this.code, {
                throwOnError: true,
                macros: {
                    '\\e': '\\times 10^{#1}',
                    '\\newline': '\\\\'
                }
            });
        } catch (err) {
            console.log(err);
            this.error = true;
            return;
        }
        this.$.placeholder.setAttribute('hidden', true);
    }
}

window.customElements.define(KlogRenderKatex.is, KlogRenderKatex);
