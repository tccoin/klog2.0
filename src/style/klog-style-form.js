const containerKlogStyleForm = document.createElement('template');

containerKlogStyleForm.innerHTML = `<dom-module id="klog-style-form">
  <template>
    <style>
      :host {
        --klog-input-outline-color: var(--surface-variant);
      }

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
        color: var(--on-surface);
        font-weight: bold;
      }

      .form-item .description {
        color: var(--on-background);
      }

      .form-item paper-button {
        padding: 6px 8px;
        font-weight: bold;
        color: var(--on-background);
        border: var(--outlined-border-width) solid var(--klog-input-outline-color);
        border-radius: 4px;
        transition: all .2s ease;
      }
      
      .form-item paper-swatch-picker {
        --paper-swatch-picker-icon:{
          display: none;
        }
        --paper-listbox-background-color: var(--surface);
        --paper-swatch-picker-color-size: 24px;
      }

      .form-item .paper-color-picker-icon {
        color: var(--primary);
      }

      .form-item paper-button:hover {
        color: var(--on-surface);
        border-color: var(--on-surface);
      }

      .form-item paper-button[disabled] {
        color: var(--disabled-text-color) !important;
      }

      klog-dropdown-menu paper-tabs {
        max-width: 352px;
        width: calc(100vw - 16px);
        --paper-tabs-selection-bar-color: transparent;
        --paper-tab-ink: var(--primary);
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerKlogStyleForm.content);
