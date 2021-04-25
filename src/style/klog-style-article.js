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
      padding: 0;
      font-size: var(--klog-markdown-font-size);
    }

    .section {
      position: relative;
      margin: auto;
      box-sizing: border-box;
      max-width: calc(42 * var(--klog-markdown-font-size) + 32px);
    }

    .fab-section{
      max-width: 90vw;
      font-size: 16px;
    }

    .klog-author .author-info{
      font-size: 1.2em;
      padding-top: 8px;
      align-items: start;
    }

    .klog-author .author-avatar,
    .klog-author .author-name{
      cursor: pointer;
    }

    .klog-author .author-name:hover{
      text-decoration: underline;
    }

    .article-container {
      width: 100%;
      margin: auto;
      padding: calc(64px + var(--safe-area-inset-top)) 0 72px;
      position: relative;
      top: calc(-1 * var(--safe-area-inset-top));
      background: var(--primary-background-color);
      min-height: calc(100vh - 350px);
      @apply(--shadow-elevation-2dp);
    }

    .article-container,
    .comment-container {
      transition: opacity .3s ease, transform .2s ease-out;
    }

    :host([loading]) .article-container,
    :host([loading]) .comment-container {
      opacity: 0;
    }

    .fab-container{
      position: absolute;
      padding: 0 16px;
      right: 0;
    }

    klog-fab{
      position: fixed;
      bottom: 10vh;
      right: auto;
      width: 96px;
      background-color: transparent;
      color: var(--primary-text-color);
      -webkit-backdrop-filter: saturate(180%) blur(10px);
      backdrop-filter: saturate(180%) blur(10px);
      overflow: hidden;
      transform: translateX(-100%);
      transition: transform 0.2s ease 0s, box-shadow 0.2s ease 0s, opacity 0.2s ease 0s;
    }

    klog-fab::after{
      @apply(--overlay-style);
      z-index: -1;
      background-color: var(--primary-background-color);
      opacity: 0.7;
    }

    .article-update-info{
      padding: 0 16px;
      position: absolute;
      bottom: 24px;
      left: 0;
      right: 0;
      color: var(--secondary-text-color);
      cursor: default;
      user-select: none;
    }

    .article-footer {
      padding: 0 16px 32px;
      font-size: 20px;
      color: var(--primary-text-color);
      opacity: 0.15;
      text-align: center;
      cursor: default;
    }

    .article-footer .logo {
      position: relative;
      user-select: none;
      -webkit-user-select: none;
    }

    .article-footer .logo iron-icon{
      width: 51.14px;
      height: 51.14px;
    }

    .article-footer .logo a {
      @apply --fit-layout;
      z-index: 1;
    }

    /*Article*/
    klog-markdown {
      padding-bottom: 28px;
    }

    .article-category {
      line-height: 1.5;
      padding: 0 16px;
      letter-spacing: 0.1em;
      color: var(--secondary-text-color);
    }

    .article-category klog-render-timestamp,
    .article-collection {
      padding-right: 4px;
    }

    .article-category .article-collection,
    .article-category .article-tag {
      cursor: pointer;
    }

    .article-category .article-collection:hover,
    .article-category .article-tag:hover {
      text-decoration: underline;
    }

    .article-title {
      padding: 0 16px;
    }

    .article-title h1 {
      font-size: 3em;
      font-weight: 400;
      line-height: 1;
      margin: 0.1em 0 0.5em;
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
      margin: 64px auto 64px;
      padding: 16px;
    }

    [hidden] {
      display: none;
    }


    /*media block*/

    @media (max-width: 662px) {
      klog-markdown {

        --klog-media-border-radius: 0px;

        --klog-markdown-media-container: {
          width: calc(100% + 32px);
          margin: 0 0 16px 50%;
          transform: translateX(-50%);
        }

        --klog-markdown-media: {
          width: 100%;
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
          width: fit-content;
        }
      }
    }

    @media (min-width: 769px) {
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
        --klog-media-width: 871px;
      }
    }

    @media (min-width: 1280px) {
      klog-markdown {
        --klog-media-width: 1024px;
      }
    }
  
    @media (min-width: 1440px) {
      klog-markdown {
        --klog-media-width: 1280px;
      }
    }
  
    @media (min-width: 2560px) {
      klog-markdown {
        --klog-media-width: 1440px;
      }
    }

    /*font size*/

    @media (max-width: 767px) {
      :host {
        --klog-markdown-font-size: 15px;
        --klog-markdown-line-height: 1.7;
      }
    }

    @media (min-width: 769px) and (max-width: 1439px) {
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

    @media (min-width: 2560px) {
      :host {
        --klog-markdown-font-size: 18px;
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