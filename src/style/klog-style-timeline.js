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

      .page-header-container{
        display: flex;
        flex-direction: column;
        align-items: start;
        padding: 0 8px;
        margin: 0 auto 24px;
        box-sizing: border-box;
        cursor: default;
        user-select: none;
      }

      .page-header-title{
        display: inline;
        font-size: 32px;
        font-weight: bolder;
        margin-right: 16px;
        color: var(--on-surface);
      }

      .page-header-subtitle{
        margin-bottom: 16px;
        color: var(--on-surface);
      }

      :host([mobile]) .main-container{
        padding: 80px 0 64px;
      }

      .filter-container {
        width: calc(100vw + 92px) !important;
        margin: 0 auto 0;
        padding-left: 48px;
        position: relative;
        left: -46px;
        box-sizing: border-box;
      }

      klog-chip {
        margin: 0 4px;
        vertical-align: middle;
        --klog-chip-text-color: var(--on-background);
        --divider: var(--on-background);
        --klog-chip-style: {
          font-size: 1.1em;
          font-weight: bold;
          padding: 8px 18px;
        }
        border-radius: 24px;
        --klog-chip-background-color: transparent;
      }

      klog-chip[active] {
        --klog-chip-background-color: var(--surface);
        --klog-chip-background-opacity: 1;
        @apply(--shadow-elevation-2dp);
      }

      klog-chip[name=search] input {
        width: 100%;
        color: var(--on-surface);
        font-weight: normal;
        font-size: 16px;
        font-weight: bold;
        line-height: 18px;
        border: none;
        background: none;
        outline: none;
        border-radius: 0;
        padding: 0 0 0 4px;
      }

      klog-chip[name=search] {
        --klog-chip-expand-width: 128px;
      }

      klog-chip[name=daily] {
        --primary: var(--paper-amber-900);
      }

      klog-chip[name=note] {
        --primary: var(--paper-green-700);
      }

      klog-chip[name=gallery] {
        --primary: var(--paper-blue-grey-500);
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
        color: var(--on-surface);
        background: var(--surface);
        user-select: none;
        -webkit-user-select: none;
      }

      .timeline-container {
        margin-top: 16px;
        transition: all .2s ease-out;
      }

      /*fab*/
      klog-fab {
        background-color: var(--primary);
        color: var(--on-primary);
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

      [hidden] {
        display: none;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerKlogStyleTimeline.content);