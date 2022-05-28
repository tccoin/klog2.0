import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';

const DataMixin = (superClass) => class extends superClass {

    static get properties() {
        return {
            lastResponse: {
                type: Array
            },
            errorCode: {
                type: Number
            },
        };
    }

    static get observers() {
        return ['_dataErrorHandle(errorCode)'];
    }

    _dataErrorHandle(errorCode) {
        this.dispatchEvent(new CustomEvent('data-error', {
            bubbles: true,
            composed: true,
            detail: { errorCode }
        }));
    }

    groupByDate(items, timestampKey = 'createdAt') {
        const key = x => this._computedDateCategory(Date.parse(x[timestampKey]));
        return this.groupBy(items, key);
    }

    groupBy(items, key) {
        const dict = {};
        const arr = [];
        // put items into dict
        for (let item of items) {
            let groupName = key(item);
            if (!(groupName in dict)) {
                dict[groupName] = {
                    name: groupName,
                    items: []
                };
            }
            dict[groupName].items.push(item);
        }
        // dict to array
        for (let key in dict) {
            arr.push(dict[key]);
        }
        return arr;
    }

    _computedDateCategory(timeStamp) {
        var date = new Date(timeStamp);
        var currentTimeStamp = Date.now();
        var d = (currentTimeStamp - timeStamp) / 1000;
        if (typeof (timeStamp) != 'number') {
            return '';
        } else if (d < 60) {
            return '刚才';
        } else if (d < 3600 * 48 && new Date().getDate() == date.getDate()) {
            return '今天';
        } else if (d < 3600 * 72 && new Date().getDate() - date.getDate() == 1) {
            return '昨天';
        } else if (d < 3600 * 96 && new Date().getDate() - date.getDate() == 2) {
            return '前天';
        } else if (date.getFullYear() == new Date().getFullYear()) {
            return (date.getMonth() + 1) + '/' + date.getDate();
        } else {
            return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
        }
    }

};

export const KlogDataMixin = dedupingMixin(DataMixin);
