import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-fit-behavior/iron-fit-behavior.js';
import '../style/klog-style-scrollbar.js';
import './klog-image.js';
import './klog-video.js';
import '../style/klog-style-markdown.js';
import '../data/klog-data-user.js';
import './klog-popup.js';
import './klog-markdown-scroller.js';
import '../lib/han.js';
import '../lib/han-style.js';
import '../lib/marked.js';
import '../lib/clamp.js';
import { getDefaultMarkdownPreference } from '../data/klog-data-preference.js';
class KlogMarkdown extends PolymerElement {
  static get template() {
    return html`
    <style include="klog-style-scrollbar"></style>
    <style include="klog-style-markdown"></style>
    <style include="han-style"></style>
    <klog-data-user disabled="" id="user"></klog-data-user>
    <klog-markdown-scroller id="scroller" link-prefix="{{linkPrefix}}"></klog-markdown-scroller>
    <article id="article" class="klog-article-content" theme\$="[[theme]]">
      <slot></slot>
      <div id="content"></div>
      <slot name="after"></slot>
    </article>
`;
  }

  static get is() { return 'klog-markdown'; }

  static get properties() {
    return {
      markdown: {
        type: String,
        observer: '_render'
      },
      theme: {
        type: String,
        value: 'dark',
        reflectToAttribute: true,
        observer: 'updateTheme'
      },
      linkPrefix: {
        type: String,
        value: '/'
      },
      hideIndependentTitle: {
        type: Boolean,
        value: false
      },
      collection: {
        type: String,
        notify: true
      },
      tags: {
        type: Array,
        notify: true
      },
      wordCount: {
        type: Number,
        notify: true
      },
      lazy: {
        type: Boolean,
        value: false
      },
      breadcrumbs: {
        type: Boolean,
        value: false
      },
      sanitize: {
        type: Boolean,
        value: true
      },
      disabled: {
        type: Boolean,
        value: false
      },
      preference: {
        type: Object
      },
      headingActions: {
        type: Boolean,
        value: false
      },
      tokens: {
        type: Array,
        notify: true
      },
    }
  }

  ready() {
    super.ready();

    //scroller
    this.$.scroller.$.markdown = this;
    this._initScroller();
  }

  updateScrollTarget(scrollTarget) {
    if (this.$.scrollTarget) {
      this.$.scrollTarget.removeEventListener('scroll', this._scrollHandler);
    }
    this.$.scrollTarget = scrollTarget;
    this.$.scroller.$.target = scrollTarget;
    this.$.scrollTarget.addEventListener('scroll', this._scrollHandler);
  }

  _initScroller() {
    this._scrollHandler = () => {
      let y = this.$.scrollTarget.scrollTop;
      // calculate intersecting list
      let intersectinglist = [];
      let items = this.$.article.querySelectorAll('[lazy]');
      for (let item of items) {
        let windowHeight = document.body.offsetHeight;
        let itemTop = item.getBoundingClientRect().top;
        let itemHeight = item.offsetHeight;
        if (itemTop + itemHeight >= 0 && itemTop <= windowHeight * 1.2) {
          intersectinglist.push(item);
        }
        if (itemTop > windowHeight) { break }
      }
      // lazy-load
      for (let item of intersectinglist) {
        item.lazyload();
      };
    };
  }

  updateTheme() {
    let elements = this.$.article.querySelectorAll('[theme]');
    for (let element of elements) {
      element.theme = this.theme;
    }
  }

  initRanderer() {
    let renderer = new marked.Renderer();

    renderer.heading = (text, depth) => {
      this._headingIndex += 1;
      let id = 'heading-' + this.BKDRHash(this._headingIndex + '-' + depth + '-' + text);
      let classList = '';
      classList += this.preference.centeredHeading == 'true' ? 'centered-heading ' : '';
      classList += this.preference.numberedHeading == 'true' ? 'numbered-heading ' : '';
      classList = classList ? `class="${classList}" ` : '';
      this._headings.push({ depth: depth, text: text, id: id });
      let actions = '';
      if (this.headingActions) {
        const hash = 'id-' + id;
        const button = `<paper-icon-button class="button" icon="link" for="${hash}" on-click="share"></paper-icon-button>`;
        actions = `<div class="heading-actions">${button}</div>`;
      }
      return `<h${depth} ${classList} id="${id}" depth="${depth}">${text}${actions}</h${depth}>\n`;
    };


    renderer.image = (href, text) => {
      let mediaType = 'image';
      if (href.match(/\.mp4$/i)) {
        mediaType = 'video';
      }
      let out = `<klog-${mediaType}  content
      ${(this.mobile || false) ? 'mobile' : ''}
      src="${href}"
      alt="${text}"
      theme="${this.theme}"
      ${this.lazy ? ` lazy` : ''}
      ></klog-${mediaType}>`;
      if (text) {
        out = `<div media description>${out}<div class="description">${text}</div></div>`;
      } else {
        out = `<div media>${out}</div>`;
      }
      return out;
    };

    renderer.code = (code, lang, escaped) => {
      this.initCodeRenderer();
      let classList = '';
      classList += this.preference.overflowCode == 'true' ? 'overflow-code ' : '';
      classList += lang ? 'has-meta' : '';
      classList = classList ? `class="${classList}" ` : '';
      let out = `<klog-render-code ${classList} lang="${lang || ''}" code="${escape(code)}" theme="${this.theme}"></klog-render-code>\n`;
      return out
    };

    renderer.link = function (href, text, link = {}) {
      let isSup = /^<span>\^/.test(text);
      text = isSup ? `${text.replace('^', '')}` : text || href;
      href = isSup ? '' : `href="${href}"`;
      let className = isSup ? ' class="sup"' : '';
      let out = `<a id="link" ${href}${className}>${text}</a>`;
      return link.ref ? `<span class="link">${out}<klog-popup for="link" theme="${this.theme}">${this.output(link.ref)}</klog-popup></span>` : out;
    };

    renderer.text = function (text) {
      return '<span>' + text + '</span>';
    }

    let block = {};

    block.toc = {
      reg: /^\n*\[toc\] *\n/i,
      lex: function (src, cap) {
        src = src.substring(cap[0].length);
        return { src: src, text: '' }
      },
      parse: () => {
        this._hasToc = true;
        return '<div class="toc"><div class="toc-icon-container"><iron-icon icon="bookmark" class="toc-icon"></iron-icon></div><div class="toc-container"></div></div>'
      }
    };

    block.at = {
      reg: /^@\(([\s\S]*?)\)(\[([\s\S]*?)\])?(?:\n+|$)/,
      lex: function (src, cap) {
        src = src.substring(cap[0].length);
        cap = [cap[1] ? marked.escape(cap[1]) : false, cap[3] ? marked.escape(cap[3]) : false];
        return { src: src, text: cap }
      },
      parse: (cap) => {
        this.collection = cap[0] || '';
        this.tags = cap[1] ? cap[1].toLowerCase().split(',') : [];
        if (this.breadcrumbs) {
          return `
          <div class="breadcrumbs" dont-count>
          <div class="collection">${cap[0] || '日常'}</div>
          ${cap[1]
              ? `<div class="tags">${this.tags.map(t => `<span class="tag">${t}</span>`)}</div>`
              : ''
            }
          </div>`;
        } else {
          return `<!--collection:${cap[0]};tags:${this.tags}-->`;
        }
      }
    };

    block.reflink = {
      reg: /^\[(\^?.*?)\]:\s*([\s\S]*?)(?:\n+|$)/,
      lex: (src, cap, links = {}) => {
        src = src.substring(cap[0].length);
        links[cap[1].toLowerCase()] = {
          href: '',
          ref: cap[2]
        };
        return { src: src, text: '' }
      },
      parse: (cap) => {
        return cap
      }
    };

    let inline = {};

    inline.katex = {
      reg: /^\$([^\$]+?)\$/,
      parse: (src, cap) => {
        this.initKatexRenderer();
        src = src.substring(cap[0].length);
        cap = marked.escape(cap[0].replace(/\$/gm, ''));
        return {
          src: src,
          text: `<klog-render-katex code="${cap}"><code lang="latex">${cap}</code></klog-render-katex>`
        };
      }
    };

    inline.katexblock = {
      reg: /^\$\$([^\$]+?)\$\$/,
      parse: (src, cap) => {
        this.initKatexRenderer();
        src = src.substring(cap[0].length);
        cap = marked.escape(cap[0].replace(/\$\$/gm, ''));
        return {
          src: src,
          text: `<klog-render-katex code="${cap}" block><code lang="latex">${cap}</code></klog-render-katex>`
        };
      }
    };

    let inlineText = /^[\s\S]+?(?=[\\<!\[`*\$~]|https?:\/\/|ftp:\/\/|www\.|[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}\$~-]+@|\b_| *\n|$)/;

    this.options = {
      gfm: true,
      tables: true,
      breaks: true,
      sanitize: this.sanitize,
      renderer: renderer,
      block: block,
      inline: inline,
      inlineText: inlineText
    };
  }

  share(e) {
    this.$.scroller.generateLink(e.target.getAttribute('for'));
  }

  BKDRHash(str) {
    str += '';
    var seed = 131;  //  31 131 1313 13131 131313 etc..
    var hash = 0, i = 0;
    while (i < str.length) {
      hash = parseFloat(((hash * seed) & 0xFFFFFFFF) >>> 0) + str.charCodeAt(i++);
    }
    return (hash & 0x7FFFFFFF);
  }

  initKatexRenderer() {
    if (!this._isKatexInit) {
      import('./klog-render-katex.js');
      this._isKatexInit = true;
    }
  }

  initCodeRenderer() {
    if (!this._isCodeInit) {
      import('./klog-render-code.js');
      this._isCodeInit = true;
    }
  }

  _updateWordCount() {
    let sum = 0;
    for (let element of this.$.content.children) {
      if (!element.hasAttribute('dont-count')) {
        sum += element.innerText
          .replace(/(\r\n+|\s+|　+)+/g, "龘")
          .replace(/[\x00-\xff]/g, "m")
          .replace(/m+/g, "*")
          .replace(/龘/g, "")
          .length;
      }
    }
    this.wordCount = sum;
  }

  _updateHeadings() {
    let headings = this._headings;

    // if there is no headings
    if (headings.length == 0) {
      this.hasIndependentTitle = false;
      return;
    }

    // determine independent title
    let sortedHeadings = Array.from(headings); //copy array fro sorting
    sortedHeadings.sort((a, b) => a.depth - b.depth);
    this.hasIndependentTitle = false;
    if (sortedHeadings.length == 1) {
      // 如果只有一个标题，则它是独立标题
      sortedHeadings[0].isIndependentTitle = true;
      this.hasIndependentTitle = true;
    } else if (sortedHeadings[0].depth != sortedHeadings[1].depth && sortedHeadings[0] === headings[0]) {
      // 如果第一个标题是唯一的最高级标题，则它是独立标题
      sortedHeadings[0].isIndependentTitle = true;
      this.hasIndependentTitle = true;
    }

    let numbers = [0, 0, 0, 0, 0, 0];
    let bottom = this.hasIndependentTitle ? sortedHeadings[0].depth + 1 : sortedHeadings[0].depth; // min of headings.depth

    // calculate number
    for (let heading of headings) {
      if (heading.isIndependentTitle) {
        heading.number = '';
        continue;
      }
      let depth = heading.depth - bottom;
      numbers[depth] += 1;
      for (let i = 0; i < 5 - depth; i++) {
        numbers[depth + 1 + i] = 0;
      }
      heading.number = numbers.slice(0, depth + 1).join('.') + '.';
    }

    // update heading elements
    const numbered = this.preference.numberedHeading;
    for (let heading of headings) {
      const element = this.$.content.querySelector(`#${heading.id}`);
      if (heading.isIndependentTitle) {
        if (this.hideIndependentTitle) {
          element.parentNode.removeChild(element);
        } else {
          element.setAttribute('independent-title', '');
        }
        continue;
      }
      if (numbered == 'true' || this._hasToc && numbered == 'auto') {
        let numberSpan = element.querySelector('.heading-number');
        if (numberSpan) { numberSpan.parentNode.removeChild(numberSpan) }
        element.innerHTML = `<span class="heading-number">${heading.number}</span> ${element.innerHTML}`;
      }
    }

    // update toc elements
    let tocs = this.$.content.querySelectorAll('.toc-container');
    let tocHTML = '';
    if (tocs.length > 0) {
      let depth = bottom, lastDepth = 0, outDepth = 0;
      for (let heading of headings) {
        let newli = '';
        if (!heading.isIndependentTitle && heading.depth - bottom < 3) {
          if (heading.text) newli = `<li target="id-${heading.id}" depth="${depth}"><span>${heading.number}  ${heading.text}</span>`;
          if (heading.depth == depth) {
            tocHTML += `</li>${newli}`;
          }
          while (heading.depth > depth) {
            ++depth;
            tocHTML += `<ol>${newli}`;
          }
          while (heading.depth < depth) {
            --depth;
            tocHTML += '</li></ol>';
            if (heading.text && heading.depth == depth) tocHTML += `</li>${newli}`;
          }
        }
      }
      for (let toc of tocs) {
        toc.innerHTML = tocHTML;
      }
    }

    // set toc event
    let links = this.$.content.querySelectorAll('div.toc li');
    for (let link of links) {
      link.addEventListener('mouseover', (e) => {
        e.stopPropagation();
        let _selected = this.$.content.querySelector('li.selected');
        if (_selected) _selected.classList.remove('selected');
        e.currentTarget.classList.add('selected');
      });
    }

    // add scroll event
    let scrollLinks = this.$.content.querySelectorAll('[target]');
    for (let link of scrollLinks) {
      let target = link.getAttribute('target');
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.$.scroller.updateQueryByHash(e.currentTarget.getAttribute('target'));
        this.$.scroller.scroll();
      });
    }
  }

  _updateLists() {
    // secondary-text
    let lists = this.$.content.querySelectorAll('li');
    for (let list of lists) {
      let children = list.children;
      let hasbr = false;
      for (let child of children) {
        if (child.tagName == 'BR') {
          hasbr = true;
          continue;
        }
        if (hasbr &&
          (child.tagName == 'SPAN'
            || child.tagName == 'EM'
            || child.tagName == 'DEL'
            || child.tagName == 'STRONG'
            || child.tagName == 'CODE'
            || child.tagName == 'KLOG-RENDER-KATEX' && !child.hasAttribute('block')
          )
        ) {
          child.setAttribute('secondary', '');
        }
      }
    }
    // hide number
    const numbered = this.preference.numberedHeading;
    if (numbered == 'true' || this._hasToc && numbered == 'auto') {
      let lists = this.$.content.querySelectorAll('li>[depth]:first-child');
      for (let list of lists) {
        list.parentNode.classList.add('hide-number');
      }
    }
  }

  _updateEvents() {
    let triggers = this.$.content.querySelectorAll('[on-click]');
    for (let trigger of triggers) {
      const bindFunction = trigger.getAttribute('on-click');
      trigger.addEventListener('click', e => { this[bindFunction](e) });
    }
  }

  _render() {
    if (!this.disabled) {
      this.render();
    }
  }

  waitPlaceholders() {
    const promises = [];
    const placeholders = this.$.content.querySelectorAll('klog-image,klog-render-code');
    for (let placeholder of placeholders) {
      promises.push(placeholder.placeHolderPromise);
    }
    return Promise.all(promises).then(() => new Promise(resolve => {
      setTimeout(resolve, 1500);
    }));
  }

  render(markdown, headless = false) {
    markdown = markdown || this.markdown;
    // load renderer
    if (!this.option) {
      this.initRanderer();
    }
    //load preference
    if (!this.preference) {
      this.preference = getDefaultMarkdownPreference();
    }
    // reset attributes
    if (!headless) this.$.content.innerHTML = '';
    this.collection = 'Daily';
    this.tags = [];
    this._headingIndex = 0;
    this._headings = [];
    this._hasToc = false;
    // no markdown
    if (!markdown) {
      this.$.scroller.reset();
      this._updateWordCount();
      return;
    }
    // translate markdown
    return new Promise(resolve => {
      marked(markdown, this.options, (err, out, tokens) => {
        if (err) throw err;
        this.tokens = tokens;
        if (headless) {
          resolve(tokens);
          return;
        }
        this._reflinks = tokens.links;
        //render
        this.$.content.innerHTML = out.replace(/<p>(<div media description>[\s\S\n]*?)<\/p>/g, '$1');
        //post-update
        this._updateHeadings();
        this._updateLists();
        this._updateEvents();
        // word count
        this._updateWordCount();
        //Han
        Han(this.$.article, this.$.article).render();
        setTimeout(() => this.dispatchEvent(new CustomEvent('markdown-rendered', { bubbles: true, composed: true })), 1);
        // scroller
        if (this.$.scroller.query) {
          this.waitPlaceholders().then(() => this.$.scroller.scroll());
        }
        // lazy load image
        if (this.lazy) setTimeout(() => this._scrollHandler(), 1000);
        // resolve
        resolve(tokens);
      });
    });
  }
}

window.customElements.define(KlogMarkdown.is, KlogMarkdown);
