import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '../style/klog-style-card.js';
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
        };
    }

    ready() {
        super.ready();
        this.defaultPreference = getDefaultPreference();
        this.defaultUserinfo = { preference: this.defaultPreference };
    }

    async load(){
        return this.updateUserinfo();
    }

    async updateUserinfo() {
        if (!AV.User.current()) {
            // 未登录
            return this.userinfoUpdated(false, this.defaultUserinfo);
        }
        // 尝试抓取数据
        try {
            let user = await AV.User.current().fetch();
            if (!user.get('publicinfo')) {
                // 创建用户时出错
                let query = new AV.Query('UserPublic');
                query.equalTo('userId', user.id);
                query.limit(1);
                let publicinfo = await query.find();
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
                return this.userinfoUpdated(true, {
                    createdAt: userJson.createdAt,
                    updatedAt: userJson.updatedAt,
                    emailVerified: userJson.emailVerified,
                    preference: preference,
                    follow: userJson.follow,
                    publicinfo: publicinfo,
                    displayName: publicinfoJson.displayName,
                    introduction: publicinfoJson.introduction,
                    location: publicinfoJson.location,
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
        const userdata = { login, userinfo, userHandler: this };
        this.dispatchEvent(new CustomEvent('userinfo-updated', {
            bubbles: true,
            composed: true,
            detail: { userdata }
        }));
        return userdata;
    }

    async login(email, password) {
        await AV.User.logIn(email, password);
        return this.load();
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
        });
    }

    // Update account
    async update(newInfo, publicinfo) {
        const _user = AV.User.current();
        if (!_user) return;
        publicinfo = publicinfo || _user.get('publicinfo') || new AV.Object('UserPublic');
        for (let key of Object.keys(newInfo)) {
            let value = newInfo[key].value;
            let publicRead = newInfo[key].publicRead || false;
            if (publicRead) {
                publicinfo.set(key, value);
            } else {
                _user.set(key, value);
            }
        }
        publicinfo.set('userId', _user.id);
        _user.set('publicinfo', publicinfo);
        await _user.save();
        return this.load();
    }

    logout() {
        AV.User.logOut();
    }

}

window.customElements.define(KlogDataUser.is, KlogDataUser);