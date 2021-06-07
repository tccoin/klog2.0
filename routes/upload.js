/**
 * upload
 */
const path = require('path');
const fs = require('fs');
const md5File = require('md5-file');
const mime = require('mime-types');
const pump = require('pump');

async function merge(bucketname, name, total, rename) {
  let filePath = `pan/${bucketname}/${name}`;
  // merge the parts
  let writeStream = fs.createWriteStream(filePath);
  for (let i = 0; i < total; i++) {
    let partPath = `pan/${bucketname}/${name}.${i}`;
    console.log('LOG merging: ', partPath);
    await (new Promise((resolve, reject) => {
      let readStream = fs.createReadStream(partPath);
      readStream.on('error', err => console.log('ERROR read part:', err));
      readStream.pipe(writeStream, { end: false });
      try {
        readStream.on('end', resolve);
      } catch (err) {
        console.log('ERROR merge file:', err);
      }
    }));
    fs.unlink(partPath, (err) => {
      if (err) console.log('ERROR remove part:', err)
    });
  }
  writeStream.end();
  // rename by md5
  let key = name;
  if (rename) {
    let hash = md5File.sync(filePath);
    if (name.indexOf('.') > -1) key = name.replace(/(.*\.)/, `$1${hash}.`);
    else key = name + '.' + hash;
  }
  let newPath = `pan/${bucketname}/${key}`;
  await (new Promise((resolve) => {
    fs.rename(filePath, newPath, (err) => {
      if (err) console.log('ERROR rename part:', err)
      resolve();
    })
  }));
  return new Promise((resolve) => {
    var mimeType = mime.lookup(filePath) || 'unknown';
    resolve({
      key: key,
      fname: name,
      mimeType: mimeType
    });
  })
}

// receive parts
let _uploadedPart = 0;

module.exports = function(app, opts, next) {
  // upload test
  app.get('/test', (request, reply, next) => {
    reply
      .header('Content-Type', 'text/html; charset=UTF-8')
      .send('<form action="/upload" method="post" enctype="multipart/form-data"><input type="file" name="file" /><input type="submit" value="submit"></form>');
  });

  app.options('/', (request, reply, next) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.send('');
  });

  app.post('/', (request, reply, next) => {
    reply.header("Access-Control-Allow-Origin", "*");

    request.query.bucketname = request.query.bucketname || 'drive';
    request.query.total = request.query.total || 1;
    request.query.index = request.query.index || 0;
    request.query.name = request.query.name || 'test';
    request.query.rename = request.query.rename == 'off' ? false : true;

    const uploadDir = 'pan/' + request.query.bucketname;

    const mp = request.multipart(handler, function(err) {
      console.log('LOG upload completed')
    });

    mp.on('field', function(key, value) {
      console.log('form-data', key, value)
    });

    async function handler(field, file, filename, encoding, mimetype) {
      request.query.name = decodeURIComponent(request.query.name).replace(/[\(\)]/g, '');
      let key = request.query.name + '.' + request.query.index;
      let finPath = path.join(uploadDir, key);
      console.log('LOG upload file', finPath);
      await pump(file, fs.createWriteStream(finPath));
      _uploadedPart++;
      if (_uploadedPart == request.query.total) {
        _uploadedPart = 0;
        let result = await merge(request.query.bucketname, request.query.name, request.query.total, request.query.rename);
        reply.send(JSON.stringify([result]));
      } else {
        reply.send('[]');
      }
    }
  });

  next();
}