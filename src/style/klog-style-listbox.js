const containerKlogStyleListbox = document.createElement('template');

containerKlogStyleListbox.innerHTML = `<dom-module id="klog-style-listbox">
  <template>
    <style>
      paper-item {
        cursor: default;
        user-select: none;
        -webkit-user-select: none;
        white-space: nowrap;
      }

      paper-listbox {
        background: var(--surface);
        --paper-listbox-color: var(--on-surface);
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerKlogStyleListbox.content);
