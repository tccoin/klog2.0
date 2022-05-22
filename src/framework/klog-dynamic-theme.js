import 'material-dynamic-colors/dist/cdn/material-dynamic-colors.min.js';

export class KlogDynamicTheme {

    async apply(element, source, variant) {
        //source: #ffffff, url, input.files[0], blob, img element
        if (typeof (source) == 'object' && source.tagName == 'IMG') {
            source = this._img2blob(source);
        } else if (typeof (source) == 'object' && source.tagName == 'KLOG-IMAGE') {
            source = this._img2blob(source.$.img);
        } else if (typeof (source) == 'string') {
            let matchResult = source.match(/\[(.*),(.*),(.*)\]/);
            if(matchResult && matchResult.length==4){
                source = [parseInt(matchResult[1]), parseInt(matchResult[2]), parseInt(matchResult[3])];
            }
            source = this._rgb2hex(source);
        } else if (Array.isArray(source)) {
            source = this._rgb2hex(source);
        }
        let colors = await materialDynamicColors(source);
        let schemes = variant == 'light' ? colors.light : colors.dark;
        // console.log(variant, schemes);
        for (let token in schemes) {
            const styleVariableName = '--' + token.replace(/[A-Z]/g, (match, offset) => (offset > 0 ? '-' : '') + match.toLowerCase());
            element.style.setProperty(styleVariableName, schemes[token]);
        }
        return schemes;
    }
    
    _rgb2hex(rgb) {
        let [red, green, blue] = rgb;
        const val = (red << 16) | (green << 8) | (blue << 0);
        return '#' + (0x1000000 + val).toString(16).slice(1);
    }

    _img2blob(img) {
        let c = document.createElement('canvas');
        let ctx = c.getContext('2d');
        const maxSize = 512;
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w > maxSize) {
            h = h * maxSize / w;
            w = maxSize;
        }
        if (h > maxSize) {
            w = w * maxSize / h;
            h = maxSize;
        }
        ctx.drawImage(img, 0, 0, w, h);
        return new Promise(resolve=>{
            c.toBlob(function(blob) {
                resolve(blob);
            }, 'image/jpeg', 0.9);
        });
    }


}