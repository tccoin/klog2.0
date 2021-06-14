import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '../ui/klog-image.js';
import '../ui/klog-markdown.js';
import { KlogDataMessageMixin } from './klog-data-message-mixin.js';
class KlogDataEditor extends KlogDataMessageMixin(PolymerElement) {
  static get template() {
    return html ``;
  }

  static get is() { return 'klog-data-editor'; }

  static get properties() {
    return {
      articleId: {
        type: String,
        notify: true,
      },
      markdown: {
        type: String,
        notify: true,
      },
      tokens: {
        type: Array,
        observer: '_tokensChanged'
      },
      title: {
        type: String,
        notify: true,
      },
      data: {
        type: Object,
        notify: true,
      },
      path: {
        type: String,
        observer: '_pathChanged',
        notify: true,
      },
      randomPath: {
        type: String,
        notify: true,
      },
      license: {
        type: String,
        notify: true,
      },
      displayPath: {
        type: String,
        notify: true,
      },
      private: {
        type: Boolean,
        notify: true,
      },
      attachments: {
        type: Array,
        notify: true,
      },
      previews: {
        type: Array,
        notify: true,
      },
      currentLine: {
        type: String,
        observer: '_updatePreviews',
      },
      fileinfo: {
        type: Object,
        observer: '_updateFileinfo',
      },
      quiet: {
        type: Boolean,
        value: false
      },
      error: {
        type: String,
        notify: true
      },
      wordCount: {
        type: Number
      },
    }
  }

  ready() {
    super.ready();
    if (!this.userinfo) {
      this.userinfo = { publicinfo: { id: null } }
    }
  }

  _tokensChanged(tokens) {
    this._updateTitle(tokens);
    this._updateMeta(tokens);
    return this._updateAttachments(tokens);
  }

  _updateTitle(tokens) {
    let title = '';
    let depth = 7;
    for (let token of tokens) {
      if (token.type == 'heading' && token.depth < depth) {
        title = token.text;
        depth = token.depth;
        if (depth == 1) break
      }
    }
    this.title = title;
  }

  _updateMeta(tokens) {
    let text = '';
    let collection = '日常';
    let tags = [];
    let keywords = [];
    for (let token of tokens) {
      if (token.type == 'blockquote_start') text += '"';
      else if (token.type == 'blockquote_end') text = text.substr(0, text.length - 1) + '" ';
      else if (token.type == 'at') {
        collection = token.text[0];
        if (token.text[1]) {
          tags = token.text[1].split(',');
        }
      } else if (token.type == 'paragraph' || token.type == 'text') {
        if (text.length > 300) continue
        let out = this._caculateSummary(token.text);
        text += out ? out + ' ' : '';
      } else if (token.type == 'heading') {
        keywords.push(this.unescape(token.text));
      }
    }
    text = text.trim();
    this.text = text;
    this.collection = collection;
    this.tags = tags;
    this.keywords = keywords;
  }

  _caculateSummary(text) {
    return [].concat(text
        .replace(/@\(([\s\S]*?)\)(\[([\s\S]*?)\])?/g, '') // at
        .replace(/\[toc\]/ig, '') // toc
        .replace(/^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\n? *\1 *(?:\n+|$)/ig, '\\[代码\\]') // toc
        .replace(/\${1,2}([\s\S]+?)\${1,2}/g, '\\[公式\\]') // katex
        .replace(/~{1,2}[\s\S]+~{1,2}/g, '\\[Biii\\]') // del
        .replace(/!\[(.*)\]\(.*\)/g, '\\[图片\\]') // image
        .replace(/\[<V>.*\]\(.*\)/g, '\\[视频\\]') // video
        .replace(/\[(.*)\]\(.*\)/g, '$1') // link
        .match(/\\[<!\[\]_~\*`\$]|[^<!\[\]_~\*`\$]/g))
      .join('')
      .replace(/\\([\\`*{}\[\]\$()#+\-.!_>~|])/g, '$1')
      .replace(/\n/g, '')
  }

  _generateMarkdownParser() {
    const parser = document.createElement('klog-markdown');
    parser.initRanderer();
    return parser;
  }

  async _generateTokens(markdown) {
    let parser = this._generateMarkdownParser();
    this._parser = parser;
    let tokens = await parser.render(markdown, true);
    await this._tokensChanged(tokens);
  }

  _updateAttachments(tokens) {
    let renderer = new marked.Renderer();
    this.image = {};
    this.attachments = [];
    for (let _token of tokens.filter(t => 'inline' in t)) {
      for (let token of _token.inline) {
        if (!token.href) continue;
        let attachment = {
          url: token.href,
          text: this.unescape(token.text)
        };
        if (token.type == 'image') {
          if (/\.mp4$/i.test(token.href)) {
            attachment.video = true;
          } else {
            attachment.image = true;
            if (!('url' in this.image)) {
              this.image = attachment;
            }
          }
        } else {
          if (/^https:\/\/storage\.krrr\.party\/.*/.test(token.href)) {
            attachment.file = true;
          } else {
            attachment.link = true;
          }
        }
        this.attachments.push(attachment);
      }
    }
    return this._updatePlaceholders(this.attachments);
  }

  async _updatePlaceholders(attachments) {
    this._image = this._image || document.createElement('klog-image');
    for (let image of attachments.filter(x => x.image)) {
      let placeholder = await this._image.loadPlaceholder(this._image.encode(image.url), true);
      image.entropy = placeholder.stats ? placeholder.stats.entropy : 0;
    }
  }

  _updatePreviews(currentLine) {
    let lexer = new marked.Lexer();
    let tokens = lexer.lex(currentLine);
    let renderer = new marked.Renderer();
    this.previews = [];
    renderer.image = (href, title, text = '') => {
      let preview = {
        image: true,
        url: href,
        text: this.unescape(text),
      }
      if (title) {
        preview.title = title;
      }
      this.push('previews', preview);
      return '';
    };
    let Inlinelexer = new marked.InlineLexer(tokens.links, { gfw: true, renderer: renderer });
    Inlinelexer.output(currentLine);
  }

  unescape(str) {
    // explicitly match decimal, hex, and named HTML entities
    return str.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function(_, n) {
      n = n.toLowerCase();
      if (n === 'colon') return ':';
      if (n.charAt(0) === '#') {
        return n.charAt(1) === 'x' ?
          String.fromCharCode(parseInt(n.substring(2), 16)) :
          String.fromCharCode(+n.substring(1));
      }
      return '';
    });
  }

  _generateRandomPath() {
    this.randomPath = 'article-' + Math.floor(Math.random() * 1000000 + 100000);
    this._checkDuplicatePath(0);
  }

  _pathChanged() {
    if (this._verifyPath()) {
      this._checkDuplicatePath();
    }
  }

  _checkDuplicatePath(timeout = 500) {
    let path = this.path || this.randomPath;
    if (!path) return;
    if (this._checkDuplicatePathTimeout) {
      clearTimeout(this._checkDuplicatePathTimeout);
    }
    this._checkDuplicatePathTimeout = setTimeout(() => {
      this._checkDuplicatePathTimeout = false;
      let query = new AV.Query('Article');
      query.equalTo('path', path);
      query.select(['path']);
      query.find().then((results) => {
        this._pathUsed = false;
        if (results.length != 0) {
          let articleIsEmpty = !this.path && !this.articleId;
          const thatIsThis = results[0].id == this.articleId;
          if (articleIsEmpty) {
            this._generateRandomPath();
          } else if (!thatIsThis) {
            this.error = new Error('path used');
            this._pathUsed = true;
          }
        }
      }, (err) => console.log(err));
    }, timeout);
  }

  _verifyPath() {
    const illegalRe = /[^\d\w-]/g;
    if (this.path && illegalRe.test(this.path)) {
      this.path = this.path.replace(illegalRe, '-').replace(/-+/g, '-');
      this.error = new Error('path illegal');
      return false;
    } else {
      return true;
    }
  }

  _updateFileinfo(fileinfo) {
    let url = fileinfo.host + '/' + fileinfo.key;
    let mimeType = fileinfo.mimeType;
    let out;
    if (mimeType.indexOf('image') > -1) {
      out = `![](${url})`;
      this.editor.$.textarea.insertLine('', out);
    } else if (/\.mp4$/i.test(fileinfo.key)) {
      out = `![${fileinfo.fname}](${url})`;
      this.editor.$.textarea.insertLine('', out);
    } else {
      out = `[${fileinfo.fname}](${url})`;
      if (mimeType.indexOf('video') > -1) {
        this.dispatchEvent(new CustomEvent('editor-exception', { bubbles: true, composed: true, detail: { exceptionType: 'unsupported-video' } }));
      }
      this.editor.$.textarea.insert(out);
    }
  }

  reset(requestNewPath = false) {
    this.markdown = '@(笔记)[]';
    this.title = null;
    this.path = '';
    this.previews = [];
    this.attachments = [];
    if (requestNewPath) {
      this._generateRandomPath();
    }
  }

  load() {
    let article = AV.Object.createWithoutData('Article', this.articleId);
    return article.fetch()
      .then(data => {
        if (!data.get('updatedAt')) {
          this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: 'editor/' } }));
          this.reset(true);
          return
        }
        data = Object.assign({ private: true }, data.toJSON());
        if (!AV._config.useMasterKey) {
          if (this.userinfo == undefined || data.author.objectId != this.userinfo.publicinfo.id) {
            this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page: '404' } }));
            return;
          }
        }
        this.markdown = data.markdown;
        this.path = data.path;
        this.license = data.license;
        this.randomPath = data.path;
        this.private = data.private;
        this.data = data;
        return;
      });
  }

  async save() {
    // create or update
    let article;
    if (this.wordCount == 0 && this.attachments.length == 0) {
      return Promise.reject(new Error('empty'));
    }
    if (this.articleId) {
      article = AV.Object.createWithoutData('Article', this.articleId);
    } else {
      article = new AV.Object('Article');
      this.quiet = false;
    }
    // pointer
    let topic = AV.Object.createWithoutData('Topic', '59bcb4d3128fe158340be1b5');
    // path
    if (this._pathUsed) {
      return Promise.reject(new Error('path used'));
    }
    if (this.path != '') {
      if (!this._verifyPath()) {
        return Promise.reject(new Error());
      } else if (this.path.length < 6) {
        return Promise.reject(new Error('path too short'));
      } else if (this.path[0] == '-') {
        return Promise.reject(new Error('path start with hyphen'));
      }
    }
    // attachments
    if (this.tokens == undefined) {
      await this._generateTokens(this.markdown);
    }
    // set attributes
    article.set('title', this.title);
    article.set('markdown', this.markdown);
    article.set('text', this.text);
    article.set('path', this.path || this.randomPath);
    article.set('license', this.license || 'default');
    article.set('private', this.private);
    article.set('image', this.image);
    article.set('attachments', this.attachments);
    article.set('collection', this.collection);
    article.set('tags', this.tags);
    article.set('keywords', this.keywords);
    article.set('topic', topic);
    if (this.quiet) {
      console.log('Updated in quite mode.');
      article.set('updateTimeline', false);
    } else {
      let author = AV.Object.createWithoutData('UserPublic', this.userinfo.publicinfo.id);
      article.set('author', author);
      article.set('updateTimeline', true);
    }
    // save article
    article = await article.save();
    // send message
    if (!this.quiet) {
      const update = (messageId) => this.updateMessage(messageId, 'article-update');
      try {
        const message = await this.loadMessageByChannel(`article-article-${article.id}`, this.userinfo.publicinfo.id);
        if ((Date.now() - Date.parse(message.updatedAt)) > 6 * 1000) {
          /* create a article-create message */
          update(message.objectId);
          console.log('update message');
        }
      } catch (err) {
        if (err.message == 'message not found') {
          console.log('create message');
          /* create a article-create message */
          this.createMessage('article-create', this.userinfo.publicinfo.id, [
            `article-user-${this.userinfo.publicinfo.id}`,
            `article-article-${article.id}`,
            `article-all`
          ], {}, article.id);
        }
      }
    }

    return article;
  }

  delete() {
    let article = AV.Object.createWithoutData('Article', this.articleId);
    return article.destroy();
  }
}

window.customElements.define(KlogDataEditor.is, KlogDataEditor);