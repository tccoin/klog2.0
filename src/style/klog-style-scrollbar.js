const containerKlogStyleScrollbar = document.createElement('template');

containerKlogStyleScrollbar.innerHTML = `<dom-module id="klog-style-scrollbar">
  <template>
    <style>
      @media (min-width: 769px) {

        :host::-webkit-scrollbar,
        ::-webkit-scrollbar,
        .klog-scrollbar::-webkit-scrollbar {
          width: var(--scrollbar-width);
          height: var(--scrollbar-width);
        }

        :host::-webkit-scrollbar-track,
        ::-webkit-scrollbar-track {
          background-color: transparent;
        }

        ::-webkit-scrollbar-corner {
          display: none;
        }

        :host::-webkit-scrollbar-thumb,
        ::-webkit-scrollbar-thumb {
          background-color: var(--scrollbar-thumb-color);
          border-radius: var(--scrollbar-thumb-radius);
        }
      }
    </style>
  </template>
</dom-module><custom-style>
  <style is="custom-style">
    html {
      --scrollbar-width: 8px;
      --scrollbar-thumb-radius: calc(var(--scrollbar-width) / 2);
    }

    @media (min-width: 769px) {
      ::-webkit-scrollbar {
        width: var(--scrollbar-width);
        background-color: var(--klog-page-background);
      }

      ::-webkit-scrollbar-track {
        background-color: var(--klog-page-background);
      }

      ::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-thumb-color);
        border-radius: var(--scrollbar-thumb-radius);
      }

      :hover::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-thumb-active-color);
      }
    }
  </style>
</custom-style>`;

document.head.appendChild(containerKlogStyleScrollbar.content);