const containerKlogStyleToast = document.createElement('template');

containerKlogStyleToast.innerHTML = `<dom-module id="klog-style-toast">
  <template>
    <style>
      paper-toast {
        border-radius: 5px;
      }
      paper-toast a {
        color: var(--paper-yellow-500);
        float: right;
        cursor: pointer;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerKlogStyleToast.content);
