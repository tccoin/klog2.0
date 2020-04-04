import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';

var CryptoJS = CryptoJS || function (t, e) {
  var n = {},
    r = n.lib = {},
    i = function () { },
    s = r.Base = {
      extend: function (t) {
        i.prototype = this;
        var e = new i;
        return t && e.mixIn(t), e.hasOwnProperty("init") || (e.init = function () { e.$super.init.apply(this, arguments) }), e.init.prototype = e, e.$super = this, e
      }, create: function () {
        var t = this.extend();
        return t.init.apply(t, arguments), t
      }, init: function () { }, mixIn: function (t) {
        for (var e in t) t.hasOwnProperty(e) && (this[e] = t[e]);
        t.hasOwnProperty("toString") && (this.toString = t.toString)
      }, clone: function () {
        return this.init.prototype.extend(this)
      }
    },
    o = r.WordArray = s.extend({
      init: function (t, n) { t = this.words = t || [], this.sigBytes = n != e ? n : 4 * t.length }, toString: function (t) {
        return (t || c).stringify(this)
      }, concat: function (t) {
        var e = this.words,
          n = t.words,
          r = this.sigBytes;
        if (t = t.sigBytes, this.clamp(), r % 4)
          for (var i = 0; t > i; i++) e[r + i >>> 2] |= (n[i >>> 2] >>> 24 - 8 * (i % 4) & 255) << 24 - 8 * ((r + i) % 4);
        else if (65535 < n.length)
          for (i = 0; t > i; i += 4) e[r + i >>> 2] = n[i >>> 2];
        else e.push.apply(e, n);
        return this.sigBytes += t, this
      }, clamp: function () {
        var e = this.words,
          n = this.sigBytes;
        e[n >>> 2] &= 4294967295 << 32 - 8 * (n % 4), e.length = t.ceil(n / 4)
      }, clone: function () {
        var t = s.clone.call(this);
        return t.words = this.words.slice(0), t
      }, random: function (e) {
        for (var n = [], r = 0; e > r; r += 4) n.push(4294967296 * t.random() | 0);
        return new o.init(n, e)
      }
    }),
    a = n.enc = {},
    c = a.Hex = {
      stringify: function (t) {
        var e = t.words;
        t = t.sigBytes;
        for (var n = [], r = 0; t > r; r++) {
          var i = e[r >>> 2] >>> 24 - 8 * (r % 4) & 255;
          n.push((i >>> 4).toString(16)), n.push((15 & i).toString(16))
        }
        return n.join("")
      }, parse: function (t) {
        for (var e = t.length, n = [], r = 0; e > r; r += 2) n[r >>> 3] |= parseInt(t.substr(r, 2), 16) << 24 - 4 * (r % 8);
        return new o.init(n, e / 2)
      }
    },
    h = a.Latin1 = {
      stringify: function (t) {
        var e = t.words;
        t = t.sigBytes;
        for (var n = [], r = 0; t > r; r++) n.push(String.fromCharCode(e[r >>> 2] >>> 24 - 8 * (r % 4) & 255));
        return n.join("")
      }, parse: function (t) {
        for (var e = t.length, n = [], r = 0; e > r; r++) n[r >>> 2] |= (255 & t.charCodeAt(r)) << 24 - 8 * (r % 4);
        return new o.init(n, e)
      }
    },
    f = a.Utf8 = {
      stringify: function (t) {
        try {
          return decodeURIComponent(escape(h.stringify(t)))
        } catch (e) {
          throw Error("Malformed UTF-8 data")
        }
      }, parse: function (t) {
        return h.parse(unescape(encodeURIComponent(t)))
      }
    },
    u = r.BufferedBlockAlgorithm = s.extend({
      reset: function () { this._data = new o.init, this._nDataBytes = 0 }, _append: function (t) { "string" == typeof t && (t = f.parse(t)), this._data.concat(t), this._nDataBytes += t.sigBytes }, _process: function (e) {
        var n = this._data,
          r = n.words,
          i = n.sigBytes,
          s = this.blockSize,
          a = i / (4 * s),
          a = e ? t.ceil(a) : t.max((0 | a) - this._minBufferSize, 0);
        if (e = a * s, i = t.min(4 * e, i), e) {
          for (var c = 0; e > c; c += s) this._doProcessBlock(r, c);
          c = r.splice(0, e), n.sigBytes -= i
        }
        return new o.init(c, i)
      }, clone: function () {
        var t = s.clone.call(this);
        return t._data = this._data.clone(), t
      }, _minBufferSize: 0
    });
  r.Hasher = u.extend({
    cfg: s.extend(), init: function (t) { this.cfg = this.cfg.extend(t), this.reset() }, reset: function () { u.reset.call(this), this._doReset() }, update: function (t) {
      return this._append(t), this._process(), this
    }, finalize: function (t) {
      return t && this._append(t), this._doFinalize()
    }, blockSize: 16, _createHelper: function (t) {
      return function (e, n) {
        return new t.init(n).finalize(e)
      }
    }, _createHmacHelper: function (t) {
      return function (e, n) {
        return new l.HMAC.init(t, n).finalize(e)
      }
    }
  });
  var l = n.algo = {};
  return n
}(Math);
! function () {
  var t = CryptoJS,
    e = t.lib,
    n = e.WordArray,
    r = e.Hasher,
    i = [],
    e = t.algo.SHA1 = r.extend({
      _doReset: function () { this._hash = new n.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]) }, _doProcessBlock: function (t, e) {
        for (var n = this._hash.words, r = n[0], s = n[1], o = n[2], a = n[3], c = n[4], h = 0; 80 > h; h++) {
          if (16 > h) i[h] = 0 | t[e + h];
          else {
            var f = i[h - 3] ^ i[h - 8] ^ i[h - 14] ^ i[h - 16];
            i[h] = f << 1 | f >>> 31
          }
          f = (r << 5 | r >>> 27) + c + i[h], f = 20 > h ? f + ((s & o | ~s & a) + 1518500249) : 40 > h ? f + ((s ^ o ^ a) + 1859775393) : 60 > h ? f + ((s & o | s & a | o & a) - 1894007588) : f + ((s ^ o ^ a) - 899497514), c = a, a = o, o = s << 30 | s >>> 2, s = r, r = f
        }
        n[0] = n[0] + r | 0, n[1] = n[1] + s | 0, n[2] = n[2] + o | 0, n[3] = n[3] + a | 0, n[4] = n[4] + c | 0
      }, _doFinalize: function () {
        var t = this._data,
          e = t.words,
          n = 8 * this._nDataBytes,
          r = 8 * t.sigBytes;
        return e[r >>> 5] |= 128 << 24 - r % 32, e[(r + 64 >>> 9 << 4) + 14] = Math.floor(n / 4294967296), e[(r + 64 >>> 9 << 4) + 15] = n, t.sigBytes = 4 * e.length, this._process(), this._hash
      }, clone: function () {
        var t = r.clone.call(this);
        return t._hash = this._hash.clone(), t
      }
    });
  t.SHA1 = r._createHelper(e), t.HmacSHA1 = r._createHmacHelper(e)
}(),
  function () {
    var t = CryptoJS,
      e = t.enc.Utf8;
    t.algo.HMAC = t.lib.Base.extend({
      init: function (t, n) {
        t = this._hasher = new t.init, "string" == typeof n && (n = e.parse(n));
        var r = t.blockSize,
          i = 4 * r;
        n.sigBytes > i && (n = t.finalize(n)), n.clamp();
        for (var s = this._oKey = n.clone(), o = this._iKey = n.clone(), a = s.words, c = o.words, h = 0; r > h; h++) a[h] ^= 1549556828, c[h] ^= 909522486;
        s.sigBytes = o.sigBytes = i, this.reset()
      }, reset: function () {
        var t = this._hasher;
        t.reset(), t.update(this._iKey)
      }, update: function (t) {
        return this._hasher.update(t), this
      }, finalize: function (t) {
        var e = this._hasher;
        return t = e.finalize(t), e.reset(), e.finalize(this._oKey.clone().concat(t))
      }
    })
  }();
var qiniuToken = {
  config: { access_key: "", secret_key: "", bucketname: "" }, getFlags: function () {
    var t = 3600 + Math.floor(Date.now() / 1e3),
      e = { scope: this.config.bucketname, deadline: t, saveKey: this.config.saveKey, returnBody: this.config.returnBody };
    return e
  }, byteArrayToString: function (t) {
    var e, n = "",
      r = t.length;
    for (e = 0; r > e; e++) n += String.fromCharCode(t[e]);
    return n
  }, urlsafeBase64EncodeFlag: function () {
    return this.base64_encode(JSON.stringify(this.getFlags()))
  }, wordsToByteArray: function (t) {
    var e, n = [];
    for (e = 0; e < 32 * t.length; e += 8) n.push(t[e >>> 5] >>> 24 - e % 32 & 255);
    return n
  }, base64ToUrlSafe: function (t) {
    return t.replace(/\//g, "_").replace(/\+/g, "-")
  }, getToken: function () {
    var t = this.urlsafeBase64EncodeFlag(),
      e = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA1, this.config.secret_key);
    e.update(t);
    var n = e.finalize().words,
      r = this.base64_encode(this.byteArrayToString(this.wordsToByteArray(n))),
      i = this.base64ToUrlSafe(r),
      s = this.config.access_key + ":" + i + ":" + t;
    return s
  }, byteArrayToString: function (t) {
    var e, n = "",
      r = t.length;
    for (e = 0; r > e; e++) n += String.fromCharCode(t[e]);
    return n
  }, base64_encode: function (t) {
    for (var e, n, r, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, o = t.length, a = ""; o > s;) {
      if (e = 255 & t.charCodeAt(s++), s == o) {
        a += i.charAt(e >> 2), a += i.charAt((3 & e) << 4), a += "==";
        break
      }
      if (n = t.charCodeAt(s++), s == o) {
        a += i.charAt(e >> 2), a += i.charAt((3 & e) << 4 | (240 & n) >> 4), a += i.charAt((15 & n) << 2), a += "=";
        break
      }
      r = t.charCodeAt(s++), a += i.charAt(e >> 2), a += i.charAt((3 & e) << 4 | (240 & n) >> 4), a += i.charAt((15 & n) << 2 | (192 & r) >> 6), a += i.charAt(63 & r)
    }
    return a
  }
};

class KlogUploader extends PolymerElement {
  static get template() {
    return html`
    <iron-ajax id="ajax" method="post" url="https://up.qbox.me" handle-as="json" on-response="_onResponse"></iron-ajax>
`;
  }

  static get is() { return 'klog-data-uploader'; }

  static get properties() {
    return {
      fileinfo: {
        type: Object,
        notify: true,
      },
      bucketname: {
        type: String,
        value: 'klog2',
        notify: true,
      },
      remainingNumber: {
        type: Number,
        notify: true,
      },
      files: {
        type: Array,
        value: [],
      },
      uploading: {
        type: Boolean,
        value: false,
        notify: true,
      },
    }
  }

  _onResponse(e) {
    //update fileinfo
    let fileinfo = e.detail.response;
    fileinfo.host = 'http://oxqsk2qu4.bkt.clouddn.com';
    //console.log(fileinfo);
    if (fileinfo) {
      fileinfo.remaining = this.files.length != 1;
      fileinfo.timestamp = Date.parse(new Date());
      this.set('fileinfo', fileinfo);
    }
    //fire
    this.dispatchEvent(new CustomEvent('upload-success', { bubbles: true, composed: true, detail: { fileinfo: this.fileinfo } }));
    //upload next file
    this.shift('files');
    this._filesChanged();
    if (this.files.length > 0) {
      this._uploadToServer(this.files[0]);
    } else {
      this.uploading = false;
    }
  }

  upload(file) {
    if (!file) return
    this.push('files', file);
    this._filesChanged();
    if (!this.uploading) {
      this._uploadToServer(this.files[0]);
    }
  }

  _uploadToServer(file) {
    if (!file) return
    this.uploading = true;
    let data = new FormData();
    data.append('file', file);
    //data.append('key', file.name);
    data.append('token', this.getToken(this.bucketname));
    this.$.ajax.body = data;
    this.$.ajax.generateRequest();
  }

  _filesChanged() {
    this.remainingNumber = this.files.length;
  }

  getToken(bucketname) {
    qiniuToken.config.access_key = 'iaK9y8sIrzgjYcYfkQOlIYloEugbL-OL2ujMe9G9';
    qiniuToken.config.secret_key = 'PIz-ntSB_NVGW3yO_49VbFy0i1GfKVmhi_MtvkqE';
    qiniuToken.config.bucketname = bucketname;
    qiniuToken.config.saveKey = '$(etag)$(ext)';
    qiniuToken.config.returnBody = '{"key": $(key), "hash": $(etag), "fname": $(fname), "mimeType": $(mimeType), "width": $(imageInfo.width), "height": $(imageInfo.height), "exif": $(exif), "imageAve": $(imageAve), "bucket": $(bucket)}';
    var token = qiniuToken.getToken();
    return token
  }
}

window.customElements.define(KlogUploader.is, KlogUploader);
