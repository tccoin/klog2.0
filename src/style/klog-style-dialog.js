const containerKlogStyleDialog = document.createElement('template');

containerKlogStyleDialog.innerHTML = `<dom-module id="klog-style-dialog">
  <template>
    <style>
      paper-dialog {
        border-radius: 5px;
      }

      paper-dialog h2:first-child {
        margin-top: 20px;
      }

      paper-dialog .actions[column] {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0 16px;
        margin-top: 16px;
        color: var(--klog-theme-primary);
      }

      paper-dialog .actions[column] paper-button {
        margin: 0;
        text-transform: none;
        width: 100%;
        justify-content: flex-start;
        outline: none;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerKlogStyleDialog.content);
