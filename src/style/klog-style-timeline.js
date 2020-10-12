const containerKlogStyleTimeline = document.createElement('template');

containerKlogStyleTimeline.innerHTML = `<dom-module id="klog-style-timeline">
  <template>
    <style>
      :host {
        display: block;
        min-height: var(--klog-layout-page-height);
        overflow: hidden;
        padding: 0;
      }

      .main-container {
        padding: 64px 0;
        min-height: var(--klog-layout-page-height);
        box-sizing: border-box;
        overflow: hidden;
        justify-content: center;
        transition: all .15s ease;
      }

      :host([mobile]) .main-container{
        padding: 96px 0 64px;
      }

      .filter-container {
        width: calc(100vw + 92px) !important;
        padding: 0 50px;
        position: relative;
        left: -46px;
        box-sizing: border-box;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        font-size: 0;
      }

      klog-chip {
        height: 40px;
        margin: 0 4px;
        vertical-align: middle;
        --klog-chip-text-color: var(--secondary-text-color);
        --divider-color: var(--secondary-text-color);
        --klog-chip-style: {
          font-weight: bold;
          padding: 8px 18px;
        }
      }

      klog-chip[name=search] {
        --primary-color: var(--paper-cyan-700);
        --klog-chip-expand-width: 64px;
      }

      klog-chip[name=search] input {
        width: 100%;
        height: 19px;
        color: var(--primary-color);
        font-weight: bold;
        font-size: inherit;
        border: none;
        background: none;
        border-bottom: 1px solid var(--primary-color);
        outline: none;
      }

      klog-chip[name=daily] {
        --primary-color: var(--paper-amber-900);
      }

      klog-chip[name=note] {
        --primary-color: var(--paper-green-700);
      }

      klog-chip[name=gallery] {
        --primary-color: var(--paper-blue-grey-500);
      }

      .item {
        max-width: 600px;
        margin: 0 auto 16px;
        transition: width .2s ease;
        will-change: transform, opacity;
      }

      .eof {
        width: 100px;
        padding: 4px 8px;
        margin: 32px auto 0;
        box-sizing: border-box;
        text-align: center;
        border-radius: 16px;
        color: var(--klog-theme-on-background);
        background: var(--primary-overlay-color);
        user-select: none;
        -webkit-user-select: none;
      }

      .timeline-container {
        transition: all .2s ease-out;
      }

      /*fab*/
      klog-fab {
        background-color: var(--primary-color);
        color: var(--on-primary-color);
      }

      /*animation*/
      :host([exit]) .main-container {
        transform: translateY(5vh);
        opacity: 0;
      }

      :host([loading]) .timeline-container {
        transform: translateY(25vh);
        opacity: 0;
      }

      :host([exit]) klog-fab {
        transform: scale(0);
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerKlogStyleTimeline.content);
