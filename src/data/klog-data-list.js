import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
class KlogDataList extends PolymerElement {

    static get is() { return 'klog-data-list'; }

    static get properties() {
        return {
            type: {
                type: String,
                value: 'user'
            },
            lastResponse: {
                type: Object,
                notify: true
            },
            select: {
                type: Array,
                value: ['title', 'text', 'path', 'license', 'collection', 'keywords']
            },
            include: {
                type: Array,
                value: []
            },
            loading: {
                type: Boolean,
                value: false,
                notify: true
            },
            limit: {
                type: Number,
                value: 500,
            },
            userinfo: {
                type: Object
            },
            keyword: {
                type: String
            },
            collection: {
                type: String
            },
            key: {
                type: String
            },
            // bookmarks: {
            //   type: Array,
            //   observer: 'updateBookmarks'
            // },
        };
    }

    async load() {
        let query;
        let type;
        let author;
        // 列表类型
        if (this.type == 'user') {
            // 验证登录
            if ((!this.userinfo || !this.userinfo.publicinfo) && !AV._config.useMasterKey) {
                await new Promise(resolve =>setTimeout(resolve, 100));
                let result = this.load();
                return result;
            }
            // 用户文章列表
            type = 'Article';
            query = new AV.Query(type);
        } else {
            // 时间轴列表
            type = 'Timeline';
            query = new AV.Query(type);
        }
        // 用户
        if (this.userinfo) {
            author = AV.Object.createWithoutData('UserPublic', this.userinfo.publicinfo.id);
            query.equalTo('author', author);
        }
        // 作者
        if (this.userPublicId) {
            author = AV.Object.createWithoutData('UserPublic', this.userPublicId);
            query.equalTo('author', author);
        }
        // 关键词
        if (this.keyword) {
            let attributes = ['title', 'collection', 'tags', 'keywords'];
            let queries = [];
            let k = this.keyword;
            let keywords = [k[0].toLowerCase() + k.slice(1), k[0].toUpperCase() + k.slice(1)];
            for (let i = 0; i < keywords.length; i++) {
                let re = new RegExp(keywords[i].replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'i');
                for (let j = 0;j < attributes.length;j++) {
                    queries[j] = new AV.Query(type);
                    if (author) queries[j].equalTo('author', author);
                    queries[j].matches(attributes[j], re);
                }
            }
            query = AV.Query.or.apply(AV, queries);
        }
        // 笔记本
        if (this.collection && this.collection != 'all') {
            query.equalTo('collection', this.collection);
        }
        query.select(this.select);
        query.include(this.include);
        query.limit(this.limit);
        if (this.key) query.descending(this.key);
        else query.descending('createdAt');
        this.loading = true;
        this.query = query;
        const list = await query.find();
        this.loading = false;
        let response = [];
        for (let _item of list) {
            let item = Object.assign({
                attachments: [],
                type: 'article',
                collection: '日常',
                image: {},
                keywords: [],
                tags: [],
                text: '',
                title: ''
            }, _item.toJSON());
            //trim
            item.text = item.text.trim();
            response.push(item);
        }
        this._response = response;
        // this.lastResponse = this.bookmarks ? this._updateBookmarks(response) : response;
        this.lastResponse = response;
        return this.lastResponse;
    }

    _updateBookmarks(_items) {
        let items = _items.filter(n => n);
        let bookmarks = this.bookmarks;
        let tops = [];
        for (let i = 0; i < items.length; i++) {
            let _i = items.length - i - 1;
            let item = items[_i];
            let id = item.objectId;
            let j = bookmarks.indexOf(id);
            item.bookmarks = false;
            if (j > -1) {
                tops[j] = items.splice(_i, 1)[0];
                tops[j].bookmarks = true;
            }
        }
        tops = tops.filter(n => n);
        return tops.reverse().concat(items);
    }

    updateBookmarks() {
        if (!this._bookmarksInit) {
            this._bookmarksInit = true;
            return;
        }
        let response = this._updateBookmarks(this._response);
        this.set('lastResponse', response);
    }

}

window.customElements.define(KlogDataList.is, KlogDataList);