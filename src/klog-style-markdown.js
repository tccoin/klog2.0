const containerKlogStyleMarkdown = document.createElement('template');

containerKlogStyleMarkdown.innerHTML = `<dom-module id="klog-style-markdown">
  <template>
    <style>
      :host {
        display: block;
        position: relative;
        color: var(--klog-markdown-text-color);
        --klog-markdown-line-height: 1.7;
      }

      .klog-article-content {
        padding: var(--klog-markdown-padding, 0 16px);
        font-size: var(--klog-markdown-font-size, 14px);
        word-break: break-word;
        line-height: var(--klog-markdown-line-height, 1.7);
      }

      .klog-article-content #content>*:last-child {
        margin-bottom:0!important;
      }

      .klog-article-content hr {
        border: 2px solid var(--divider-color);
        margin: 4em auto;
        width: 3em;
        border-radius: 2px;
      }

      .klog-article-content p {
        margin: 0 0 1em;
        text-align: justify;
      }

      .klog-article-content li p {
        margin-bottom: 0;
      }

      .klog-article-content>p:first-child,
      .klog-article-content>h1:first-child,
      .klog-article-content>h2:first-child,
      .klog-article-content>h3:first-child,
      .klog-article-content>h4:first-child,
      .klog-article-content>h5:first-child,
      .klog-article-content>h6:first-child {
        margin-top: 0;
      }

      .klog-article-content h1,
      .klog-article-content h2,
      .klog-article-content h3,
      .klog-article-content h4,
      .klog-article-content h5,
      .klog-article-content h6 {
        color: var(--klog-markdown-title-color);
        line-height: 1;
        margin: 1.7em 0 1.2em;
      }

      .klog-article-content h1.centered-heading,
      .klog-article-content h2.centered-heading,
      .klog-article-content h3.centered-heading,
      .klog-article-content h4.centered-heading,
      .klog-article-content h5.centered-heading,
      .klog-article-content h6.centered-heading {
        text-align: center;
      }

      .klog-article-content code {
        font-family: "Biaodian Pro Sans GB", Menlo, Consolas, Courier, "Han Heiti GB", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", monospace !important;
      }

      .klog-article-content em {
        box-shadow: 0 -0.5em 0px var(--light-primary-color) inset;
        padding: 0 2px;
        font-style: normal;
        -moz-text-emphasis: none !important;
        -webkit-text-emphasis: none !important;
        text-emphasis: none !important;
        display: inline;
      }

      .klog-article-content strong {
        color: var(--klog-markdown-title-color);
        font-weight: bold;
        font-family: inherit !important;
      }

      .klog-article-content blockquote {
        font-family: "Biaodian Pro Serif GB", "Numeral LF Serif", Georgia, "Times New Roman", 'Noto Serif CJK SC', 'Source Han Serif SC', ‘Source Han Serif’, source-han-serif-sc, '宋体', serif !important;
        font-weight: 400;
        padding-left: 2em;
        margin: 2em 0;
        font-size: .9em;
        position: relative;
      }

      .klog-article-content blockquote::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: var(--divider-color);
        border-radius: 2px;
      }

      /* link */

      .klog-article-content a {
        position: relative;
        color: var(--primary-color);
        text-decoration: none;
        border-bottom: 1px solid var(--light-primary-color);
      }

      .klog-article-content a:visited {
        color: var(--primary-color);
      }

      .klog-article-content .sup {
        top: -.5em;
        font-size: 0.8em;
        margin-left: 2px;
        padding: 2px 4px;
        border-radius: 4px;
        vertical-align: baseline;
        cursor: pointer;
        background: var(--secondary-background-color);
        border-bottom: 0;
      }

      .klog-article-content .link {
        position: relative;
      }

      /*media*/

      .klog-article-content klog-player-lite {
        width: 100%;
        --klog-player-border-radius: 5px;
        --klog-player-background-color: var(--klog-markdown-block-color);
      }

      .klog-article-content #content *:not([media])>[media] {
        --klog-media-width: initial;
      }

      .klog-article-content #content>[media] {
        @apply(--klog-markdown-media-container);
      }

      .klog-article-content klog-video,
      .klog-article-content klog-image {
        --klog-media-border-radius: 5px;
        max-width: 100%;
        border-radius: var(--klog-media-border-radius);
        @apply(--klog-markdown-media);
      }

      .klog-article-content [media] .description {
        color: var(--klog-markdown-secondary-text-color);
        padding: 12px 0 0;
        box-sizing: border-box;
        max-width: var(--klog-media-width, 100%);
        @apply(--klog-markdown-media-description);
      }

      .klog-article-content [media] .description::before {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        margin: 0 8px 0 0;
        background: var(--divider-color);
        clip-path: polygon(45% 0, 55% 0, 100% 80%, 0 80%);
        border-radius: 50%;
        transition: clip-path .3s ease;
      }

      .klog-article-content [media]:hover .description::before {
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      }

      .klog-article-content [media] .description .media-tip {
        opacity: 0.3;
      }

      .klog-article-content [media] .description .media-tip.with-text {
        margin-left: 8px;
      }

      .klog-article-content table {
        margin: 1em 0;
        text-align: left;
        background: var(--klog-markdown-block-color);
        padding: 16px 8px 16px 16px;
        border-radius: 5px;
      }

      .klog-article-content td {
        padding-right: 8px;
      }

      .klog-article-content .toc {
        position: relative;
        border-radius: 5px;
        margin: 2em 0;
        background: var(--klog-markdown-block-color);
      }

      .klog-article-content .toc-icon-container {
        position: absolute;
        left: 0px;
        top: -12px;
        height: 16px;
        z-index: 10;
      }

      .klog-article-content .toc-container {
        padding: 16px 8px 16px 16px;
        max-height: 33vh;
        overflow-y: auto;
      }

      .klog-article-content .toc-icon {
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
        position: absolute;
        left: 11px;
        color: var(--primary-color);
        width: 32px;
        height: 32px;
      }

      .klog-article-content .toc li {
        list-style: none;
        margin: 0;
      }

      .klog-article-content .toc>ol {
        padding-left: 0;
      }

      .klog-article-content .toc ol {
        counter-reset: section;
        list-style-type: none;
        margin: 0;
      }

      .klog-article-content .toc ol:after {
        content: none;
      }

      .klog-article-content .toc li>span {
        cursor: pointer;
      }

      .klog-article-content .toc li.selected:hover>span {
        text-decoration: underline;
      }

      /*list*/
      .klog-article-content ol,
      .klog-article-content ul,
      .klog-article-content ol>li,
      .klog-article-content ul>li {
        position: relative;
      }

      .klog-article-content ol>li,
      .klog-article-content ul>li {
        position: relative;
        margin: 0.5em 0;
      }

      /*custom list-style-type*/
      .klog-article-content ul {
        list-style-type: none;
      }

      .klog-article-content ul>li:not(.hide-number)>*:first-child:before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        position: absolute;
        left: -12px;
        top: calc(1em * var(--klog-markdown-line-height) / 2 - 3px);
        background-color: var(--klog-markdown-text-color);
        border-radius: 50%;
      }

      /*replace index if there is numbered heading*/
      .klog-article-content li.hide-number {
        list-style-type: none;
      }

      .klog-article-content li.hide-number>[depth] {
        transform: translateX(-12px);
      }

      /*indent line*/
      .klog-article-content ul>li>ul::after,
      .klog-article-content ol>li>ul::after,
      .klog-article-content ul>li>ol::after,
      .klog-article-content ol>li>ol::after {
        content: '';
        display: inline-block;
        width: 1px;
        position: absolute;
        left: -10px;
        top: 4px;
        bottom: 0;
        background-color: var(--border-color);
      }

      /*subtitle style for pure-text list*/
      .klog-article-content li>[secondary] {
        font-size: 0.9em;
        color: var(--klog-markdown-secondary-text-color);
      }

      /*breadcrumbs*/
      .klog-article-content .breadcrumbs {
        white-space: nowrap;
        overflow: hidden;
        font-size: 12px;
        text-overflow: ellipsis;
        cursor: default;
        user-select: none;
        -webkit-user-select: none;
      }

      .klog-article-content .breadcrumbs .collection,
      .klog-article-content .breadcrumbs .tags {
        display: inline;
      }

      .klog-article-content .breadcrumbs .collection[hidden],
      .klog-article-content .breadcrumbs .tags[hidden] {
        display: none !important;
      }

      .klog-article-content .breadcrumbs .tags {
        color: var(--klog-markdown-secondary-text-color);
      }

      .klog-article-content .breadcrumbs .tags::before {
        content: '/';
        margin: 0 8px;
        color: var(--klog-markdown-secondary-text-color);
      }

      .klog-article-content .breadcrumbs .collection:hover,
      .klog-article-content .breadcrumbs .tag:hover {
        cursor: pointer;
        text-decoration: underline;
      }

      .klog-article-content .breadcrumbs .tag:not(:first-child) {
        position: relative;
        padding-left: 6px;
      }

      /* heading actions */

      .klog-article-content .heading-actions {
        display: inline;
        margin-left: 8px;
      }

      .klog-article-content [depth] .heading-actions .button {
        width: 36px;
        height: 36px;
        line-height: 16px;
        opacity: 0;
        transition: opacity .1s ease;
      }

      .klog-article-content [depth]:hover .heading-actions .button {
        opacity: 1;
      }

      ::selection {
        background: var(--klog-markdown-selection-background);
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerKlogStyleMarkdown.content);
