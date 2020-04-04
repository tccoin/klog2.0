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
        flex-direction: column;
        flex: 1;
        color: var(--secondary-text-color);
      }

      .klog-author .author-info {
        display: flex;
        flex-direction: row;
      }

      .klog-author .author-name {
        color: var(--primary-text-color);
        font-weight: bold;
      }

      .klog-author .author-intro {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerKlogStyleAuthor.content);
