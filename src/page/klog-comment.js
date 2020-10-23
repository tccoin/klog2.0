import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KlogDataCommentMixin } from '../data/klog-data-comment-mixin.js';
import '@polymer/paper-button/paper-button.js';
import '../ui/klog-icons.js';
import '../style/klog-style-author.js';
import './klog-editor-textarea.js';

class KlogComment extends KlogDataCommentMixin(PolymerElement) {
  static get template() {
    return html `
    <style include="klog-style-author"></style>
    ${this.styleTemplate}
    <klog-data-comment id="data"></klog-data-comment>
    ${this.inputTemplate}
    ${this.commentTemplate}
`;
  }

  static get styleTemplate() {
    return html `
    <style>
      :host {
        display: block;
        padding: 56px 16px 0;
        --klog-markdown-padding: 0px;
        --klog-markdown-font-size: 14px;
        --textarea-padding: 0;
      }

      iron-icon{
        margin-right:8px;
      }

      .klog-author .comment-content {
        padding: 16px;
        margin: 0 0 20px;
        background: var(--primary-background-color);
        border-radius: 5px;
        width: fit-content;
        max-width: 100%;
        box-sizing: border-box;
        @apply(--shadow-elevation-2dp);
      }

      .input-container .comment-content{
        cursor: text;
        width: 100%;
      }

      .input-container,
      .klog-author-primary{
        margin-bottom: 20px;
      }

      klog-editor-textarea{
        background: none;
      }

      #replyButton{
       margin: 8px 0 -12px -12px;
      }

      .klog-author .author-info{
        margin-bottom: 4px;
        white-space: nowrap;
      }

      .klog-author .author-action{
        overflow: hidden;
        flex-shrink: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-left: 2px;
      }

      .klog-author .author-avatar{
        width: 40px;
        height: 40px;
        @apply(--shadow-elevation-4dp);
      }

      .klog-author .author-avatar,
      .klog-author .author-name{
        cursor: pointer;
      }

      .klog-author .author-name:hover{
        text-decoration: underline;
      }

      .input-container .author-avatar{
        cursor: default;
      }

      .klog-author .text{
        width: calc(100% - 52px);
      }

      .klog-author .actions{
        text-align: right;
        opacity: 0;
        transition: opacity .2s ease;
      }

      .klog-author .actions a{
        margin-right: 8px;
        cursor: pointer;
      }

      .klog-author .actions a:hover{
        color: var(--primary-text-color);
      }

      .klog-author.input-container .actions,
      .klog-author:hover>.text>.author-info> .actions{
        opacity: 1;
      }

      [hidden]{
        display: none!important;
      }

      @media (min-width: 769px) {
        klog-markdown {
          --klog-media-width: 584px;
        }
      }

      @media (max-width: 767px) {
        .klog-author .actions{
          display: none;
        }
        .klog-author.input-container .actions{
          display: block;
        }
        .klog-author .author-avatar{
          margin-right: 12px;
        }
      }
    </style>`
  }

  static get inputTemplate() {
    return html `
    <div class="klog-author input-container">
      <klog-image class="author-avatar" src="{{_userAvatarUrl}}" avatar></klog-image>
      <div class="text">
        <div class="author-info">
          <!--<span class="author-name">{{userinfo.displayName}}</span>-->
          <span class="author-action">
            {{_inputIndicator}}
          </span>
          <div class="actions" hidden="{{_calcCancelButtonDisabled(_inputMethod)}}">
            <div class="dot-divider"></div>
            <a on-click="resetInput">取消</a>
          </div>
        </div>
        <div class="comment-content" on-click="focus">
          <klog-editor-textarea id="input" placeholder="聊天鬼才你来啦！(＾o＾)ﾉ"></klog-editor-textarea>
          <paper-button on-click="_submitComment" id="replyButton"><iron-icon icon="save_alt"></iron-icon>评论</paper-button>
        </div>
      </div>
    </div>`
  }

  static get commentTemplate() {
    const generateComments = (isPrimary, slot = '') => {
      const item = isPrimary ? 'primary' : 'secondary';
      return `
        <template is="dom-repeat" items="{{${isPrimary ? 'data' : 'primary.secondary'}}}" as="${item}">
          <div class="klog-author klog-author-${item}" comment-data="{{${item}}}" on-click="_tapHandle">
            <klog-image class="author-avatar" on-click="openZone" src="{{${item}.author.avatarUrl}}" ${!isPrimary ? 'hidden' : ''} avatar></klog-image>
            <div class="text">
              <div class="author-info">
                <span class="author-name" on-click="openZone">{{${item}.author.displayName}}</span>
                <span class="author-action">
                  ${isPrimary ? '评论了文章' : '回复了{{' + item + '.replyToAuthor.displayName}}'}
                </span>
                <div class="dot-divider"></div>
                <klog-render-timestamp time-stamp="{{_parseDate(${item}.createdAt)}}" hidden="{{${item}.deleted}}"></klog-render-timestamp>
                <div class="actions">
                  <div class="dot-divider"></div>
                  <a on-click="_replyComment">回复</a>
                  <a on-click="_editComment" hidden="{{!_isAuthor(${item})}}">编辑</a>
                  <a on-click="_deleteComment" hidden="{{!_isAuthor(${item})}}">删除</a>
                </div>
              </div>
              <div class="comment-content">
                <klog-markdown markdown="{{${item}.markdown}}" mobile="{{mobile}}" theme="{{theme}}" lazy-init lazy></klog-markdown>
              </div>
              ${slot}
            </div>
          </div>
        </template>`;
    }
    return html([generateComments(true, generateComments(false))]);
  }

  static get is() { return 'klog-comment'; }

  static get properties() {
    return {
      articleId: {
        type: String
      },
      articleAuthorId: {
        type: String
      },
      data: {
        type: Array
      },
      theme: {
        type: String
      },
      mobile: {
        type: Boolean
      },
      login: {
        type: Boolean
      },
    }
  }

  static get observers() {
    return [
      'refresh(articleId)',
      '_updateUserinfo(login)'
    ];
  }

  ready() {
    super.ready();
    this.updateInput('create');
    this.$.input.addEventListener('input', () => this._checkUserLogin());
  }

  lazyload() {
    this.refresh();
  }

  async refresh() {
    this.data = await this.loadComments(this.articleId);
    setTimeout(() => {
      this._updateMarkdownScroller();
    }, 1);
  }

  updateScrollTarget(scrollTarget) {
    this.$.scrollTarget = scrollTarget;
    this._updateMarkdownScroller();
  }

  updateInput(method, data = null) {
    this._inputMethod = method;
    this._inputData = data;
    if (method == 'create') {
      this._inputIndicator = '评论文章';
    } else {
      if (method == 'edit') {
        this._inputIndicator = '修改评论';
        this.$.input.value = data.markdown;
      } else if (method == 'reply' && this._isAuthor(data)) {
        this._inputIndicator = '回复自己';
      } else if (method == 'reply') {
        this._inputIndicator = '回复' + data.author.displayName;
      }
    }
  }

  resetInput() {
    this.$.input.value = '';
    this.updateInput('create');
  }

  focus() {
    this.$.input.$.input.$.textarea.focus();
  }

  _isAuthor(data) {
    if (this.login) {
      const userId = this.userinfo.publicinfo.id;
      const replyToAuthorId = data.author.objectId;
      return userId == replyToAuthorId;
    } else {
      return false;
    }
  }

  openZone(e) {
    e.stopPropagation();
    const commentData = this._getCommentData(e.target);
    const page = 'zone/' + commentData.author.objectId;
    this.dispatchEvent(new CustomEvent('app-load', { bubbles: true, composed: true, detail: { page } }));
  }

  async _submitComment() {
    const method = this._inputMethod;
    const data = this._inputData;
    if (this.$.input.value.length == 0) {
      this.showToast('什么话都不说，这是坠好的！');
      return;
    } else if (method == 'create') {
      const comment = await this.createComment(this.articleId, this.articleAuthorId, this.userinfo.publicinfo.id, this.$.input.value);
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.showToast('评论已发送');
    } else if (method == 'edit') {
      await this.updateComment(data.objectId, this.$.input.value);
      this.showToast('评论已修改');
    } else if (method == 'reply') {
      const comment = await this.createComment(this.articleId, this.articleAuthorId, this.userinfo.publicinfo.id, this.$.input.value, data.objectId, data.author.objectId);
      this.showToast('回复已发送');
    }
    await this.refresh();
    this.resetInput();
  }

  _editComment(e) {
    this.updateInput('edit', this._getCommentData(e.target));
    this.focus();
  }

  _replyComment(e) {
    const currentComment = this._getCommentData(e.target);
    const primaryComment = this._getCommentData(e.target, true);
    this.updateInput('reply', {
      author: currentComment.author,
      objectId: primaryComment.objectId
    });
    this.focus();
  }

  _tapHandle(e) {
    if (this.mobile) {
      const currentComment = this._getCommentData(e.target);
      if (this._isAuthor(currentComment)) {
        this._editComment(e);
      } else {
        this._replyComment(e);
      }
    }
  }

  async _deleteComment(e) {
    let commentId = this._getCommentData(e.target).objectId;
    this.showToast('确定要删除这条评论吗？', {
      title: '确认删除',
      onclick: async() => {
        await this.deleteComment(commentId);
        await this.refresh();
        this.showToast('评论已删除');
      }
    });
  }

  showToast(text, link) {
    this.dispatchEvent(new CustomEvent('show-toast', {
      bubbles: true,
      composed: true,
      detail: {
        text: text,
        link: link
      }
    }));
  }

  _calcCancelButtonDisabled(method) {
    return method == 'create';
  }

  _getCommentData(container, primary = false) {
    while (container && container.className.indexOf('klog-author' + (primary ? '-primary' : '')) == -1) {
      container = container.parentNode;
    }
    if (!container) return null;
    else return container.commentData;
  }

  _updateMarkdownScroller() {
    if (!this.$.scrollTarget) return;
    const items = this.shadowRoot.querySelectorAll('klog-markdown[lazy-init]');
    for (let item of items) {
      item.updateScrollTarget(this.$.scrollTarget);
      item.removeAttribute('lazy-init');
    }
  }

  _checkUserLogin() {
    if (!this.login) {
      this.dispatchEvent(new CustomEvent('user-login-page-open', {
        bubbles: true,
        composed: true
      }));
    }
  }

  _updateUserinfo(login) {
    if (!login) {
      this._userAvatarUrl = 'https://storage.krrr.party/storage/klog-avatar/default_avatar.jpg';
    } else {
      this._userAvatarUrl = this.userinfo.publicinfo.attributes.avatarUrl;
    }
  }

  _parseDate(date) {
    return Date.parse(date)
  }
}

window.customElements.define(KlogComment.is, KlogComment);