import './klog-style-listbox.js';
const containerKlogStyleLogin = document.createElement('template');

containerKlogStyleLogin.innerHTML = `<dom-module id="klog-style-login">
  <template>
    <style include="klog-style-listbox"></style>
    <style>
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 0 !important;
      }

      app-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
      }

      .login-card {
        position: relative;
        max-width: 320px;
        width: 100%;
        margin: auto;
        padding: 0 24px;
        box-sizing: border-box;
        transition: all .3s ease;
      }

      .titles {
        position: absolute;
        top: -16px;
        transform: translateY(-100%);
        white-space: nowrap;
        user-select: none;
        -webkit-user-select: none;
        overflow: hidden;
      }

      .titles a {
        text-decoration: none;
      }

      .titles h1,
      .titles h2 {
        line-height: 1.5;
        font-weight: 400;
        margin: 0;
        z-index: -1;
      }

      h1.hidden,
      h2.hidden {
        opacity: 0;
        position: absolute;
      }

      .login-card .actions {
        margin-top: 18px;
        margin-left: -8px;
      }

      .login-card .actions [primary] {
        background-color: var(--primary);
        border-radius: 20px;
        color: var(--on-primary);
        width: 72px;
      }

      paper-icon-button {
        overflow: hidden;
        vertical-align: middle;
      }

      paper-dialog .actions {
        text-align: right;
      }

      paper-dialog paper-button[primary] {
        color: var(--primary);
      }

      :host([exit]) .login-card {
        opacity: 0;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerKlogStyleLogin.content);