const containerKlogStyle = document.createElement('template');

containerKlogStyle.innerHTML = `<custom-style>
  <style is="custom-style">
    html,
    :host([theme]),
    [theme] {
      --outlined-border-width: 2px;

      --overlay-style: {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: var(--overlay-background);
        opacity: var(--overlay-opacity);
        transition: all .2s ease;
      }

      --fit-layout: {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }

      --swipe-indicator: {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }

    }

    html[theme~=light],
    :host([theme~=light]),
    [theme~=light] {
      --klog-page-background: var(--paper-grey-300);
      --klog-markdown-title-color: var(--on-surface);
      --klog-markdown-text-color: var(--on-surface);
      --klog-markdown-secondary-text-color: var(--on-background);
      --klog-markdown-block-color: var(--on-secondary-container);
      --klog-markdown-selection-background: var(--paper-blue-100);
      --klog-card-content-color: var(--light-theme-text-color);
      --scrollbar-thumb-color: rgba(0, 0, 0, .1);
      --scrollbar-thumb-active-color: rgba(0, 0, 0, .2);

      --on-surface: var(--light-theme-text-color);
      --surface: var(--light-theme-background-color);
      --on-secondary-container: #F1F1F1;
      --on-background: var(--light-theme-secondary-color);
      --error: var(--paper-deep-orange-a700);
      --outline: rgba(0, 0, 0, .12);

      --disabled-text-color: var(--light-theme-disabled-color);
      --divider-color: var(--light-theme-divider-color);

      --primary: var(--paper-indigo-500);
      --on-primary: #FFF;

      --secondary: var(--paper-grey-50);
      --light-accent-color: #FFF;
      --dark-accent-color: var(--paper-grey-200);


      --overlay-background: rgb(0, 0, 0);
      --primary-overlay-color: rgb(0, 0, 0, .06);
      --secondary-overlay-color: rgba(0, 0, 0, .12);
      --overlay-opacity: .06;
      --primary-overlay-opacity: .06;
      --secondary-overlay-opacity: .12;

      --outline-color: var(--secondary-overlay-color);
      --hover-outline-color: var(--on-surface);

      /*md2.0 color*/
      --klog-theme-primary: var(--paper-indigo-500);
      --klog-theme-secondary: #FFF;
      --klog-theme-background: var(--klog-page-background);
      --klog-theme-surface: var(--surface);
      --klog-theme-border: var(--outline);

      --klog-theme-on-primary: var(--on-surface);
      --klog-theme-on-secondary: var(--on-surface);
      --klog-theme-on-surface: var(--on-surface);
      --klog-theme-on-background: var(--on-background);
      --klog-theme-on-error: var(--on-surface);
    }

    html[theme~=dark],
    :host([theme~=dark]),
    [theme~=dark] {
      --klog-page-background: #131313;
      --klog-markdown-title-color: #FFF;
      --klog-markdown-text-color: #c8c8c8;
      --klog-markdown-secondary-text-color: #919191;
      --klog-markdown-block-color: #161616;
      --klog-markdown-selection-background: var(--paper-cyan-800);
      --klog-card-content-color: var(--dark-theme-secondary-color);
      --scrollbar-thumb-color: rgba(255, 255, 255, .2);
      --scrollbar-thumb-active-color: rgba(255, 255, 255, .3);


      --primary: var(--paper-indigo-500);
      --on-primary: #FFF;
      --surface: #212121;
      --on-surface: var(--dark-theme-text-color);

      --secondary: var(--paper-grey-800);
      --on-secondary: #FFF;
      --on-background: var(--dark-theme-secondary-color);
      --on-secondary-container: #303030;

      --tertiary: var(--paper-indigo-300);
      --on-tertiary: #FFF;
      --tertiary-container: var(--paper-blue-300);
      --on-tertiary-container: var(--dark-theme-text-color);

      --error: var(--paper-deep-orange-a700);
      --outline: rgba(255, 255, 255, .12);

      --disabled-text-color: var(--dark-theme-disabled-color);
      --divider-color: var(--dark-theme-divider-color);

      --overlay-background: rgb(255, 255, 255);
      --primary-overlay-color: rgba(255, 255, 255, 0.12);
      --secondary-overlay-color: rgba(255, 255, 255, .24);
      --overlay-opacity: .12;
      --primary-overlay-opacity: .12;
      --secondary-overlay-opacity: .24;

      --outline-color: var(--secondary-overlay-color);
      --hover-outline-color: var(--on-surface);

      /*md2.0 color*/
      --klog-theme-primary: var(--paper-blue-500);
      --klog-theme-secondary: #FFF;
      --klog-theme-background: var(--klog-page-background);
      --klog-theme-surface: var(--surface);
      --klog-theme-border: var(--outline);

      --klog-theme-on-primary: var(--on-surface);
      --klog-theme-on-secondary: var(--on-surface);
      --klog-theme-on-surface: var(--on-surface);
      --klog-theme-on-background: var(--on-background);
      --klog-theme-on-error: var(--on-surface);
    }
  </style>
</custom-style>`;

document.head.appendChild(containerKlogStyle.content);