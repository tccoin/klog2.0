import { KlogDataMixin } from './klog-data-mixin.js';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

const DataMessageMixin = (superClass) => class extends KlogDataMixin(superClass) {

    async loadMessages(channels, userPublicId, accessPrivate = false) {
        let query = new AV.Query('Message');
        query.select(['from', 'type', 'content',
            'article.private', 'article.title', 'article.path', 'article.author.displayName',
            'comment.markdown', 'comment.author.displayName', 'comment.replyToAuthor.displayName'
        ]);
        query.include('from', 'article', 'article.author', 'comment', 'comment.author', 'comment.replyToAuthor');
        query.descending('createdAt');
        query.containedIn('channels', this._processChannels(channels, userPublicId));
        query.limit(1000);
        const data = await query.find();
        const result = this._processMessages(data, userPublicId, accessPrivate);
        return result;
    }

    async loadMessageByChannel(channel, userPublicId) {
        let query = new AV.Query('Message');
        query.select(['article', 'comment']);
        query.descending('createdAt');
        query.containedIn('channels', this._processChannels([channel], userPublicId));
        query.limit(1000);
        const data = await query.find();
        const result = data.length > 0 ? data.map(x => x.toJSON()) : [];
        if (result.length == 0) {
            throw new Error('message not found');
        } else if (result.length == 1) {
            return result[0];
        } else {
            for (let message of result) await this.deleteMessage(message.objectId);
            throw new Error('message not found');
        }
    }

    createMessage(type, fromId, channels, content = null, articleId = null, commentId = null) {
        let message = new AV.Object('Message');
        message.set('type', type);
        message.set('from', AV.Object.createWithoutData('UserPublic', fromId));
        message.set('channels', channels);
        if (content) message.set('content', content);
        if (articleId) message.set('article', AV.Object.createWithoutData('Article', articleId));
        if (commentId) message.set('comment', AV.Object.createWithoutData('Comment', commentId));
        return message.save().catch(() => {
            this.errorCode = '403';
        });
    }

    updateMessage(messageId, type = null, fromId = null, channels = null, content = null, articleId = null, commentId = null) {
        let message = AV.Object.createWithoutData('Message', messageId);
        if (type) message.set('type', type);
        if (fromId) message.set('from', AV.Object.createWithoutData('UserPublic', fromId));
        if (channels) message.set('channels', channels);
        if (content) message.set('content', content);
        if (articleId) message.set('article', AV.Object.createWithoutData('Article', articleId));
        if (commentId) message.set('comment', AV.Object.createWithoutData('Comment', commentId));
        return message.save();
    }

    deleteMessage(messageId) {
        let message = AV.Object.createWithoutData('Message', messageId);
        return message.destroy();
    }

    _processChannels(channels, userPublicId) {
    /* replace "self" to userPublicId */
        let results = [];
        for (let channel of channels) {
            results.push(channel.replace(/-self$/, `-${userPublicId}`));
        }
        return results;
    }

    _processMessages(data, userPublicId, accessPrivate) {
    /* process messages; hide the message if error happened*/
        let result = [];
        for (let message of data) {
            try {
                message = message.toJSON();
                // message = this._processMessageAccess(message, accessPrivate ? userPublicId : '');
                message = this._processMessageDisplay(message, userPublicId);
                result.push(message);
            } catch (err) {}
        }
        return result;
    }


    _processMessageAccess(message, userPublicId) {
    /* acl */
        const article = message.article || message.comment;
        const useMasterKey = false;
        const isCoworker = false;
        const isAuthor = article ? article.author.objectId == userPublicId : false;
        if (article && article.private && !isAuthor && !useMasterKey && !isCoworker) {
            // throw new Error('private article');
        }
        return message;
    }

    _processMessageDisplay(message, userPublicId) {
    /* generate brief description for the message */
        let commentAuthorName, commentReplyToName;
        // preprocess strings
        if (this._contains(message.type, ['comment-'])) {
            if (!message.comment) {
                this.deleteMessage(message.objectId);
                throw new Error('comment not found');
            }
            commentAuthorName = this._processName(message.comment.author, userPublicId);
            if (message.comment.replyToAuthor) {
                commentReplyToName = this._processName(message.comment.replyToAuthor, userPublicId);
            }
        }
        let articleTitle, articleAuthorName, articleWithAuthorName;
        if (this._contains(message.type, ['article-', 'comment-'])) {
            if (!message.article) {
                this.deleteMessage(message.objectId);
                throw new Error('article not found');
            }
            articleTitle = this._processArticleTitle(message.article);
            articleAuthorName = this._processName(message.article.author, userPublicId);
            articleWithAuthorName = `${articleAuthorName}的文章${articleTitle}`;
        }
        let fromAuthorName;
        if (message.type == 'article-like') {
            fromAuthorName = this._processName(message.from, userPublicId);
        }

        // skip message from oneself
        if (message.from.objectId == userPublicId) {
            // comment-new comment-reply article-like
            if (message.type == 'article-like' && message.content.isLogin === false) {
                fromAuthorName = '来自地球的网友';
            } else {
                throw new Error('user is author');
            }
        }

        // concat info
        let info, title, text;
        if (message.type == 'comment-new') {
            info = `${commentAuthorName}评论了${articleWithAuthorName}`;
            text = message.comment.markdown;
        } else if (message.type == 'comment-reply') {
            if (articleTitle) info = `${commentAuthorName}在${articleTitle}下回复了${commentReplyToName}`;
            else info = `${commentAuthorName}回复了${commentReplyToName}`;
            text = message.comment.markdown;
        } else if (message.type == 'article-create') {
            info = `${articleAuthorName}发布了`;
            title = message.article.title;
            text = message.article.text;
        } else if (message.type == 'article-update') {
            info = `${articleAuthorName}更新了${articleTitle}`;
        } else if (message.type == 'text') {
            info = 'Klog 新闻';
            text = message.content.text;
        } else if (message.type == 'article-like') {
            if (articleTitle) info = `${fromAuthorName}给你的文章${articleTitle}点了${message.content.likeCount+1}个赞`;
            else info = `${fromAuthorName}给你的文章点了赞`;
        } else {
            throw new Error(`unknown message type ${message.type}`);
        }
        // set properties
        if (info) message.info = info;
        if (title) message.title = title;
        if (text) message.text = text;
        if (message.article && message.article.path) message.link = `article/${message.article.path}`;
        return message;
    }

    _contains(str, substrs) {
        for (let substr of substrs) {
            if (str.indexOf(substr) > -1) return true;
        }
        return false;
    }

    _processName(userPublic, userPublicId) {
        if (userPublic && userPublic.objectId != userPublicId) return ` ${userPublic.displayName} `;
        else return '你';
    }

    _processArticleTitle(article) {
        if (article.title) return `《${article.title}》`;
        else return '';
    }
};

export const KlogDataMessageMixin = dedupingMixin(DataMessageMixin);