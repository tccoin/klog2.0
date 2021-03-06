const containerKlogStyleMedia = document.createElement('template');

containerKlogStyleMedia.innerHTML = `<dom-module id="klog-style-media">
  <template>
    <style>
    @media (min-width: 1024px) {
      [hidden-on-desktop] {
        display: none!important;
      }
    }
    @media (min-width: 768px) and (max-width: 1023px) {
      [hidden-on-tablet] {
        display: none!important;
      }
    }
    @media (max-width: 767px) {
      [hidden-on-mobile] {
        display: none!important;
      }
    }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerKlogStyleMedia.content);