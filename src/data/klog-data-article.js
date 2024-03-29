import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
class KlogDataArticle extends PolymerElement {

    static get is() { return 'klog-data-article'; }

    static get properties() {
        return {
            type: {
                type: String
            },
            path: {
                type: String,
                observer: '_onPathChanged'
            },
            articleId: {
                type: String,
                observer: '_onIdChanged'
            },
            loading: {
                type: Boolean,
                value: true,
                notify: true
            },
            lastResponse: {
                type: Object,
                notify: true
            },
            lastError: {
                type: Number,
                notify: true
            },
            isOwner: {
                type: Boolean,
                notify: true
            },
            collection: {
                type: String,
                observer: 'load'
            },
            disabled: {
                type: Boolean
            },
            key: {
                type: String
            },
            userinfo: {
                type: Object
            }
        };
    }

    static get observers() {
        return [
            '_updateIsOwner(userinfo.publicinfo.id,_article.author.id)'
        ];
    }

    isPathNew(path) {
        return path != this.path && !(this.lastResponse && path == this.lastResponse.path);
    }

    _onIdChanged(id, _id) {
        if (id != _id && (!this.lastResponse || id != this.lastResponse.objectId)) this.load();
    }

    _onPathChanged(path, _path) {
        if (path != _path && !(this.lastResponse && path == this.lastResponse.path)) this.load();
    }

    load() {
        if (!this.default && !this.path && !this.articleId) return;
        if (this.disabled) return;
        // ID
        if (this.articleId) {
            this.loadByArticleId();
        } else {
            this.loadByPath(this.path);
        }
    }

    loadByArticleId() {
        var article = AV.Object.createWithoutData('Article', this.articleId);
        this.loading = true;
        return article.fetch()
            .then(data => {
                if (data.get('updatedAt')) {
                    return this._onLoad(data);
                } else {
                    return this._onNotFound();
                }
            });
    }

    loadByPath(path) {
        this.loading = true;
        let query = new AV.Query('Article');
        let author;
        // 私有文章
        if (this.type == 'user') {
            if (!this.userinfo || !this.userinfo.publicinfo) {
                setTimeout(() => this.loadByPath(path), 100);
                return;
            }
            author = AV.Object.createWithoutData('UserPublic', this.userinfo.publicinfo.id);
            query.equalTo('author', author);
        }
        // 笔记本
        if (this.collection && this.collection != 'all') {
            query.equalTo('collection', this.collection);
        }
        // 路径
        if (path) {
            query.equalTo('path', path);
        }
        query.select(['title', 'markdown', 'image', 'comments', 'commentCount', 'likeCount', 'visitCount', 'topic', 'author', 'collection', 'tags', 'path', 'license', 'updatedTime', 'createdTime']);
        query.include(['author', 'topic']);
        query.limit(1);
        if (this.key) query.descending(this.key);
        else query.descending('createdAt');
        return query.find().then((articles) => {
            if (articles.length != 0) {
                return this._onLoad(articles[0]);
            } else {
                return this._onNotFound();
            }
        }).catch(err => {
            if (err)
                console.log(err);
        });
    }

    _onLoad(article) {
        this._article = article;
        this.loading = false;
        let articleToJson = article.toJSON();
        this.set('lastResponse', articleToJson);
        //event
        this.dispatchEvent(new CustomEvent('success', { bubbles: true, composed: true, detail: { data: articleToJson } }));
        return Promise.resolve(articleToJson);
    }

    _onNotFound() {
        this.loading = false;
        this.lastError = 404;
        this.dispatchEvent(new CustomEvent('notfound', { bubbles: true, composed: true }));
        return Promise.reject();
    }

    _updateIsOwner() {
        if (!this.userinfo || !this._article) {
            return false;
        }
        let article = this._article;
        let publicinfo = this.userinfo.publicinfo;
        let userid = publicinfo ? publicinfo.id : null;
        this.isOwner = article.get('author').id == userid;
    }

}

window.customElements.define(KlogDataArticle.is, KlogDataArticle);