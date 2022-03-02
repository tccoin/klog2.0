const containerKlogStyleCard = document.createElement('template');

containerKlogStyleCard.innerHTML = `<dom-module id="klog-style-card">
  <template>
    <style>
      :host {
        --klog-card-padding: 8px;
        --klog-card-primary-font-size: var(--primary-font-size, 14px);
        --klog-card-secondary-font-size: var(--secondary-font-size, 12px);
      }

      .klog-card-label {
        position: relative;
        margin: auto;
        padding: 0 0 8px;
        font-size: 0.9em;
        box-sizing: border-box;
        color: var(--on-background);
      }

      .klog-card {
        position: relative;
        margin: auto;
        box-sizing: border-box;
        border-radius: 5px;
        background: var(--surface);
        transition: box-shadow .3s ease;
        overflow: hidden;
        -webkit-tap-highlight-color: transparent;
        @apply --shadow-elevation-2dp;
      }

      .klog-card[raised] {
        @apply --shadow-elevation-8dp;
      }

      .klog-card>* {
        margin-top: calc(var(--klog-card-padding) * 2);
        margin-bottom: calc(var(--klog-card-padding) * 2);
      }

      .klog-card>paper-ripple {
        margin: 0;
      }

      /*list*/

      .klog-card.list{
        border-radius: 0px;
      }

      .klog-card-label+.klog-card.list,
      .klog-card.list:first-of-type {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }

      .klog-card.list:last-of-type {
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
      }

      /*card-meta*/

      .klog-card .card-meta {
        display: flex;
        align-items: center;
        font-size: 0.9em;
        line-height: 1.3;
        margin: calc(var(--klog-card-padding) * 2);
        color: var(--on-background);
      }

      .klog-card .card-meta .meta-avatar {
        width: 32px;
        height: 32px;
      }

      .klog-card .card-meta .meta-container {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .klog-card .card-meta .meta-title {
        display: inline;
        font-weight: bold;
        color: var(--on-surface);
        font-size: var(--klog-card-primary-font-size);
      }

      .klog-card .card-meta .meta-subtitle {
        display: flex;
        flex-flow: row;
        align-items: center;
        white-space: nowrap;
        font-size: var(--klog-card-primary-font-size);
        margin-top: 4px;
      }

      .klog-card .dot-divider {
        display: inline-block;
        height: 4px;
        width: 4px;
        margin: 0 6px;
        border-radius: 2px;
        vertical-align: middle;
        background: var(--outline);
      }


      /*card-body*/

      .klog-card .card-media {
        max-height: 328px;
        margin: 0;
        --klog-media-override-width: 100%;
        width: 100%;
      }

      .klog-card .card-subtitle {
        margin: calc(var(--klog-card-padding) * 3) calc(var(--klog-card-padding) * 2) 0;
        line-height: 1;
        color: var(--on-background);
        font-weight: bold;
      }

      .klog-card .card-media:not([hidden])+.card-subtitle {
        margin: calc(var(--klog-card-padding) * 2) calc(var(--klog-card-padding) * 2) 0;
      }

      .klog-card .card-title {
        font-size: 1.4em;
        line-height: 1.3;
        margin: var(--klog-card-padding) calc(var(--klog-card-padding) * 2) calc(var(--klog-card-padding) * 2);
        color: var(--on-surface);
      }

      .klog-card .card-subtitle+.card-title {
        margin-top: calc(var(--klog-card-padding) * 0.5) !important;
      }

      .klog-card .card-content {
        display: flex;
        flex-direction: row;
        margin: calc(var(--klog-card-padding) * 2);
      }

      .klog-card .content-text {
        max-height: 6.8em;
        overflow: hidden;
        flex: 1;
        margin: 0;
        font-size: var(--klog-card-primary-font-size);
        color: var(--klog-card-content-color, var(--on-surface));
      }

      .klog-card .content-thumbnail {
        width: 160px;
        height: 90px;
        border-radius: 3px;
        margin-left: calc(var(--klog-card-padding) * 2);
      }

      /*card-gallery*/

      .klog-card .card-gallery {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        overflow: auto;
        flex: 1;
        margin: calc(var(--klog-card-padding) * 2);
        font-size: var(--klog-card-secondary-font-size);
        color: var(--klog-card-content-color, var(--on-surface));
      }

      .klog-card .gallery-container {
        display: flex;
        flex-wrap: wrap;
        flex-basis: 100%;
        flex-grow: 1;
      }

      .klog-card .gallery-container[cover] {
        flex-basis: 50%;
        flex-grow: 0;
      }

      .klog-card .gallery-container[cover]+.gallery-container {
        flex-basis: 50%;
      }

      .klog-card .gallery-item {
        margin-right: 1px;
        margin-top: 1px;
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: calc(25% - 1px);
      }

      .klog-card .gallery-container[cover] .gallery-item {
        flex-basis: calc(100% - 1px);
      }

      .klog-card .gallery-container[cover]+.gallery-container .gallery-item {
        flex-basis: calc(50% - 1px);
      }

      .klog-card[mobile] .gallery-container[cover] {
        flex-basis: 66.66%;
        flex-grow: 0;
      }

      .klog-card[mobile] .gallery-container[cover]+.gallery-container {
        flex-basis: 33.33%;
      }

      .klog-card[mobile] .gallery-item {
        flex-basis: calc(33.33% - 1px);
      }

      .klog-card[mobile] .gallery-container[cover]+.gallery-container .gallery-item {
        flex-basis: calc(100% - 1px);
      }

      /*card-actions*/

      .klog-card .card-actions {
        display: flex;
        flex-wrap: wrap;
        margin: calc(var(--klog-card-padding) * 2) calc(var(--klog-card-padding) * 2) calc(var(--klog-card-padding) * 2 - 4px);
        color: var(--on-background);
        overflow: hidden;
      }

      .klog-card [hidden] {
        display: none !important;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerKlogStyleCard.content);
