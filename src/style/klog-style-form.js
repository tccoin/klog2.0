const containerKlogStyleForm = document.createElement('template');

containerKlogStyleForm.innerHTML = `<dom-module id="klog-style-form">
  <template>
    <style>
      .form-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 20px;
      }

      .form-item[hidden] {
        display: none;
      }

      .form-item .text-container {
        flex: 1;
        user-select: none;
        -webkit-user-select: none;
      }

      .form-item .title {
        color: var(--primary-text-color);
        font-weight: bold;
      }

      .form-item .description {
        color: var(--secondary-text-color);
      }

      .form-item paper-button {
        padding: 6px 8px;
        font-weight: bold;
        color: var(--secondary-text-color);
        border: var(--outlined-border-width) solid var(--outline-color);
        border-radius: 4px;
        transition: all .2s ease;
      }

      .form-item paper-button:hover {
        color: var(--primary-text-color);
        border-color: var(--hover-outline-color);
      }

      .form-item paper-button[disabled] {
        color: var(--disabled-text-color) !important;
      }

      klog-dropdown-menu paper-tabs {
        max-width: 352px;
        width: calc(100vw - 16px);
        --paper-tabs-selection-bar-color: transparent;
        --paper-tab-ink: var(--primary-color);
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerKlogStyleForm.content);
