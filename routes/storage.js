/**
 * storage
 */
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const sharp = require('sharp');
const OptiPng = require('optipng');
const stream = require('stream');
const Vibrant = require('node-vibrant');
const settings = require('../settings');
(async () => {
    materialDynamicColors = await import("material-dynamic-colors");
})();

const sendStream = (request, reply, filePath) => {
    let stat = fs.statSync(filePath);
    // json type
    if (filePath.match(/.*\.json/)) {
        reply.header('content-type', 'text/plain');
    }
    // cross-origin
    reply.header('Access-Control-Allow-Origin', '*');

    // range
    const rawrange = request.raw.headers.range;
    let streamOption = {};
    if (rawrange) {
        let chunkSize = 2 * 1024 * 1024;//2 * 1024
        let range = rawrange.replace(/bytes=/, '').split('-');

        range[0] = range[0] ? parseInt(range[0], 10) : 0;
        range[1] = range[1] ? parseInt(range[1], 10) : range[0] + chunkSize;
        if (range[1] > stat.size - 1) {
            range[1] = stat.size - 1;
        }
        streamOption = { start: range[0], end: range[1] };

        reply.code(206);
        reply.headers({
            'Accept-Ranges': 'bytes',
            'Content-Range': 'bytes ' + range[0] + '-' + range[1] + '/' + stat.size,
            'Content-Length': range[1] - range[0] + 1,
        });
    } else {
        reply.code(200);
        reply.headers({
            'Content-Length': stat.size,
        });
    }
    // last-modified
    const modifiedSince = request.raw.headers['if-modified-since'];
    const statModifiedTime = stat.mtime.toUTCString();
    reply.headers({
        'Cache-Control': 'max-age=94608000',
        'Last-Modified': stat.mtime.toUTCString()
    });
    if (modifiedSince == statModifiedTime) {
        reply.code(304);
        reply.send('');
    } else {
        // send
        let stream = fs.createReadStream(filePath, streamOption);
        reply.send(stream);
    }

};

const getPixels = async (image, channels) => {
    const data = await image.raw().toBuffer();
    let pixels = [];
    for (let i = 0; i < data.length; i += channels) {
        if (channels == 3 || (channels == 4 && data[i + 3] < 255)) {
            pixels.push(materialDynamicColors.intFromRgb([data[i], data[i + 1], data[i + 2]]));
        }
    }
    return pixels;
};

const sendImage = async (request, reply, filePath, query) => {
    // mode: <=5: return image, >5: return info

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
    optParams = optParams.filter(n => { return n; });
    for (let i = 0; i < Math.floor(optParams.length / 2); i++) {
        let key = optParams[2 * i];
        let value = optParams[2 * i + 1];
        if (key == 'w' || key == 'h') {
            params[key] = max(parseInt(value), 0);
        } else if (key == 'q') {
            if (mode <= 5) params[key] = min(max(parseInt(value), 0), 100);
            else params[key] = max(parseInt(value), 0);
        }
    }

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
    if (mode > 5) outputFormat = 'json';

    // cache
    let cachePath = path.join(settings.storageDirectory, 'cache', request.params.bucketname + '.' + (request.params.hash || '') + '.' + unicode2utf8(request.params.key) + '.' + `${mode}${params['w']}${params['h']}${params['q']}.${outputFormat}`);
    if (fs.existsSync(cachePath)) {
        let size = await fs.statSync(cachePath).size;
        if (size != 0) {
            sendStream(request, reply, cachePath);
            return;
        }
    }

    if (mode > 5) {
        // info mode
        params['q'] = params['q'] || 64;
        let sample = image.resize(params['q'], params['q'], 'fill');
        let stats = await sample.stats();
        let result;
        const start = Date.now();
        if (mode == 6) {
            console.log('LOG Generating palette[old]...');
            let samplePath = path.join(settings.storageDirectory, 'cache', request.params.bucketname + '.' + (request.params.hash || '') + '.' + unicode2utf8(request.params.key) + '.' + `vibrantsample${params['q']}.jpg`);
            await sample.toFile(samplePath);
            let vibrant = new Vibrant(samplePath, { maxDimension: 64 });
            let palette = await vibrant.getPalette();
            result = {
                w: _w,
                h: _h,
                palette: palette,
                stats: {
                    stdev: stats.channels.map(x => x.stdev).reduce((a, b) => a + b),
                    entropy: stats.entropy,
                    isOpaque: stats.isOpaque
                }
            };
        } else if (mode == 7) {
            console.log('LOG Generating palette[new]...');
            let pixels = await getPixels(sample, metadata.channels);
            let seed = await materialDynamicColors.index_seedFromImage(null, pixels);
            result = {
                w: _w,
                h: _h,
                seed: seed,
                stats: {
                    stdev: stats.channels.map(x => x.stdev).reduce((a, b) => a + b),
                    entropy: stats.entropy,
                    isOpaque: stats.isOpaque
                }
            };
        }
        console.log(`LOG time: ${Date.now() - start}ms`);
        let resultJSON = JSON.stringify(result);
        reply.header('content-type', 'text/plain');
        reply.header('Access-Control-Allow-Origin', '*');
        reply.send(resultJSON);
        fs.writeFileSync(cachePath, resultJSON, { flag: 'w' });
    } else {
        // image mode
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
        // save to cache
        let cacheStream = fs.createWriteStream(cachePath);
        let promise = new Promise(resolve => cacheStream.on('finish', resolve));
        promise.then(() => {
            //send
            sendStream(request, reply, cachePath);
        });
        outputStream.pipe(cacheStream);
    }

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
    const storageRouter = (request, reply, next) => {
        let filePath = path.join(settings.storageDirectory, request.params.bucketname, request.params.hash || '', unicode2utf8(request.params.key));
        if (fs.existsSync(filePath)) {
            let mimeType = mime.lookup(filePath) || 'unknown';
            let query = request.raw.url.match(/\?(.*)/);
            query = query ? query[1] : '';
            console.log('LOG download file ', `[${query}]`, filePath);
            reply.header('content-type', mimeType);
            let isImage = mimeType.indexOf('image') > -1 && !(['svg', 'bmp'].find(x => mimeType.indexOf(x) > -1));
            let hasMagic = query.indexOf('imageView2') > -1 || query.indexOf('Magic') > -1;
            if (query && isImage && hasMagic) {
                sendImage(request, reply, filePath, query);
            } else if (hasMagic) {
                reply.header('content-type', 'text/plain');
                reply.header('Access-Control-Allow-Origin', '*');
                reply.send('{}');
            } else {
                sendStream(request, reply, filePath);
            }
        } else {
            console.log('LOG file not found: ', filePath);
            reply.code(404);
            reply.send('(|||ﾟДﾟ)');
        }
    };
    app.get('/:bucketname/:key', storageRouter);
    app.get('/:bucketname/:hash/:key', storageRouter);
    next();
};

module.exports = router;