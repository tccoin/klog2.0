import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import './klog-style-scrollbar.js';
import { html as html$0 } from '@polymer/polymer/lib/utils/html-tag.js';
/* PrismJS 1.12.2
http://prismjs.com/download.html#themes=prism&languages=markup+css+clike+javascript+c+bash+cpp+csharp+coffeescript+java+json+latex */
var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {}, Prism = function () { var e = /\blang(?:uage)?-(\w+)\b/i, t = 0, n = _self.Prism = { manual: _self.Prism && _self.Prism.manual, disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler, util: { encode: function (e) { return e instanceof r ? new r(e.type, n.util.encode(e.content), e.alias) : "Array" === n.util.type(e) ? e.map(n.util.encode) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ") }, type: function (e) { return Object.prototype.toString.call(e).match(/\[object (\w+)\]/)[1] }, objId: function (e) { return e.__id || Object.defineProperty(e, "__id", { value: ++t }), e.__id }, clone: function (e, t) { var r = n.util.type(e); switch (t = t || {}, r) { case "Object": if (t[n.util.objId(e)]) return t[n.util.objId(e)]; var a = {}; t[n.util.objId(e)] = a; for (var i in e) e.hasOwnProperty(i) && (a[i] = n.util.clone(e[i], t)); return a; case "Array": if (t[n.util.objId(e)]) return t[n.util.objId(e)]; var a = []; return t[n.util.objId(e)] = a, e.forEach(function (e, r) { a[r] = n.util.clone(e, t) }), a }return e } }, languages: { extend: function (e, t) { var r = n.util.clone(n.languages[e]); for (var a in t) r[a] = t[a]; return r }, insertBefore: function (e, t, r, a) { a = a || n.languages; var i = a[e]; if (2 == arguments.length) { r = arguments[1]; for (var l in r) r.hasOwnProperty(l) && (i[l] = r[l]); return i } var o = {}; for (var s in i) if (i.hasOwnProperty(s)) { if (s == t) for (var l in r) r.hasOwnProperty(l) && (o[l] = r[l]); o[s] = i[s] } return n.languages.DFS(n.languages, function (t, n) { n === a[e] && t != e && (this[t] = o) }), a[e] = o }, DFS: function (e, t, r, a) { a = a || {}; for (var i in e) e.hasOwnProperty(i) && (t.call(e, i, e[i], r || i), "Object" !== n.util.type(e[i]) || a[n.util.objId(e[i])] ? "Array" !== n.util.type(e[i]) || a[n.util.objId(e[i])] || (a[n.util.objId(e[i])] = !0, n.languages.DFS(e[i], t, i, a)) : (a[n.util.objId(e[i])] = !0, n.languages.DFS(e[i], t, null, a))) } }, plugins: {}, highlightAll: function (e, t) { n.highlightAllUnder(document, e, t) }, highlightAllUnder: function (e, t, r) { var a = { callback: r, selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code' }; n.hooks.run("before-highlightall", a); for (var i, l = a.elements || e.querySelectorAll(a.selector), o = 0; i = l[o++];)n.highlightElement(i, t === !0, a.callback) }, highlightElement: function (t, r, a) { for (var i, l, o = t; o && !e.test(o.className);)o = o.parentNode; o && (i = (o.className.match(e) || [, ""])[1].toLowerCase(), l = n.languages[i]), t.className = t.className.replace(e, "").replace(/\s+/g, " ") + " language-" + i, t.parentNode && (o = t.parentNode, /pre/i.test(o.nodeName) && (o.className = o.className.replace(e, "").replace(/\s+/g, " ") + " language-" + i)); var s = t.textContent, u = { element: t, language: i, grammar: l, code: s }; if (n.hooks.run("before-sanity-check", u), !u.code || !u.grammar) return u.code && (n.hooks.run("before-highlight", u), u.element.textContent = u.code, n.hooks.run("after-highlight", u)), n.hooks.run("complete", u), void 0; if (n.hooks.run("before-highlight", u), r && _self.Worker) { var g = new Worker(n.filename); g.onmessage = function (e) { u.highlightedCode = e.data, n.hooks.run("before-insert", u), u.element.innerHTML = u.highlightedCode, a && a.call(u.element), n.hooks.run("after-highlight", u), n.hooks.run("complete", u) }, g.postMessage(JSON.stringify({ language: u.language, code: u.code, immediateClose: !0 })) } else u.highlightedCode = n.highlight(u.code, u.grammar, u.language), n.hooks.run("before-insert", u), u.element.innerHTML = u.highlightedCode, a && a.call(t), n.hooks.run("after-highlight", u), n.hooks.run("complete", u) }, highlight: function (e, t, a) { var i = n.tokenize(e, t); return r.stringify(n.util.encode(i), a) }, matchGrammar: function (e, t, r, a, i, l, o) { var s = n.Token; for (var u in r) if (r.hasOwnProperty(u) && r[u]) { if (u == o) return; var g = r[u]; g = "Array" === n.util.type(g) ? g : [g]; for (var c = 0; c < g.length; ++c) { var h = g[c], f = h.inside, d = !!h.lookbehind, m = !!h.greedy, p = 0, y = h.alias; if (m && !h.pattern.global) { var v = h.pattern.toString().match(/[imuy]*$/)[0]; h.pattern = RegExp(h.pattern.source, v + "g") } h = h.pattern || h; for (var b = a, k = i; b < t.length; k += t[b].length, ++b) { var w = t[b]; if (t.length > e.length) return; if (!(w instanceof s)) { h.lastIndex = 0; var _ = h.exec(w), j = 1; if (!_ && m && b != t.length - 1) { if (h.lastIndex = k, _ = h.exec(e), !_) break; for (var P = _.index + (d ? _[1].length : 0), A = _.index + _[0].length, x = b, O = k, I = t.length; I > x && (A > O || !t[x].type && !t[x - 1].greedy); ++x)O += t[x].length, P >= O && (++b, k = O); if (t[b] instanceof s || t[x - 1].greedy) continue; j = x - b, w = e.slice(k, O), _.index -= k } if (_) { d && (p = _[1] ? _[1].length : 0); var P = _.index + p, _ = _[0].slice(p), A = P + _.length, N = w.slice(0, P), S = w.slice(A), C = [b, j]; N && (++b, k += N.length, C.push(N)); var E = new s(u, f ? n.tokenize(_, f) : _, y, _, m); if (C.push(E), S && C.push(S), Array.prototype.splice.apply(t, C), 1 != j && n.matchGrammar(e, t, r, b, k, !0, u), l) break } else if (l) break } } } } }, tokenize: function (e, t) { var r = [e], a = t.rest; if (a) { for (var i in a) t[i] = a[i]; delete t.rest } return n.matchGrammar(e, r, t, 0, 0, !1), r }, hooks: { all: {}, add: function (e, t) { var r = n.hooks.all; r[e] = r[e] || [], r[e].push(t) }, run: function (e, t) { var r = n.hooks.all[e]; if (r && r.length) for (var a, i = 0; a = r[i++];)a(t) } } }, r = n.Token = function (e, t, n, r, a) { this.type = e, this.content = t, this.alias = n, this.length = 0 | (r || "").length, this.greedy = !!a }; if (r.stringify = function (e, t, a) { if ("string" == typeof e) return e; if ("Array" === n.util.type(e)) return e.map(function (n) { return r.stringify(n, t, e) }).join(""); var i = { type: e.type, content: r.stringify(e.content, t, a), tag: "span", classes: ["token", e.type], attributes: {}, language: t, parent: a }; if (e.alias) { var l = "Array" === n.util.type(e.alias) ? e.alias : [e.alias]; Array.prototype.push.apply(i.classes, l) } n.hooks.run("wrap", i); var o = Object.keys(i.attributes).map(function (e) { return e + '="' + (i.attributes[e] || "").replace(/"/g, "&quot;") + '"' }).join(" "); return "<" + i.tag + ' class="' + i.classes.join(" ") + '"' + (o ? " " + o : "") + ">" + i.content + "</" + i.tag + ">" }, !_self.document) return _self.addEventListener ? (n.disableWorkerMessageHandler || _self.addEventListener("message", function (e) { var t = JSON.parse(e.data), r = t.language, a = t.code, i = t.immediateClose; _self.postMessage(n.highlight(a, n.languages[r], r)), i && _self.close() }, !1), _self.Prism) : _self.Prism; var a = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop(); return a && (n.filename = a.src, n.manual || a.hasAttribute("data-manual") || ("loading" !== document.readyState ? window.requestAnimationFrame ? window.requestAnimationFrame(n.highlightAll) : window.setTimeout(n.highlightAll, 16) : document.addEventListener("DOMContentLoaded", n.highlightAll))), _self.Prism }(); "undefined" != typeof module && module.exports && (module.exports = Prism), "undefined" != typeof global && (global.Prism = Prism);
Prism.languages.markup = { comment: /<!--[\s\S]*?-->/, prolog: /<\?[\s\S]+?\?>/, doctype: /<!DOCTYPE[\s\S]+?>/i, cdata: /<!\[CDATA\[[\s\S]*?]]>/i, tag: { pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i, greedy: !0, inside: { tag: { pattern: /^<\/?[^\s>\/]+/i, inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ } }, "attr-value": { pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i, inside: { punctuation: [/^=/, { pattern: /(^|[^\\])["']/, lookbehind: !0 }] } }, punctuation: /\/?>/, "attr-name": { pattern: /[^\s>\/]+/, inside: { namespace: /^[^\s>\/:]+:/ } } } }, entity: /&#?[\da-z]{1,8};/i }, Prism.languages.markup.tag.inside["attr-value"].inside.entity = Prism.languages.markup.entity, Prism.hooks.add("wrap", function (a) { "entity" === a.type && (a.attributes.title = a.content.replace(/&amp;/, "&")) }), Prism.languages.xml = Prism.languages.markup, Prism.languages.html = Prism.languages.markup, Prism.languages.mathml = Prism.languages.markup, Prism.languages.svg = Prism.languages.markup;
Prism.languages.css = { comment: /\/\*[\s\S]*?\*\//, atrule: { pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i, inside: { rule: /@[\w-]+/ } }, url: /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i, selector: /[^{}\s][^{};]*?(?=\s*\{)/, string: { pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: !0 }, property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i, important: /\B!important\b/i, "function": /[-a-z0-9]+(?=\()/i, punctuation: /[(){};:]/ }, Prism.languages.css.atrule.inside.rest = Prism.languages.css, Prism.languages.markup && (Prism.languages.insertBefore("markup", "tag", { style: { pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i, lookbehind: !0, inside: Prism.languages.css, alias: "language-css", greedy: !0 } }), Prism.languages.insertBefore("inside", "attr-value", { "style-attr": { pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i, inside: { "attr-name": { pattern: /^\s*style/i, inside: Prism.languages.markup.tag.inside }, punctuation: /^\s*=\s*['"]|['"]\s*$/, "attr-value": { pattern: /.+/i, inside: Prism.languages.css } }, alias: "language-css" } }, Prism.languages.markup.tag));
Prism.languages.clike = { comment: [{ pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0 }, { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0 }], string: { pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: !0 }, "class-name": { pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i, lookbehind: !0, inside: { punctuation: /[.\\]/ } }, keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/, "boolean": /\b(?:true|false)\b/, "function": /[a-z0-9_]+(?=\()/i, number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i, operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/, punctuation: /[{}[\];(),.:]/ };
Prism.languages.javascript = Prism.languages.extend("clike", { keyword: /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/, number: /\b(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/, "function": /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i, operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/ }), Prism.languages.insertBefore("javascript", "keyword", { regex: { pattern: /(^|[^\/])\/(?!\/)(\[[^\]\r\n]+]|\\.|[^\/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/, lookbehind: !0, greedy: !0 }, "function-variable": { pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i, alias: "function" } }), Prism.languages.insertBefore("javascript", "string", { "template-string": { pattern: /`(?:\\[\s\S]|[^\\`])*`/, greedy: !0, inside: { interpolation: { pattern: /\$\{[^}]+\}/, inside: { "interpolation-punctuation": { pattern: /^\$\{|\}$/, alias: "punctuation" }, rest: Prism.languages.javascript } }, string: /[\s\S]+/ } } }), Prism.languages.markup && Prism.languages.insertBefore("markup", "tag", { script: { pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i, lookbehind: !0, inside: Prism.languages.javascript, alias: "language-javascript", greedy: !0 } }), Prism.languages.js = Prism.languages.javascript;
Prism.languages.c = Prism.languages.extend("clike", { keyword: /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/, operator: /-[>-]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|\|?|[~^%?*\/]/, number: /(?:\b0x[\da-f]+|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?)[ful]*/i }), Prism.languages.insertBefore("c", "string", { macro: { pattern: /(^\s*)#\s*[a-z]+(?:[^\r\n\\]|\\(?:\r\n|[\s\S]))*/im, lookbehind: !0, alias: "property", inside: { string: { pattern: /(#\s*include\s*)(?:<.+?>|("|')(?:\\?.)+?\2)/, lookbehind: !0 }, directive: { pattern: /(#\s*)\b(?:define|defined|elif|else|endif|error|ifdef|ifndef|if|import|include|line|pragma|undef|using)\b/, lookbehind: !0, alias: "keyword" } } }, constant: /\b(?:__FILE__|__LINE__|__DATE__|__TIME__|__TIMESTAMP__|__func__|EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|stdin|stdout|stderr)\b/ }), delete Prism.languages.c["class-name"], delete Prism.languages.c["boolean"];
!function (e) { var t = { variable: [{ pattern: /\$?\(\([\s\S]+?\)\)/, inside: { variable: [{ pattern: /(^\$\(\([\s\S]+)\)\)/, lookbehind: !0 }, /^\$\(\(/], number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee]-?\d+)?/, operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/, punctuation: /\(\(?|\)\)?|,|;/ } }, { pattern: /\$\([^)]+\)|`[^`]+`/, greedy: !0, inside: { variable: /^\$\(|^`|\)$|`$/ } }, /\$(?:[\w#?*!@]+|\{[^}]+\})/i] }; e.languages.bash = { shebang: { pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/, alias: "important" }, comment: { pattern: /(^|[^"{\\])#.*/, lookbehind: !0 }, string: [{ pattern: /((?:^|[^<])<<\s*)["']?(\w+?)["']?\s*\r?\n(?:[\s\S])*?\r?\n\2/, lookbehind: !0, greedy: !0, inside: t }, { pattern: /(["'])(?:\\[\s\S]|\$\([^)]+\)|`[^`]+`|(?!\1)[^\\])*\1/, greedy: !0, inside: t }], variable: t.variable, "function": { pattern: /(^|[\s;|&])(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|npm|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|[\s;|&])/, lookbehind: !0 }, keyword: { pattern: /(^|[\s;|&])(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|[\s;|&])/, lookbehind: !0 }, "boolean": { pattern: /(^|[\s;|&])(?:true|false)(?=$|[\s;|&])/, lookbehind: !0 }, operator: /&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/, punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];]/ }; var a = t.variable[1].inside; a.string = e.languages.bash.string, a["function"] = e.languages.bash["function"], a.keyword = e.languages.bash.keyword, a.boolean = e.languages.bash.boolean, a.operator = e.languages.bash.operator, a.punctuation = e.languages.bash.punctuation, e.languages.shell = e.languages.bash }(Prism);
Prism.languages.cpp = Prism.languages.extend("c", { keyword: /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|class|compl|const|constexpr|const_cast|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|float|for|friend|goto|if|inline|int|int8_t|int16_t|int32_t|int64_t|uint8_t|uint16_t|uint32_t|uint64_t|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/, "boolean": /\b(?:true|false)\b/, operator: /--?|\+\+?|!=?|<{1,2}=?|>{1,2}=?|->|:{1,2}|={1,2}|\^|~|%|&{1,2}|\|\|?|\?|\*|\/|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/ }), Prism.languages.insertBefore("cpp", "keyword", { "class-name": { pattern: /(class\s+)\w+/i, lookbehind: !0 } }), Prism.languages.insertBefore("cpp", "string", { "raw-string": { pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/, alias: "string", greedy: !0 } });
Prism.languages.csharp = Prism.languages.extend("clike", { keyword: /\b(?:abstract|add|alias|as|ascending|async|await|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|descending|do|double|dynamic|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|from|get|global|goto|group|if|implicit|in|int|interface|internal|into|is|join|let|lock|long|namespace|new|null|object|operator|orderby|out|override|params|partial|private|protected|public|readonly|ref|remove|return|sbyte|sealed|select|set|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|value|var|virtual|void|volatile|where|while|yield)\b/, string: [{ pattern: /@("|')(?:\1\1|\\[\s\S]|(?!\1)[^\\])*\1/, greedy: !0 }, { pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*?\1/, greedy: !0 }], number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)f?/i }), Prism.languages.insertBefore("csharp", "keyword", { "generic-method": { pattern: /[a-z0-9_]+\s*<[^>\r\n]+?>\s*(?=\()/i, alias: "function", inside: { keyword: Prism.languages.csharp.keyword, punctuation: /[<>(),.:]/ } }, preprocessor: { pattern: /(^\s*)#.*/m, lookbehind: !0, alias: "property", inside: { directive: { pattern: /(\s*#)\b(?:define|elif|else|endif|endregion|error|if|line|pragma|region|undef|warning)\b/, lookbehind: !0, alias: "keyword" } } } }), Prism.languages.dotnet = Prism.languages.csharp;
!function (e) { var t = /#(?!\{).+/, n = { pattern: /#\{[^}]+\}/, alias: "variable" }; e.languages.coffeescript = e.languages.extend("javascript", { comment: t, string: [{ pattern: /'(?:\\[\s\S]|[^\\'])*'/, greedy: !0 }, { pattern: /"(?:\\[\s\S]|[^\\"])*"/, greedy: !0, inside: { interpolation: n } }], keyword: /\b(?:and|break|by|catch|class|continue|debugger|delete|do|each|else|extend|extends|false|finally|for|if|in|instanceof|is|isnt|let|loop|namespace|new|no|not|null|of|off|on|or|own|return|super|switch|then|this|throw|true|try|typeof|undefined|unless|until|when|while|window|with|yes|yield)\b/, "class-member": { pattern: /@(?!\d)\w+/, alias: "variable" } }), e.languages.insertBefore("coffeescript", "comment", { "multiline-comment": { pattern: /###[\s\S]+?###/, alias: "comment" }, "block-regex": { pattern: /\/{3}[\s\S]*?\/{3}/, alias: "regex", inside: { comment: t, interpolation: n } } }), e.languages.insertBefore("coffeescript", "string", { "inline-javascript": { pattern: /`(?:\\[\s\S]|[^\\`])*`/, inside: { delimiter: { pattern: /^`|`$/, alias: "punctuation" }, rest: e.languages.javascript } }, "multiline-string": [{ pattern: /'''[\s\S]*?'''/, greedy: !0, alias: "string" }, { pattern: /"""[\s\S]*?"""/, greedy: !0, alias: "string", inside: { interpolation: n } }] }), e.languages.insertBefore("coffeescript", "keyword", { property: /(?!\d)\w+(?=\s*:(?!:))/ }), delete e.languages.coffeescript["template-string"] }(Prism);
Prism.languages.java = Prism.languages.extend("clike", { keyword: /\b(?:abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while)\b/, number: /\b0b[01]+\b|\b0x[\da-f]*\.?[\da-fp-]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?[df]?/i, operator: { pattern: /(^|[^.])(?:\+[+=]?|-[-=]?|!=?|<<?=?|>>?>?=?|==?|&[&=]?|\|[|=]?|\*=?|\/=?|%=?|\^=?|[?:~])/m, lookbehind: !0 } }), Prism.languages.insertBefore("java", "function", { annotation: { alias: "punctuation", pattern: /(^|[^.])@\w+/, lookbehind: !0 } });
Prism.languages.json = { property: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/i, string: { pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/, greedy: !0 }, number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/, punctuation: /[{}[\]);,]/, operator: /:/g, "boolean": /\b(?:true|false)\b/i, "null": /\bnull\b/i }, Prism.languages.jsonp = Prism.languages.json;
!function (a) { var e = /\\(?:[^a-z()[\]]|[a-z*]+)/i, n = { "equation-command": { pattern: e, alias: "regex" } }; a.languages.latex = { comment: /%.*/m, cdata: { pattern: /(\\begin\{((?:verbatim|lstlisting)\*?)\})[\s\S]*?(?=\\end\{\2\})/, lookbehind: !0 }, equation: [{ pattern: /\$(?:\\[\s\S]|[^\\$])*\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/, inside: n, alias: "string" }, { pattern: /(\\begin\{((?:equation|math|eqnarray|align|multline|gather)\*?)\})[\s\S]*?(?=\\end\{\2\})/, lookbehind: !0, inside: n, alias: "string" }], keyword: { pattern: /(\\(?:begin|end|ref|cite|label|usepackage|documentclass)(?:\[[^\]]+\])?\{)[^}]+(?=\})/, lookbehind: !0 }, url: { pattern: /(\\url\{)[^}]+(?=\})/, lookbehind: !0 }, headline: { pattern: /(\\(?:part|chapter|section|subsection|frametitle|subsubsection|paragraph|subparagraph|subsubparagraph|subsubsubparagraph)\*?(?:\[[^\]]+\])?\{)[^}]+(?=\}(?:\[[^\]]+\])?)/, lookbehind: !0, alias: "class-name" }, "function": { pattern: e, alias: "selector" }, punctuation: /[[\]{}&]/ } }(Prism);
Prism.languages.matlab = { comment: [/%\{[\s\S]*?\}%/, /%.+/], string: { pattern: /\B'(?:''|[^'\r\n])*'/, greedy: !0 }, number: /(?:\b\d+\.?\d*|\B\.\d+)(?:[eE][+-]?\d+)?(?:[ij])?|\b[ij]\b/, keyword: /\b(?:break|case|catch|continue|else|elseif|end|for|function|if|inf|NaN|otherwise|parfor|pause|pi|return|switch|try|while)\b/, "function": /(?!\d)\w+(?=\s*\()/, operator: /\.?[*^\/\\']|[+\-:@]|[<>=~]=?|&&?|\|\|?/, punctuation: /\.{3}|[.,;\[\](){}!]/ };
Prism.languages.python = { comment: { pattern: /(^|[^\\])#.*/, lookbehind: !0 }, "triple-quoted-string": { pattern: /("""|''')[\s\S]+?\1/, greedy: !0, alias: "string" }, string: { pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/, greedy: !0 }, "function": { pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g, lookbehind: !0 }, "class-name": { pattern: /(\bclass\s+)\w+/i, lookbehind: !0 }, keyword: /\b(?:as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|nonlocal|pass|print|raise|return|try|while|with|yield)\b/, builtin: /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/, "boolean": /\b(?:True|False|None)\b/, number: /(?:\b(?=\d)|\B(?=\.))(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i, operator: /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]|\b(?:or|and|not)\b/, punctuation: /[{}[\];(),.:]/ };
class KlogRenderCode extends PolymerElement {
  static get template() {
    return html$0`
    <style include="klog-style-scrollbar"></style>
    <style include="prism-style"></style>
    <style>
      :host {
        display: block;
        margin: calc(1em + 12px) 0 1em;
      }

      code,
      pre {
        font-family: Menlo, Monaco, Consolas, "Andale Mono", "lucida console", "Courier New", -apple-system, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif !important;
      }

      pre {
        position: relative;
        margin: 0;
        padding: 0;
        line-height: 1.5;
        text-align: left;
        white-space: pre;
        word-spacing: normal;
        word-break: normal;
        word-wrap: normal;
        -moz-tab-size: 4;
        -o-tab-size: 4;
        tab-size: 4;
        border-radius: 5px;
        background: var(--klog-markdown-block-color);
      }

      pre code {
        display: block;
        width: 100%;
        padding: 16px;
        overflow: auto;
        box-sizing: border-box;
      }

      :not(pre)>code,
      .klog-article-content>code {
        padding: 1px 4px;
        border-radius: 3px;
        word-break: break-all;
        white-space: normal;
      }

      :host(.has-meta) code {
        padding-top: 24px;
      }

      :host(.overflow-code) code {
        max-height: 80vh;
        overflow: auto;
      }

      .meta {
        padding: 0 16px;
      }

      .meta .code-lang {
        z-index: 10;
      }

      .meta>* {
        padding: 2px 10px;
        border-radius: 5px;
        font-size: 0.875em;
        background: var(--primary-color);
        color: var(--klog-markdown-block-color);
        user-select: none;
        -webkit-user-select: none;
        cursor: default;
        position: absolute;
        top: -12px;
        @apply(--shadow-elevation-2dp);
      }

      pre code:first-child {
        padding-top: 0;
      }
    </style>
    <div id="container" theme\$="[[theme]]">
      <pre id="pre"><template is="dom-if" if="{{lang}}"><div class="meta"><span class="code-lang">{{lang}}</span></div></template><code id="code"></code></pre>
    </div>
`;
  }

  static get is() { return 'klog-render-code'; }

  static get properties() {
    return {
      lang: {
        type: String,
        value: ''
      },
      code: {
        type: String,
        value: ''
      },
      theme: {
        type: String,
        value: 'dark',
        reflectToAttribute: true,
      }
    }
  }

  ready() {
    super.ready();
    if (Prism) {
      this.placeHolderPromise = this.update();
    } else {
      console.error('Prism not found');
      this.placeHolderPromise = Promise.resolve();
    }
  }

  update() {
    return new Promise(resolve => {
      this.lang = this.lang.replace(/cpp/i, 'c++').toUpperCase();
      let highlightLang = this.lang in Prism.languages ? lang : 'clike';
      let grammar = Prism.languages[highlightLang];
      this.highlightCode = Prism.highlight(unescape(this.code), grammar, highlightLang) || '';
      this.$.container.setAttribute('theme', this.theme);
      this.$.pre.classList.add(`language-${this.lang}`);
      this.$.code.innerHTML = this.highlightCode;
      setTimeout(resolve, 1);
    });
  }
}

window.customElements.define(KlogRenderCode.is, KlogRenderCode);
