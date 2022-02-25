import '../style/klog-style-media.js';
const containerKlogStyleToolbar = document.createElement('template');

containerKlogStyleToolbar.innerHTML = `<dom-module id="klog-style-toolbar">
  <template>
    <style include="klog-style-media"></style>
    <style>
      app-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        z-index: 100;
        padding-top: var(--safe-area-inset-top);
        height: var(--klog-header-height, 64px);
        color: var(--klog-header-text-color, var(--on-background));
        overflow: hidden;
        transition: box-shadow .25s ease, opacity .2s ease, width .2s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }

      app-toolbar {
        display: flex;
        width: 100%;
        z-index: 100;
        box-sizing: border-box;
        background-color: transparent;
        padding-top: var(--safe-area-inset-top)!important;
        top: calc(-1 * var(--safe-area-inset-top))!important;
        height: calc(64px + var( --safe-area-inset-top))!important;
        transition: all .2s ease;
      }

      app-header[blur] app-toolbar {
        -webkit-backdrop-filter: saturate(180%) blur(10px);
        backdrop-filter: saturate(180%) blur(10px);
      }

      app-toolbar::after {
        @apply --overlay-style;
        z-index: -1;
        background: var(--klog-header-background, var(--klog-page-background));
        opacity: var(--klog-header-opacity, 1);
        transition: all .2s ease;
      }

      app-toolbar>.divider {
        flex: 1;
        height: 100%;
      }

      app-toolbar .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex: 1;
        line-height: 26px;
        margin-left: 8px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: inherit;
        user-select: none;
        -webkit-user-select: none;
        cursor: default;
      }

      app-toolbar .title [main-title] iron-icon {
        width: 51.14px;
        height: 51.14px;
      }

      app-toolbar .title[on-click] {
        flex: initial;
        cursor: pointer;
        pointer-events: auto;
        -webkit-tap-highlight-color: transparent;
      }

      app-toolbar .title .divider {
        width: 1px;
        height: 20px;
        margin: 0 16px;
        background: currentColor;
        opacity: var(--secondary-overlay-opacity);
      }

      app-toolbar .actions {
        display: inline;
        white-space: nowrap;
      }

      app-toolbar paper-icon-button {
        width: 48px;
        height: 48px;
        padding: 12px;
        flex-basis: 48px;
        flex-shrink: 0;
        outline: none;
      }

      app-toolbar paper-icon-button[minimum]{
        -webkit-backdrop-filter: saturate(180%) blur(10px);
        backdrop-filter: saturate(180%) blur(10px);
        width: 32px;
        height: 32px;
        padding: 4px;
        margin-top: -16px;
        flex-basis: 32px;
        border-radius: 50%;
        overflow: hidden;
      }

      app-toolbar paper-icon-button[minimum]::after{
        @apply(--overlay-style);
        z-index: -1;
        background-color: var(--surface);
        opacity: 0.7;
      }

      app-toolbar paper-button {
        font-size: 14px;
        font-weight: bold;
        color: inherit;
        outline: none;
      }

      app-toolbar[vertical] {
        width: 64px;
        height: var(--klog-layout-page-height);
        padding: 16px 0;
        flex-shrink: 0;
        flex-direction: column;
        box-sizing: border-box;
      }

      app-toolbar:not([vertical]) paper-button iron-icon {
        margin-right: 8px;
      }

      app-toolbar:[vertical] paper-button iron-icon {
        margin-bottom: 8px;
      }

      app-header paper-progress {
        position: absolute;
        bottom: 0;
        width: 100%;
        z-index: 100;
        transition: all 300ms ease;
        --paper-progress-active-color: var(--primary);
        --paper-progress-container-color: transparent;
      }

      app-header paper-progress[disabled] {
        display: none;
      }

      app-header[shadow] {
        box-shadow: 0 1px 8px rgba(0, 0, 0, .3);
      }

      app-toolbar input {
        width: calc(100% - 72px);
        padding: 0 8px;
        margin: 0 8px;
        color: var(--on-surface);
        font-weight: normal;
        font-size: 20px;
        border: none;
        background: none;
        outline: none;
        border-radius: 0;
      }

      /*short*/

      app-header[short][collapsed],
      app-toolbar[short][collapsed] {
        width: var(--klog-header-short-width, 80px);
        right: auto;
        border-radius: 0 0 24px 0;
        box-shadow: 0 1px 8px rgba(0, 0, 0, .3) !important;
      }

      app-header[short] .title,
      app-toolbar[short] .title {
        transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) !important;
      }

      app-header[short][collapsed] .actions,
      app-toolbar[short][collapsed] .actions {
        width: 64px;
        overflow: hidden;
      }

      app-header[short][collapsed] .title,
      app-toolbar[short][collapsed] .title {
        margin-left: 0;
        opacity: 0;
      }

      @media (max-width: 767px) {

        app-header[short][collapsed],
        app-toolbar[short][collapsed] {
          width: calc(var(--klog-header-short-width, 128px) - 16px);
        }

        app-toolbar {
          padding: 0 8px;
        }

        app-toolbar[vertical] {
          padding: 4px 0;
        }

        app-toolbar[vertical] paper-icon-button[icon=menu],
        app-toolbar[vertical] paper-icon-button.navigation {
          margin-bottom: 4px;
        }

        app-toolbar .title .divider {
          opacity: 0;
          transform: scale(1, 0);
        }

        app-toolbar .title [page-title] {
          opacity: 0;
          transform: translate(-20%, 0);
        }
      }

      /*animation*/

      :host app-toolbar .title .divider {
        transition: all .2s ease-out;
      }

      app-toolbar[exit] .title .divider {
        opacity: 0;
        transform: scale(1, 0);
      }

      :host app-toolbar .title [page-title] {
        transition: opacity .15s ease, transform .2s ease;
      }

      app-toolbar[exit] .title [page-title] {
        opacity: 0;
        transform: translate(-20%, 0);
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerKlogStyleToolbar.content);