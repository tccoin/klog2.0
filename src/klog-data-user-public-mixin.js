import { KlogDataMixin } from './klog-data-mixin.js';

const KlogDataUserPublicMixin = (superClass) => class extends KlogDataMixin(superClass) {

  loadUserPublic(userPublicId) {
    let userPublic = AV.Object.createWithoutData('UserPublic', userPublicId);
    // userPublic.select(['avatarUrl', 'displayName', 'introduction']);
    return userPublic.fetch().then(data => {
      return data.toJSON()
    }).catch(err => {
      if (err) console.log(err);
    });
  }

  findUserPublic(displayName) {
    let query = new AV.Query('UserPublic');
    query.select(['avatarUrl', 'displayName', 'introduction']);
    query.descending('displayName');
    query.equalTo('displayName', displayName);
    return query.find().then((data) => {
      let result = [];
      for (let userPublic of data) {
        result.push(userPublic.toJSON());
      }
      return result
    }).catch(err => {
      if (err) console.log(err);
    });
  }
}

export { KlogDataUserPublicMixin };
