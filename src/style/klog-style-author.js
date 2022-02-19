import '@polymer/paper-styles/paper-styles.js';
const containerKlogStyleAuthor = document.createElement('template');

containerKlogStyleAuthor.innerHTML = `<dom-module id="klog-style-author">
  <template>
    <style>
      .klog-author {
        display: flex;
        user-select: none;
        -webkit-user-select: none;
      }

      .klog-author .divider {
        flex: 1;
      }

      .klog-author .author-avatar {
        width: 50px;
        height: 50px;
        margin-right: 16px;
        border-radius: 5px;
        --klog-media-border-radius: 5px;
        @apply(--shadow-elevation-8dp);
      }

      .klog-author .text {
        display: flex;
        width: calc(100% - 66px);
        flex-direction: column;
        flex: 1;
        color: var(--secondary-text-color);
      }

      .klog-author .author-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        line-height: 1.5;
        font-size: 13px;
      }

      .klog-author .author-info .dot-divider {
        display: inline-block;
        flex-shrink: 0;
        margin: 0 5px;
        width: 4px;
        height: 4px;
        background: var(--secondary-overlay-color);
        border-radius: 50%;
        vertical-align: middle;
      }

      .klog-author .author-name {
        color: var(--primary-text-color);
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }

      .klog-author .author-intro {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerKlogStyleAuthor.content);
