/**
 * storage
 */
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const pump = require('pump-promise');
const sharp = require('sharp');
const OptiPng = require('optipng');
const stream = require('stream');
const Vibrant = require('node-vibrant');

const sendStream = (reply, filePath) => {
  let stat = fs.statSync(filePath);
  if (filePath.match(/.*\.json/)) {
    reply.header('content-type', 'text/plain');
    reply.header('Access-Control-Allow-Origin', '*');
  }
  reply.header('content-length', stat.size);
  let stream = fs.createReadStream(filePath);
  reply.send(stream);
};

const sendImage = async (request, reply, filePath, query) => {
  // old method
  // let params = query.match(/View2\/([0-9])\/w\/([^\/]*)(?:\/h\/([^\/]*))?(?:\/q\/([^\/]*));

  // resolve the params
  let srcParams = query.match(/(?:View2|Magic)\/([0-9])(.*)/);
  if (!srcParams) {
    sendStream(reply, filePath);
    return;
  }
  let mode = parseInt(srcParams[1]);
  let optParams = srcParams[2].split('/');
  let params = {};
  const [min, max] = [Math.min, Math.max];
  optParams = optParams.filter(n => { return n });
  for (i = 0; i < Math.floor(optParams.length / 2); i++) {
    let key = optParams[2 * i];
    let value = optParams[2 * i + 1];
    if (key == 'w' || key == 'h') {
      params[key] = max(parseInt(value), 0);
    } else if (key == 'q') {
      if (mode != 6) params[key] = min(max(parseInt(value), 0), 100);
      else params[key] = max(parseInt(value), 0);
    }
  }
  console.log('LOG', params);

  // input image
  let image = sharp(filePath);
  let metadata = await image.metadata();
  let _w = metadata.width;
  let _h = metadata.height;

  // decide the format
  let acceptWebp = request.headers.accept.indexOf('image/webp') > -1;
  let outputFormat = metadata.format;
  if (acceptWebp) {
    outputFormat = 'webp';
  } else {
    if (mode == 1) outputFormat = 'jpeg';
  }
  if (mode == 6) outputFormat = 'json';

  // cache
  let cachePath = filePath.replace(/\\/g, '/').replace(/pan\/(.*)\/(.*)\.([^\.]*)$/, `pan\/cache\/$1.$2.${mode}${params['w']}${params['h']}${params['q']}.${outputFormat}`);
  if (fs.existsSync(cachePath)) {
    let size = await fs.statSync(cachePath).size;
    if (size != 0) {
      sendStream(reply, cachePath);
      return;
    }
  }

  // mode6
  if (mode == 6) {
    params['q'] = params['q'] || 64;
    let samplePath = filePath.replace(/\\/g, '/').replace(/pan\/(.*)\/(.*)\.([^\.]*)$/, `pan\/cache\/$1.$2.vibrantsample${params['q']}.jpg`);
    await image.resize(params['q']).toFile(samplePath);
    console.log('LOG Generating palette...');
    let vibrant = new Vibrant(samplePath, { maxDimension: 64 });
    let palette = await vibrant.getPalette();
    let result = JSON.stringify({
      w: _w,
      h: _h,
      palette: palette
    });
    reply.header('content-type', 'text/plain');
    reply.header('Access-Control-Allow-Origin', '*');
    reply.send(result);
    fs.writeFileSync(cachePath, result);
    return;
  }

  // resize according to mode
  if (mode == 1) {
    image = image.resize(params['w'], params['h'], {
      fit: 'cover',
      position: 'entropy'
    });
  } else if (mode == 2) {
    image = image.resize(params['w'], 10000, {
      fit: 'inside',
      withoutEnlargement: true
    });
  } else if (mode == 3) {
    image = sharp(await image.resize(params['q']).toBuffer())
      .resize(params['w'], null, { kernel: 'nearest' });
  }

  //convert
  let outputStream = new stream.PassThrough();
  if (outputFormat == 'webp') {
    image = image.webp({ quality: params['q'] });
    outputStream.end(await image.toBuffer());
  } else if (outputFormat == 'jpeg') {
    image = image.jpeg({ quality: params['q'] });
    outputStream.end(await image.toBuffer());
  } else if (outputFormat == 'png') {
    let sourceStream = new stream.PassThrough();
    let optimizer = new OptiPng(['-o1']);
    sourceStream.end(await image.png().toBuffer());
    console.log('LOG OptiPng running...');
    sourceStream.pipe(optimizer).pipe(outputStream);
  }
  //pipe to reply
  reply.send(outputStream);
  // save to cache
  let cacheStream = fs.createWriteStream(cachePath);
  outputStream.pipe(cacheStream);
};

const unicode2utf8 = str => {
  let result = '';
  while (true) {
    m = str.match(/(.*?)&#(.*?);(.*)/);
    if (!m) {
      result += str;
      break;
    } else {
      result += m[1] + String.fromCharCode(m[2]);
      str = m[3];
    }
  }
  return result;
};

const router = function (app, opts, next) {
  app.get('/:bucketname/:key', function (request, reply, next) {
    let filePath = path.join('pan', request.params.bucketname, unicode2utf8(request.params.key));
    console.log('LOG download file ', filePath);
    if (fs.existsSync(filePath)) {
      let mimeType = mime.lookup(filePath) || 'unknown';
      let query = request.raw.url.match(/\?(.*)/)
      query = query ? query[1] : '';
      reply.header('content-type', mimeType);
      let isImage = mimeType.indexOf('image') > -1 && mimeType.indexOf('svg') == -1;
      let hasMagic = query.indexOf('imageView2') > -1 || query.indexOf('Magic') > -1;
      if (query && isImage && hasMagic) {
        sendImage(request, reply, filePath, query);
      } else {
        sendStream(reply, filePath);
      }
    } else {
      reply.redirect('/#/404');
    }
  });
  next();
};

module.exports = router;