const containerPrismStyle = document.createElement('template');

containerPrismStyle.innerHTML = `<dom-module id="prism-style">
  <template>
    <style>
      [theme~=dark] code[class*="language-"],
      [theme~=dark] pre[class*="language-"] {
        color: #ABB2BF;
      }

      [theme~=dark] pre[class*="language-"]::-moz-selection,
      [theme~=dark] pre[class*="language-"] ::-moz-selection,
      [theme~=dark] code[class*="language-"]::-moz-selection,
      [theme~=dark] code[class*="language-"] ::-moz-selection {
        background: #383e49;
      }

      [theme~=dark] pre[class*="language-"]::selection,
      [theme~=dark] pre[class*="language-"] ::selection,
      [theme~=dark] code[class*="language-"]::selection,
      [theme~=dark] code[class*="language-"] ::selection {
        background: #9aa2b1;
      }

      [theme~=dark] .token.comment,
      [theme~=dark] .token.prolog,
      [theme~=dark] .token.doctype,
      [theme~=dark] .token.cdata {
        color: #5C6370;
      }

      [theme~=dark] .token.punctuation {
        color: #abb2bf;
      }

      [theme~=dark] .token.selector,
      [theme~=dark] .token.tag {
        color: #e06c75;
      }

      [theme~=dark] .token.property,
      [theme~=dark] .token.boolean,
      [theme~=dark] .token.number,
      [theme~=dark] .token.constant,
      [theme~=dark] .token.symbol,
      [theme~=dark] .token.attr-name,
      [theme~=dark] .token.deleted {
        color: #d19a66;
      }

      [theme~=dark] .token.string,
      [theme~=dark] .token.char,
      [theme~=dark] .token.attr-value,
      [theme~=dark] .token.builtin,
      [theme~=dark] .token.inserted {
        color: #98c379;
      }

      [theme~=dark] .token.operator,
      [theme~=dark] .token.entity,
      [theme~=dark] .token.url,
      [theme~=dark] .language-css .token.string,
      [theme~=dark] .style .token.string {
        color: #56b6c2;
      }

      [theme~=dark] .token.atrule,
      [theme~=dark] .token.keyword {
        color: #c678dd;
      }

      [theme~=dark] .token.function {
        color: #61afef;
      }

      [theme~=dark] .token.regex,
      [theme~=dark] .token.important,
      [theme~=dark] .token.variable {
        color: #c678dd;
      }

      [theme~=dark] .token.important,
      [theme~=dark] .token.bold {
        font-weight: bold;
      }

      [theme~=dark] .token.italic {
        font-style: italic;
      }

      [theme~=dark] .token.entity {
        cursor: help;
      }

      [theme~=dark] pre.line-numbers {
        position: relative;
        padding-left: 3.8em;
        counter-reset: linenumber;
      }

      [theme~=dark] pre.line-numbers>code {
        position: relative;
      }

      [theme~=dark] .line-numbers .line-numbers-rows {
        position: absolute;
        pointer-events: none;
        top: 0;
        font-size: 100%;
        left: -3.8em;
        width: 3em;
        /* works for line-numbers below 1000 lines */
        letter-spacing: -1px;
        border-right: 0;

        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      [theme~=dark] .line-numbers-rows>span {
        pointer-events: none;
        display: block;
        counter-increment: linenumber;
      }

      [theme~=dark] .line-numbers-rows>span:before {
        content: counter(linenumber);
        color: #5C6370;
        display: block;
        padding-right: 0.8em;
        text-align: right;
      }

      [theme~=light] code,
      [theme~=light] code[class*='language-'],
      [theme~=light] pre[class*='language-'] {
        color: #333;
      }

      [theme~=light] .token.comment,
      [theme~=light] .token.prolog,
      [theme~=light] .token.doctype,
      [theme~=light] .token.cdata {
        color: #b6ad9a;
      }

      [theme~=light] .token.punctuation {
        color: #b6ad9a;
      }

      [theme~=light] .token.namespace {
        opacity: .7;
      }

      [theme~=light] .token.tag,
      [theme~=light] .token.operator,
      [theme~=light] .token.number {
        color: #063289;
      }

      [theme~=light] .token.property,
      [theme~=light] .token.function {
        color: #b29762;
      }

      [theme~=light] .token.tag-id,
      [theme~=light] .token.selector,
      [theme~=light] .token.atrule-id {
        color: #2d2006;
      }

      [theme~=light] code.language-javascript,
      [theme~=light] .token.attr-name {
        color: #896724;
      }

      [theme~=light] code.language-css,
      [theme~=light] code.language-scss,
      [theme~=light] .token.boolean,
      [theme~=light] .token.string,
      [theme~=light] .token.entity,
      [theme~=light] .token.url,
      [theme~=light] .language-css .token.string,
      [theme~=light] .language-scss .token.string,
      [theme~=light] .style .token.string,
      [theme~=light] .token.attr-value,
      [theme~=light] .token.keyword,
      [theme~=light] .token.control,
      [theme~=light] .token.directive,
      [theme~=light] .token.unit,
      [theme~=light] .token.statement,
      [theme~=light] .token.regex,
      [theme~=light] .token.atrule {
        color: #728fcb;
      }

      [theme~=light] .token.placeholder,
      [theme~=light] .token.variable {
        color: #93abdc;
      }

      [theme~=light] .token.deleted {
        text-decoration: line-through;
      }

      [theme~=light] .token.inserted {
        border-bottom: 1px dotted #2d2006;
        text-decoration: none;
      }

      [theme~=light] .token.italic {
        font-style: italic;
      }

      [theme~=light] .token.important,
      [theme~=light] .token.bold {
        font-weight: bold;
      }

      [theme~=light] .token.important {
        color: #896724;
      }

      [theme~=light] .token.entity {
        cursor: help;
      }


      [theme~=light]
      /* overrides color-values for the Line Numbers plugin
[theme~=light]  * http://prismjs.com/plugins/line-numbers/
[theme~=light]  */

      [theme~=light] .line-numbers .line-numbers-rows {
        border-right-color: #ece8de;
      }

      [theme~=light] .line-numbers-rows>span:before {
        color: #cdc4b1;
      }


      [theme~=light]
      /* overrides color-values for the Line Highlight plugin
[theme~=light]  * http://prismjs.com/plugins/line-highlight/
[theme~=light]  */

      [theme~=light] .line-highlight {
        background: rgba(45, 32, 6, 0.2);
        background: -webkit-linear-gradient(left, rgba(45, 32, 6, 0.2) 70%, rgba(45, 32, 6, 0));
        background: linear-gradient(to right, rgba(45, 32, 6, 0.2) 70%, rgba(45, 32, 6, 0));
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(containerPrismStyle.content);
