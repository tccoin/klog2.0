const containerKlogStyleNote = document.createElement('template');

containerKlogStyleNote.innerHTML = `<dom-module id="klog-style-note">
  <template>
    <style>
      :host {
        display: block;
        background: var(--klog-page-background);
        outline: none;
        overflow: hidden;
        padding-left: var(--klog-layout-margin-left);
        width: 100vw;
        min-height: calc(var(--klog-layout-page-height) - 64px) !important;
        box-sizing: border-box;
        --klog-note-list-width: 300px;
        --klog-pages-width: 100%;
        --klog-pages-height: var(--klog-layout-page-height);
        --klog-note-padding: 24px;
        --klog-markdown-padding: var(--klog-note-padding);
      }

      .layout {
        width: 100%;
        height: var(--klog-layout-page-height);
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      /*app-toolbar*/

      .layout .backdrop-back-toolbar {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        box-sizing: border-box;
      }

      :not(.list) .divider {
        flex: 1;
      }

      /*back pages*/
      klog-pages.backdrop-back {
        height: auto;
      }

      .backdrop-back-toolbar {
        height: 64px;
      }

      /*front pages*/

      klog-pages.backdrop-front {
        width: 100%;
        max-width: 1280px;
        height: calc(var(--klog-layout-page-height) - var(--klog-backdrop-default-front-top));
        margin: auto;
        border-radius: 12px 12px 0 0;
        overflow: hidden;
        @apply(--shadow-elevation-4dp);
        background-color: var(--primary-background-color);
      }

      klog-pages.backdrop-front>* {
        overflow-y: hidden;
      }

      klog-pages klog-note-list {
        border-radius: 12px 0 0 0;
      }

      klog-pages klog-note-content {
        width: calc(100vw - 301px - var(--klog-layout-margin-left));
      }

      /*dialog*/

      .share-dialog {
        border: none;
        outline: none;
        width: 300px;
      }

      @media (max-width: 767px) {
        :host {
          --klog-note-padding: 16px;
        }

        klog-pages.backdrop-front {
          width: 100vw;
        }

        klog-pages.backdrop-front {
          transform: translateY(0);
          transition: transform .2s ease-out, border-radius .3s ease-out;
          will-change: transform, border-radius;
        }

        klog-pages.backdrop-front[selected="1"] {
          height: var(--klog-layout-page-height);
          transform: translateY(-64px);
          border-radius: 0;
        }
      }

      /*animation*/

      klog-backdrop klog-pages.backdrop-front>* {
        transition: opacity .2s ease;
      }

      :host([exit]) klog-backdrop klog-pages.backdrop-front>* {
        opacity: 0;
      }

      klog-backdrop .layout .backdrop-back-toolbar {
        transition: opacity .2s ease;
      }

      :host([exit]) .layout .backdrop-back-toolbar {
        opacity: 0;
      }

      .backdrop-back {
        transition: opacity .2s ease;
      }

      :host([exit]) .backdrop-back {
        opacity: 0;
      }

      .backdrop-front {
        transition: opacity .2s ease, transform .1s ease;
      }

      :host([exit]) .backdrop-front {
        opacity: 0;
        transform: translateY(5vh);
      }

      :host,
      klog-backdrop {
        --klog-backdrop-default-front-top: 64px;
      }
      @media (min-width: 1025px) {
        :host,
        klog-backdrop {
          --klog-backdrop-default-front-top: 16px;
        }
      }

      @media (min-width: 1025px) {
        [hidden-on-desktop] {
          display: none!important;
        }
      }
      @media (min-width: 769px) and (max-width: 1023px) {
        [hidden-on-tablet] {
          display: none!important;
        }
      }
      @media (max-width: 768px) {
        [hidden-on-mobile] {
          display: none!important;
        }
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerKlogStyleNote.content);