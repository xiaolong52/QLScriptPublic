/*
jzack 
资金盘-微田 单账号 一天0.2 秒到支付宝 进软件绑定支付宝账号 

一个支付宝可以绑定两个账号 手机号绑定一个 邮箱账号一个

数据填入 weitian  变量 

抓包  www.psfhwn.cn 域名 请求header  的 token 和 unionid 的值

以#分割      多账号 @ 或者 换行
token#unionid 
例如
38xxxxxx#123xxxxxxxxxxxxx
const $ = new Env("资金盘-微田");
cron: 10,20,30 0-23 * * *
*/
const $ = new Env('微田');
let envSplitor = ['@', '\n']
let httpResult, httpReq, httpResp, usid = 0,
    userCount = 0,
    userList = []
const ckName = 'weitian'
let userCookie = ($.isNode() ? process.env[ckName] : $.getdata(ckName)) || '';
async function action() {
    if (userCount > 0) {
        let a = [];
        for (let l of userList) a.push(l.getuseinfo());
        await Promise.all(a)
    }
}
class UserInfo {
    constructor(t) {
        this.fsd = `账号[${++usid}] `, this.c1 = t.split("#")[0], this.c2 = t.split("#")[1], this.u = $.randomString(28), this.h = {
            Connection: "keep-alive",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
            unionid: this.c2,
            Origin: "http://www.zoheev.cn",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1",
            token: this.c1,
            Host: "www.psfhwn.cn",
            Referer: "http://www.zoheev.cn/",
            "Accept-Language": "zh-cn",
            Accept: "*/*"
        }
    }
    async addmyorder0() {
        await httpRequest("post", popu("http://www.psfhwn.cn/user/addmyorder0", this.h, `{"unionid":"${this.c2}"}`));
        1 == httpResult.data && console.log(`${this.fsd}领取F0 成功 `)
    }
    async pushcash() {
        await httpRequest("post", popu("http://www.psfhwn.cn/trade/pushcash", this.h, `{"unionid":"${this.c2}","money":${this.cash}}`));
        1 == httpResult.data && console.log(`${this.fsd}提现${this.cash} 成功`)
    }
    async getuseinfo() {
        await httpRequest("post", popu("http://www.psfhwn.cn/user/getuseinfo", this.h, `{"unionid":"${this.c2}"}`));
        let t = httpResult;
        1 == t.data && (t.result.alipay && (console.log(`${this.fsd}${t.result.nickname} 已绑定支付宝 今日收益 ${t.result.totalmoney} 余额 ${t.result.money} 还可提 ${t.result.cashnum}次`), this.mx = 1, this.cash = t.result.money, this.br = t.result.cashnum), t.result.alipay || console.log(`${this.fsd}${t.result.nickname} 未绑定支付宝 今日收益 ${t.result.totalmoney} 余额 ${t.result.money} 还可提 ${t.result.cashnum}次`), await this.addmyorder0(), 1 == this.mx && this.cash >= .2 && this.br > 0 && await this.pushcash())
    }
}
(async () => {
    "undefined" != typeof $request && await GetRewrite(), await checkEnv() && userCount > 0 && await action()
})().catch(a => console.log(a)).finally(() => $.done());
///////////////////////////////////////////////////////////////////
async function GetRewrite() {}
async function checkEnv() {
    if (userCookie) {
        let e = envSplitor[0];
        for (let f of envSplitor)
            if (userCookie.indexOf(f) > -1) {
                e = f;
                break
            } for (let l of userCookie.split(e)) l && userList.push(new UserInfo(l));
        userCount = userList.length
    } else console.log(`未找到任何数据`);
    return userCount > 0 && console.log(`找到${userCount}个账号`), !0
}
////////////////////////////////////////////////////////////////////
function popu(e, t, n = "") {
    e.replace("//", "/").split("/")[1];
    let r = {
        url: e,
        headers: t,
        timeout: 7e3
    };
    return n && (r.body = n, r.headers["Content-Length"] = n?.length || 0), r
}
async function httpRequest(e, l) {
    return httpResult = null, httpReq = null, httpResp = null, new Promise(n => {
        $.send(e, l, async (e, l, t) => {
            try {
                if (httpReq = l, httpResp = t, e);
                else if (t.body) {
                    if ("object" == typeof t.body) httpResult = t.body;
                    else try {
                        httpResult = JSON.parse(t.body)
                    } catch (y) {
                        httpResult = t.body
                    }
                }
            } catch (o) {
                console.log(o)
            } finally {
                n()
            }
        })
    })
}
////////////////////////////////////////////////////////////////////
function Env(e, s) {
    return "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0), new class {
        constructor(e, s) {
            this.name = e, this.notifyStr = "", this.notifyFlag = !1, this.startTime = (new Date).getTime(), Object.assign(this, s), console.log(`${this.name} 开始运行：
`)
        }
        isNode() {
            return "undefined" != typeof module && !!module.exports
        }
        isQuanX() {
            return "undefined" != typeof $task
        }
        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon
        }
        isLoon() {
            return "undefined" != typeof $loon
        }
        getdata(e) {
            let s = this.getval(e);
            if (/^@/.test(e)) {
                let [, i, n] = /^@(.*?)\.(.*?)$/.exec(e), r = i ? this.getval(i) : "";
                if (r) try {
                    let o = JSON.parse(r);
                    s = o ? this.lodash_get(o, n, "") : s
                } catch (a) {
                    s = ""
                }
            }
            return s
        }
        setdata(e, s) {
            let i = !1;
            if (/^@/.test(s)) {
                let [, n, r] = /^@(.*?)\.(.*?)$/.exec(s), o = this.getval(n);
                try {
                    let a = JSON.parse(n ? "null" === o ? null : o || "{}" : "{}");
                    this.lodash_set(a, r, e), i = this.setval(JSON.stringify(a), n)
                } catch (l) {
                    let h = {};
                    this.lodash_set(h, r, e), i = this.setval(JSON.stringify(h), n)
                }
            } else i = this.setval(e, s);
            return i
        }
        getval(e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(e) : this.isQuanX() ? $prefs.valueForKey(e) : this.isNode() ? (this.data = this.loaddata(), this.data[e]) : this.data && this.data[e] || null
        }
        setval(e, s) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(e, s) : this.isQuanX() ? $prefs.setValueForKey(e, s) : this.isNode() ? (this.data = this.loaddata(), this.data[s] = e, this.writedata(), !0) : this.data && this.data[s] || null
        }
        send(e, s, i = () => {}) {
            if ("get" != e && "post" != e && "put" != e && "delete" != e) {
                console.log(`无效的http方法：${e}`);
                return
            }
            if ("get" == e && s.headers ? (delete s.headers["Content-Type"], delete s.headers["Content-Length"]) : s.body && s.headers && !s.headers["Content-Type"] && (s.headers["Content-Type"] = "application/x-www-form-urlencoded"), this.isSurge() || this.isLoon()) {
                this.isSurge() && this.isNeedRewrite && (s.headers = s.headers || {}, Object.assign(s.headers, {
                    "X-Surge-Skip-Scripting": !1
                }));
                let n = {
                    method: e,
                    url: s.url,
                    headers: s.headers,
                    timeout: s.timeout,
                    data: s.body
                };
                "get" == e && delete n.data, $axios(n).then(e => {
                    let {
                        status: s,
                        request: n,
                        headers: r,
                        data: o
                    } = e;
                    i(null, n, {
                        statusCode: s,
                        headers: r,
                        body: o
                    })
                }).catch(e => console.log(e))
            } else if (this.isQuanX()) s.method = e.toUpperCase(), this.isNeedRewrite && (s.opts = s.opts || {}, Object.assign(s.opts, {
                hints: !1
            })), $task.fetch(s).then(e => {
                let {
                    statusCode: s,
                    request: n,
                    headers: r,
                    body: o
                } = e;
                i(null, n, {
                    statusCode: s,
                    headers: r,
                    body: o
                })
            }, e => i(e));
            else if (this.isNode()) {
                this.got = this.got ? this.got : require("got");
                let {
                    url: r,
                    ...o
                } = s;
                this.instance = this.got.extend({
                    followRedirect: !1
                }), this.instance[e](r, o).then(e => {
                    let {
                        statusCode: s,
                        request: n,
                        headers: r,
                        body: o
                    } = e;
                    i(null, n, {
                        statusCode: s,
                        headers: r,
                        body: o
                    })
                }, e => {
                    let {
                        message: s,
                        request: n,
                        response: r
                    } = e;
                    i(s, n, r)
                })
            }
        }
        time(e, s = null) {
            let i = s ? new Date(s) : new Date,
                n = {
                    "M+": i.getMonth() + 1,
                    "d+": i.getDate(),
                    "h+": i.getHours(),
                    "m+": i.getMinutes(),
                    "s+": i.getSeconds(),
                    "q+": Math.floor((i.getMonth() + 3) / 3),
                    S: this.padStr(i.getMilliseconds(), 3)
                };
            for (let r in /(y+)/.test(e) && (e = e.replace(RegExp.$1, (i.getFullYear() + "").substr(4 - RegExp.$1.length))), n) RegExp("(" + r + ")").test(e) && (e = e.replace(RegExp.$1, 1 == RegExp.$1.length ? n[r] : ("00" + n[r]).substr(("" + n[r]).length)));
            return e
        }
        async showmsg() {
            if (!this.notifyFlag || !this.notifyStr) return;
            let e = this.name + " 运行通知\n\n" + this.notifyStr;
            if ($.isNode()) {
                var s = require("./sendNotify");
                console.log("\n============== 推送 =============="), await s.sendNotify(this.name, e)
            } else this.msg(e)
        }
        logAndNotify(e, s = !0) {
            s && (this.notifyFlag = !0), console.log(e), this.notifyStr += e, this.notifyStr += "\n"
        }
        logAndNotifyWithTime(e, s = !0) {
            s && (this.notifyFlag = !0);
            let i = "[" + this.time("hh:mm:ss.S") + "]" + e;
            console.log(i), this.notifyStr += i, this.notifyStr += "\n"
        }
        logWithTime(e) {
            console.log("[" + this.time("hh:mm:ss.S") + "]" + e)
        }
        msg(e = t, s = "", i = "", n) {
            let r = e => {
                if (!e) return e;
                if ("string" == typeof e) return this.isLoon() ? e : this.isQuanX() ? {
                    "open-url": e
                } : this.isSurge() ? {
                    url: e
                } : void 0;
                if ("object" == typeof e) {
                    if (this.isLoon()) {
                        let s;
                        return {
                            openUrl: e.openUrl || e.url || e["open-url"],
                            mediaUrl: e.mediaUrl || e["media-url"]
                        }
                    }
                    if (this.isQuanX()) {
                        let i;
                        return {
                            "open-url": e["open-url"] || e.url || e.openUrl,
                            "media-url": e["media-url"] || e.mediaUrl
                        }
                    }
                    if (this.isSurge()) return {
                        url: e.url || e.openUrl || e["open-url"]
                    }
                }
            };
            this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, r(n)) : this.isQuanX() && $notify(e, s, i, r(n)));
            let o = ["", "============== 系统通知 =============="];
            o.push(e), s && o.push(s), i && o.push(i), console.log(o.join("\n"))
        }
        getMin(e, s) {
            return e < s ? e : s
        }
        getMax(e, s) {
            return e < s ? s : e
        }
        padStr(e, s, i = "0") {
            let n = String(e),
                r = s > n.length ? s - n.length : 0,
                o = "";
            for (let a = 0; a < r; a++) o += i;
            return o + n
        }
        json2str(e, s, i = !1) {
            let n = [];
            for (let r of Object.keys(e).sort()) {
                let o = e[r];
                o && i && (o = encodeURIComponent(o)), n.push(r + "=" + o)
            }
            return n.join(s)
        }
        str2json(e, s = !1) {
            let i = {};
            for (let n of e.split("&")) {
                if (!n) continue;
                let r = n.indexOf("=");
                if (-1 == r) continue;
                let o = n.substr(0, r),
                    a = n.substr(r + 1);
                s && (a = decodeURIComponent(a)), i[o] = a
            }
            return i
        }
        randomPattern(e, s = "abcdef0123456789") {
            let i = "";
            for (let n of e) "x" == n ? i += s.charAt(Math.floor(Math.random() * s.length)) : "X" == n ? i += s.charAt(Math.floor(Math.random() * s.length)).toUpperCase() : i += n;
            return i
        }
        randomString(e, s = "abcdef0123456789") {
            let i = "";
            for (let n = 0; n < e; n++) i += s.charAt(Math.floor(Math.random() * s.length));
            return i
        }
        randomList(e) {
            return e[Math.floor(Math.random() * e.length)]
        }
        wait(e) {
            return new Promise(s => setTimeout(s, e))
        }
        async done(e = {}) {
            await this.showmsg();
            let s = (new Date).getTime(),
                i = (s - this.startTime) / 1e3;
            console.log(`
${this.name} 运行结束，共运行了 ${i} 秒！`), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(e)
        }
    }(e, s)
}
