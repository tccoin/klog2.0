const containerKlogStyle = document.createElement('template');

containerKlogStyle.innerHTML = `<custom-style>
  <style is="custom-style">
    html,
    :host([theme]),
    [theme] {
      --primary-text-color: var(--on-surface);
      --secondary-text-color: var(--on-surface);
      --primary-color: var(--primary);
      --accent-color: var(--secondary);
      
      --outlined-border-width: 2px;

      --overlay-style: {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: var(--overlay-background, currentColor);
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
      --klog-page-background: var(--surface-variant);
      --on-klog-page-background: var(--on-surface-variant);
      --klog-markdown-title-color: var(--on-surface);
      --klog-markdown-text-color: var(--on-surface);
      --klog-markdown-secondary-text-color: var(--on-background);
      --klog-markdown-selection-background: var(--paper-blue-100);
      --klog-card-content-color: var(--light-theme-text-color);
      --scrollbar-thumb-color: rgba(0, 0, 0, .1);
      --scrollbar-thumb-active-color: rgba(0, 0, 0, .2);
      --overlay-opacity: .06;
      --primary-overlay-opacity: .06;
      --secondary-overlay-opacity: .12;
      --divider: rgba(0, 0, 0, 0.08);
    }

    html[theme~=dark],
    :host([theme~=dark]),
    [theme~=dark] {
      --klog-page-background: #131313;
      --on-klog-page-background: #919191;
      --klog-markdown-title-color: #FFF;
      --klog-markdown-text-color: #c8c8c8;
      --klog-markdown-secondary-text-color: #919191;
      --klog-markdown-selection-background: var(--paper-cyan-800);
      --klog-card-content-color: var(--dark-theme-secondary-color);
      --scrollbar-thumb-color: rgba(255, 255, 255, .2);
      --scrollbar-thumb-active-color: rgba(255, 255, 255, .3);
      --overlay-opacity: .12;
      --primary-overlay-opacity: .12;
      --secondary-overlay-opacity: .24;
      --divider: rgba(255, 255, 255, 0.08);
    }

  </style>
</custom-style>`;

document.head.appendChild(containerKlogStyle.content);