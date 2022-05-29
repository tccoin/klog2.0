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
      --klog-markdown-title-color: var(--primary);
    }

    .section {
      position: relative;
      margin: auto;
      box-sizing: border-box;
      max-width: calc(42 * var(--klog-markdown-font-size) + 32px);
    }

    .article-container {
      width: 100%;
      margin: auto;
      padding: calc(64px + var(--safe-area-inset-top)) 0 72px;
      position: relative;
      top: calc(-1 * var(--safe-area-inset-top));
      background: var(--surface);
      min-height: calc(100vh - 350px);
    }

    .article-container::after{
      @apply --overlay-style;
      background: var(--klog-article-background);
      opacity: 0.08;
      z-index: 0;
    }

    .article-container > *{
      z-index: 1;
      position: relative;
    }

    .comment-container {
      background: linear-gradient(to bottom, var(--surface), transparent);
    }

    .article-container,
    .comment-container {
      transition: opacity .3s ease, transform .2s ease-out;
    }

    .article-update-info{
      padding: 0 16px;
      position: absolute;
      bottom: 24px;
      left: 0;
      right: 0;
      color: var(--on-background);
      cursor: default;
      user-select: none;
    }

    .article-footer {
      padding: 0 16px calc(14.5px + var(--safe-area-inset-bottom));
      font-size: 20px;
      color: var(--primary);
      opacity: 0.5;
      text-align: center;
      cursor: default;
    }

    .article-footer .logo {
      position: relative;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
    }

    .article-footer .logo iron-icon{
      width: 51.14px;
      height: 51.14px;
    }

    /* app-bar */

    klog-bottom-app-bar paper-button {
      font-weight: bold;
      min-width: initial;
    }

    klog-bottom-app-bar paper-button iron-icon {
      margin-right: 4px;
    }

    klog-bottom-app-bar .like-button iron-icon {
      transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }

    klog-bottom-app-bar .like-button:hover iron-icon {
      transform: translate(-2px, -2px) rotate(-8deg);
    }

    klog-bottom-app-bar .like-button:active iron-icon,
    klog-bottom-app-bar .like-button.active iron-icon {
      transform: translate(-5px, -5px) rotate(-20deg);
    }



    /*Article*/

    klog-markdown {
      padding-bottom: 28px;
    }

    .article-category {
      line-height: 2;
      padding: 0 16px;
      font-size: 1.05em;
      letter-spacing: 0.1em;
      color: var(--on-background);
      opacity: 0.5;
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
      margin-bottom: 48px;
    }

    .article-title h1 {
      display: inline;
      font-size: 2.5em;
      font-weight: 400;
      line-height: 1;
      margin: 0.1em 0 0.5em;
      word-break: break-word;
      color: var(--primary);
    }

    .dot-divider {
      display: inline-block;
      margin: 0 6px;
      width: 5px;
      height: 5px;
      background: var(--divider);
      border-radius: 50%;
    }

    .article-meta {
      display: flex;
      padding: 0 16px;
      flex-direction: row;
      color: var(--on-background)
    }

    .article-author {
      margin: 0 auto 48px;
      padding: 16px;
    }

    .klog-author .author-info{
      font-size: 1.1em;
      flex-direction: column;
      align-items: start;
      letter-spacing: 0.05em;
      width: 100%;
    }

    .klog-author .author-avatar,
    .klog-author .author-name{
      cursor: pointer;
    }

    .klog-author .author-name:hover{
      text-decoration: underline;
    }

    [hidden] {
      display: none;
    }

    /* animation */

    :host([loading]) .article-container,
    :host([loading]) .comment-container {
      opacity: 0;
    }

    klog-bottom-app-bar {
      transition: all .3s cubic-bezier(0.22, 0.61, 0.36, 1);
    }

    :host([loading]) klog-bottom-app-bar {
      opacity: 0;
      transform: translateY(100%);
    }


    /*media block*/

    @media (max-width: 662px) {
      :host {

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
      :host {
        --klog-markdown-media: {
          @apply(--shadow-elevation-8dp);
          width: fit-content;
        }
      }
    }

    @media (min-width: 768px) {
      :host {
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
      :host {
        --klog-media-width: 871px;
      }
    }

    @media (min-width: 1280px) {
      :host {
        --klog-media-width: 1024px;
      }
    }
  
    @media (min-width: 1440px) {
      :host {
        --klog-media-width: 1280px;
      }
    }
  
    @media (min-width: 2560px) {
      :host {
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
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerKlogStyleArticle.content);