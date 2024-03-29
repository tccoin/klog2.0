import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class Klog404 extends PolymerElement {
    static get template() {
        return html`
    <style>
      :host {
        display: block;
        height: var(--klog-layout-page-height);
        overflow: hidden;
        position: relative;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
      }

      .err {
        text-align: center;
        margin-top: 20vh;
      }

      .code {
        font-size: 4vw;
      }

      .message {
        font-size: 10vw;
      }

      .banner {
        display: block;
        width: 200vw;
        margin: auto;
        background: #000;
        color: var(--paper-yellow-500);
        padding: 20px 0;
        font-size: 16px;
        white-space: nowrap;
        position: absolute;
        top: 0;
      }

      .banner1 {
        transform: rotate(11deg)translate(-30vw)translateY(10vh);
      }

      .banner2 {
        transform: rotate(-11deg)translate(-27vw)translateY(35vh);
      }

      .banner3 {
        transform: rotate(17deg)translate(-3vw)translateY(99vh);
      }
    </style>
    <div class="err">
      <div class="code">400 401 402 403 405 406 407 408</div>
      <div class="message">NOT FOUND</div>
    </div>
    <div class="banner banner1">CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK
      TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK
      TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN</div>
    <div class="banner banner2">CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK
      TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK
      TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN</div>
    <div class="banner banner3">CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK
      TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK
      TO RETURN CLICK TO RETURN CLICK TO RETURN CLICK TO RETURN</div>
`;
    }

    static get is() { return 'klog-404'; }

    ready() {
        super.ready();
        this.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: '/' } }));
        });
    }
}

window.customElements.define(Klog404.is, Klog404);
