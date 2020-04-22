import './klog-style-layout.js';
import './klog-style-card.js';
import './klog-style-author.js';
const containerKlogStyleArticle = document.createElement('template');

containerKlogStyleArticle.innerHTML = `<dom-module id="klog-style-article">
  <template>
    <style include="klog-style-layout"></style>
    <style include="klog-style-card"></style>
    <style include="klog-style-author"></style>
    <style>
    :host {
      display: block;
      min-height: var(--klog-layout-page-height);
      outline: none;
    }

    .section,
    .article-footer {
      margin: auto;
      box-sizing: border-box;
    }

    .content,
    .article-footer {
      transition: opacity .3s ease, transform .2s ease-out;
    }

    :host([loading]) .content,
    :host([loading]) .article-footer {
      opacity: 0;
    }

    /*Article*/

    .article-category {
      font-size: calc(1.1 * var(--klog-markdown-font-size));
      padding: 0 16px;
      color: var(--secondary-text-color);
    }

    .article-collection {
      font-weight: bold;
      padding-right: 8px;
    }

    .article-tag {
      padding-left: 8px;
    }

    .article-title {
      padding: 0 16px;
    }

    .article-title h1 {
      font-size: calc(2 * var(--klog-markdown-font-size));
      font-weight: 400;
      line-height: 1.3;
      margin: 0 0 1em;
    }

    .dot-divider {
      display: inline-block;
      margin: 0 6px;
      width: 5px;
      height: 5px;
      background: var(--divider-color);
      border-radius: 50%;
    }

    .article-meta {
      display: flex;
      padding: 0 16px;
      flex-direction: row;
      color: var(--secondary-text-color)
    }

    .article-author {
      margin: 16px auto 32px;
      padding: 16px;
    }

    .article-footer {
      padding: 16px;
      font-size: 20px;
      color: var(--primary-text-color);
      opacity: 0.15;
      text-align: right;
      cursor: default;
    }

    .article-footer .logo {
      position: relative;
      user-select: none;
      -webkit-user-select: none;
    }

    .article-footer .logo a {
      @apply --fit-layout;
      z-index: 1;
    }

    [hidden] {
      display: none;
    }

    /*immersive mode*/

    :host(:not([immersive])) .immersive {
      display: none !important;
    }

    :host([immersive]) .non-immersive {
      display: none !important;
    }

    /*media block*/

    @media (max-width: 662px) {
      klog-markdown {

        --klog-markdown-media-container: {
          width: calc(100% + 32px);
          margin: 0 0 16px 50%;
          transform: translateX(-50%);
        }

        --klog-markdown-media: {
          width: 100%;
          --klog-media-border-radius: 0px;
        }

        --klog-markdown-media-description: {
          padding: 12px 16px 0;
        }
      }
    }

    @media (min-width: 663px) {
      klog-markdown {
        --klog-markdown-media: {
          @apply(--shadow-elevation-8dp);
        }
      }
    }

    @media (min-width: 768px) {
      klog-markdown {
        --klog-media-width: 739px;

        --klog-markdown-media-container: {
          min-width: 100%;
          margin: 0 0 16px 50%;
          width: max-content;
          transform: translateX(-50%);
        }
      }
    }

    @media (min-width: 1024px) {
      klog-markdown {
        --klog-media-width: 768px;
      }
    }

    @media (min-width: 1440px) {
      klog-markdown {
        --klog-media-width: 1024px;

        --klog-markdown-media-container: {
          min-width: 100%;
          margin: 0 0 32px 50%;
          width: max-content;
          transform: translateX(-50%);
        }

        --klog-markdown-media: {
          @apply(--shadow-elevation-16dp);
        }
      }
    }

    /*font size*/

    .content {
      width: 100%;
      margin: auto;
      padding-top: 5vh;
      max-width: calc(42 * var(--klog-markdown-font-size) + 32px);
    }

    @media (max-width: 767px) {

      :host {
        --klog-markdown-font-size: 15px;
        --klog-markdown-line-height: 1.7;
      }
    }

    @media (min-width: 768px) and (max-width: 1439px) {
      :host {
        --klog-markdown-font-size: 16px;
        --klog-markdown-line-height: 1.8;
      }
    }

    @media (min-width: 1440px) {
      :host {
        --klog-markdown-font-size: 17px;
        --klog-markdown-line-height: 1.8;
      }
    }

    /*scrollbar*/
    @media (max-width: 767px) {
      :host::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-thumb-color) !important;
      }

      :host(:hover)::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-thumb-active-color) !important;
      }
    }

    /*animation*/

    :host([exit]) klog-fab {
      transform: scale(0);
    }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerKlogStyleArticle.content);
