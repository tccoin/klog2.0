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
      --klog-secondary-page-background: rgba(0, 0, 0, .07);
      --klog-article-theme-color: var(--primary-background-color);
      --klog-markdown-title-color: var(--primary-text-color);
      --klog-markdown-text-color: var(--primary-text-color);
      --klog-markdown-secondary-text-color: var(--secondary-text-color);
      --klog-markdown-block-color: var(--secondary-background-color);
      --klog-markdown-selection-background: var(--paper-blue-100);
      --klog-editor-header-background-color: var(--paper-grey-100);
      --klog-card-content-color: var(--light-theme-text-color);
      --scrollbar-thumb-color: rgba(0, 0, 0, .1);
      --scrollbar-thumb-active-color: rgba(0, 0, 0, .2);

      --primary-text-color: var(--light-theme-text-color);
      --primary-background-color: var(--light-theme-background-color);
      --secondary-background-color: #F1F1F1;
      --secondary-text-color: var(--light-theme-secondary-color);
      --disabled-text-color: var(--light-theme-disabled-color);
      --divider-color: var(--light-theme-divider-color);
      --error-color: var(--paper-deep-orange-a700);
      --border-color: rgba(0, 0, 0, .12);

      --primary-color: var(--paper-indigo-500);
      --light-primary-color: var(--paper-indigo-100);
      --dark-primary-color: var(--paper-indigo-800);
      --on-primary-color: #FFF;

      --accent-color: var(--paper-grey-50);
      --light-accent-color: #FFF;
      --dark-accent-color: var(--paper-grey-200);


      --overlay-background: rgb(0, 0, 0);
      --primary-overlay-color: rgb(0, 0, 0, .06);
      --secondary-overlay-color: rgba(0, 0, 0, .12);
      --overlay-opacity: .06;
      --primary-overlay-opacity: .06;
      --secondary-overlay-opacity: .12;

      --outline-color: var(--secondary-overlay-color);
      --hover-outline-color: var(--primary-text-color);

      /*md2.0 color*/
      --klog-theme-primary: var(--paper-indigo-500);
      --klog-theme-secondary: #FFF;
      --klog-theme-background: var(--klog-page-background);
      --klog-theme-surface: var(--primary-background-color);
      --klog-theme-border: var(--border-color);

      --klog-theme-on-primary: var(--primary-text-color);
      --klog-theme-on-secondary: var(--primary-text-color);
      --klog-theme-on-surface: var(--primary-text-color);
      --klog-theme-on-background: var(--secondary-text-color);
      --klog-theme-on-error: var(--primary-text-color);
    }

    html[theme~=dark],
    :host([theme~=dark]),
    [theme~=dark] {
      --klog-page-background: #131313;
      --klog-secondary-page-background: rgba(255, 255, 255, .1);
      --klog-article-theme-color: #212121;
      --klog-markdown-title-color: #FFF;
      --klog-markdown-text-color: #c8c8c8;
      --klog-markdown-secondary-text-color: #919191;
      --klog-markdown-block-color: #161616;
      --klog-markdown-selection-background: var(--paper-cyan-800);
      --klog-editor-header-background-color: var(--paper-grey-900);
      --klog-card-content-color: var(--dark-theme-secondary-color);
      --scrollbar-thumb-color: rgba(255, 255, 255, .2);
      --scrollbar-thumb-active-color: rgba(255, 255, 255, .3);

      --primary-text-color: var(--dark-theme-text-color);
      --primary-background-color: #212121;
      --secondary-background-color: #303030;
      --secondary-text-color: var(--dark-theme-secondary-color);
      --disabled-text-color: var(--dark-theme-disabled-color);
      --divider-color: var(--dark-theme-divider-color);
      --error-color: var(--paper-deep-orange-a700);
      --border-color: rgba(255, 255, 255, .12);

      --primary-color: var(--paper-indigo-500);
      --light-primary-color: var(--paper-indigo-500);
      --dark-primary-color: var(--paper-indigo-800);
      --on-primary-color: #FFF;

      --accent-color: var(--paper-grey-800);
      --light-accent-color: var(--paper-grey-700);
      --dark-accent-color: #000;

      --overlay-background: rgb(255, 255, 255);
      --primary-overlay-color: rgba(255, 255, 255, 0.12);
      --secondary-overlay-color: rgba(255, 255, 255, .24);
      --overlay-opacity: .12;
      --primary-overlay-opacity: .12;
      --secondary-overlay-opacity: .24;

      --outline-color: var(--secondary-overlay-color);
      --hover-outline-color: var(--primary-text-color);

      /*md2.0 color*/
      --klog-theme-primary: var(--paper-blue-500);
      --klog-theme-secondary: #FFF;
      --klog-theme-background: var(--klog-page-background);
      --klog-theme-surface: var(--primary-background-color);
      --klog-theme-border: var(--border-color);

      --klog-theme-on-primary: var(--primary-text-color);
      --klog-theme-on-secondary: var(--primary-text-color);
      --klog-theme-on-surface: var(--primary-text-color);
      --klog-theme-on-background: var(--secondary-text-color);
      --klog-theme-on-error: var(--primary-text-color);
    }
  </style>
</custom-style>`;

document.head.appendChild(containerKlogStyle.content);