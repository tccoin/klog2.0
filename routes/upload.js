/**
 * upload
 */
const md5File = require('md5-file');
const uploader = require('huge-uploader-nodejs');
const fs = require('fs');
const mime = require('mime-types');

// upload params
const maxFileSize = 100;
const maxChunkSize = 20;

module.exports = function(app, opts, next) {
    // upload test
    app.get('/test', (request, reply, next) => {
        reply
            .header('Content-Type', 'text/html; charset=UTF-8')
            .send('<form action="/upload" method="post" enctype="multipart/form-data"><input type="file" name="file" /><input type="submit" value="submit"></form>');
    });
 
    app.options('/', (request, reply, next) => {
        reply.header('Access-Control-Allow-Origin', '*');
        reply.header('Access-Control-Allow-Methods', 'POST,OPTIONS');
        reply.header('Access-Control-Allow-Headers', 'uploader-chunk-number,uploader-chunks-total,uploader-file-id');
        reply.header('Access-Control-Max-Age', '86400');
        reply.send('');
    });
     
    app.post('/', async (request, reply, next) => {
        reply.header('Access-Control-Allow-Origin', '*');
        reply.header('Access-Control-Allow-Methods', 'POST,OPTIONS');
        reply.header('Access-Control-Allow-Headers', 'uploader-chunk-number,uploader-chunks-total,uploader-file-id');
        reply.header('Access-Control-Max-Age', '86400');

        // process file name
        try {
            let tmpPath = 'pan/upload_tmp';
            // request.pipe = target=>target.send(request.raw);
            let assembleChunks = await uploader(request.raw, tmpPath, maxFileSize, maxChunkSize);
            if (assembleChunks) {
                assembleChunks()
                    .then(data =>{
                        // { filePath: 'tmp/1528932277257', postParams: { email: 'upload@corp.com', name: 'Mr Smith' } }
                        // change file name
                        let bucketname = data.postParams.bucketname || 'drive';
                        let filename = data.postParams.name || 'test';
                        let key = decodeURIComponent(filename).replace(/[\(\)]/g, '');
                        let hash = md5File.sync(data.filePath);
                        let newPath = `pan/${bucketname}/${hash}/`;
                        if (!fs.existsSync(newPath)) {
                            fs.mkdirSync(newPath);
                        }
                        console.log('LOG upload success:', data.filePath, '->', newPath + key);
                        fs.renameSync(data.filePath, newPath + key);
                        let mimeType = mime.lookup(newPath + key) || 'unknown';
                        let result = {
                            key: `${hash}/${key}`,
                            fname: key,
                            mimeType: mimeType
                        };
                        reply.code(200);
                        reply.send(JSON.stringify([result]));
                    })
                    .catch(err => console.log(err));
            } else {
                reply.code(200);
                reply.send('');
            }
        } catch (error) {
            console.log(error);
            reply.code(500);
            reply.send(error.message);
        }
     
    });
     
    next();
};