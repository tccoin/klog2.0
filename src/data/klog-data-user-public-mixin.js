import { KlogDataMixin } from './klog-data-mixin.js';

const KlogDataUserPublicMixin = (superClass) => class extends KlogDataMixin(superClass) {

  loadUserPublic(userPublicId) {
    let userPublic = AV.Object.createWithoutData('UserPublic', userPublicId);
    // userPublic.select(['avatarUrl', 'displayName', 'introduction', 'license']);
    return userPublic.fetch().then(data => {
      return data.toJSON()
    }).catch(err => {
      if (err) console.log(err);
    });
  }

  loadUserPublicByUsername(username) {
    let query = new AV.Query('UserPublic');
    query.select(['avatarUrl', 'displayName', 'introduction', 'license', 'username']);
    query.ascending('usernameUpdateAt');
    query.limit(1);
    query.matches('username', new RegExp(`^${username}$`, 'i'));
    return query.find().then((data) => {
      return data[0].toJSON();
    }).catch(err => {
      if (err) console.log(err);
    });
  }

  validateUsername(username) {
    let query = new AV.Query('UserPublic');
    query.select([]);
    query.limit(1);
    // query.equalTo('username', username);
    query.matches('username', new RegExp(`^${username}$`, 'i'));
    return query.count().then((count) => {
      console.log(count);
      return count == 0;
    })
  }
}

export { KlogDataUserPublicMixin };