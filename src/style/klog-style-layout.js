import './klog-style-toolbar.js';
const containerKlogStyleLayout = document.createElement('template');

containerKlogStyleLayout.innerHTML = `<dom-module id="klog-style-layout">
  <template>
    <style include="klog-style-toolbar"></style>
    <style>
      :host {
        display: block;
        padding: 64px 0 32px;
      }

      klog-fab {
        position: fixed;
        right: 8vw;
        bottom: 8vh;
        background-color: var(--primary-background-color);
        color: var(--primary-color);
        z-index: 99;
      }

      iron-pages {
        padding-top: var(--safe-area-inset-top);
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerKlogStyleLayout.content);