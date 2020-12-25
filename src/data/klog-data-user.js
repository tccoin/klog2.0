import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '../style/klog-style-card.js';
import '../ui/klog-markdown.js';
import { getDefaultPreference } from './klog-data-preference.js';
'user strict';
/*
 * Use this element to do everything about the user account.
 */
class KlogDataUser extends PolymerElement {

  static get is() { return 'klog-data-user'; }

  static get properties() {
    return {
      user: {
        type: Object
      },
      userinfo: {
        type: Object,
        notify: true
      },
      email: {
        type: String,
        value: 'test@krrr.party'
      },
      password: {
        type: String,
        value: '123456'
      },
      log: {
        type: Boolean,
        value: false
      },
      disabled: {
        type: Boolean,
        value: false
      },
    }
  }

  ready() {
    super.ready();
    const markdown = document.createElement('klog-markdown');
    this.defaultPreference = getDefaultPreference();
    this.defaultUserinfo = { preference: this.defaultPreference };
    if (!this.disabled) {
      if (AV.User.current()) this.user = AV.User.current();
      this._updateUserinfo();
    } else {
      this.loadPromise = Promise.resolve();
    }
  }

  _updateUserinfo() {
    this.loadPromise = this.updateUserinfo();
  }

  async updateUserinfo() {
    if (!this.user) {
      // 未登录
      return this.userinfoUpdated(false, this.defaultUserinfo);
    }
    // 尝试抓取数据
    try {
      let user = await this.user.fetch()
      if (!user.get('publicinfo')) {
        // 创建用户时出错
        let query = new AV.Query('UserPublic');
        query.equalTo('userId', user.id);
        query.limit(1);
        let publicinfo = await query.find()
        if (publicinfo.length > 0) {
          return this.update({}, publicinfo[0]);
        }
      } else {
        // 抓取公开数据
        let publicinfo = await user.get('publicinfo').fetch();
        let userJson = user.toJSON();
        let preference = Object.assign({}, this.defaultPreference, userJson.preference || {});
        let markdownPreference = Object.assign({}, this.defaultMarkdownPreference, preference.markdown || {});
        preference.markdown = markdownPreference;
        let publicinfoJson = publicinfo.toJSON();
        console.log(publicinfoJson);
        return this.userinfoUpdated(true, {
          createdAt: userJson.createdAt,
          updatedAt: userJson.updatedAt,
          emailVerified: userJson.emailVerified,
          preference: preference,
          follow: userJson.follow,
          publicinfo: publicinfo,
          displayName: publicinfoJson.displayName,
          introduction: publicinfoJson.introduction,
          avatarUrl: publicinfoJson.avatarUrl,
          license: publicinfoJson.license,
          username: publicinfoJson.username,
          homepage: publicinfoJson.username || `zone/${publicinfoJson.objectId}`,
          klogUser: this
        });
      }
    } catch (err) {
      console.log(err);
      return this.userinfoUpdated(false, this.defaultUserinfo);
    }
  }

  userinfoUpdated(login, userinfo) {
    this.set('userinfo', userinfo);
    const result = { login, userinfo, user: this };
    this.dispatchEvent(new CustomEvent('userinfo-updated', {
      bubbles: true,
      composed: true,
      detail: { result: result }
    }));
    return result;
  }

  async login(email, password) {
    const user = await AV.User.logIn(email, password);
    this.set('user', user);
    this._updateUserinfo();
  }

  async resetPassword(email) {
    return AV.User.requestPasswordReset(email);
  }

  // Sign up
  async signup(email = this.email, password = this.password) {
    let user = new AV.User();
    user.setUsername(email);
    user.setEmail(email);
    user.setPassword(password);
    user = await user.signUp();
    this.user = user;
    await this.login(email, password);
    await this._initUser(password);
  }

  // User init
  async _initUser(p) {
    await this.update({
      p: {
        value: p
      },
      follow: {
        value: ['channel-default', 'author-user-self', 'reply-user-self', 'mention-user-self']
      },
      displayName: {
        value: ['Wind', 'Wood', 'Water', 'Fire', 'Earth'][Math.floor(Math.random() * 4 + 1)] + Math.floor(Math.random() * 8999 + 1000),
        publicRead: true
      },
      avatarUrl: {
        value: 'https://storage.krrr.party/storage/klog-avatar/default_avatar.jpg',
        publicRead: true
      }
    })
  }

  // Update account
  async update(newInfo, publicinfo) {
    if (!this.user) return;
    publicinfo = publicinfo || this.user.get('publicinfo') || new AV.Object('UserPublic');
    for (let key of Object.keys(newInfo)) {
      let value = newInfo[key].value;
      let publicRead = newInfo[key].publicRead || false;
      if (publicRead) {
        publicinfo.set(key, value);
      } else {
        this.user.set(key, value);
      }
    }
    publicinfo.set('userId', this.user.id);
    this.user.set('publicinfo', publicinfo);
    await this.user.save();
    return this._updateUserinfo();
  }

  logout() {
    AV.User.logOut();
    this.user = AV.User.current();
  }

}

window.customElements.define(KlogDataUser.is, KlogDataUser);