/**
 * 今日开州
 * cron 52 8,10,13 * * *  jrkz.js
 *
 * https://share.dykz66.com/store-view/share/inviteShare?uid=122466&type=1
 * 22/11/25   评论/红包
 * ========= 青龙--配置文件 ===========
 * # 今日开州 每日1元左右现金/20起提/低保
 * export jrkz_data='0a63TjN/KP...&Bearer eyJ..&Yz...cO=='
 * 
 * 多账号用 换行 或 @ 分割
 * 抓包 api.jrkz66.com/v5_0/ , 找到 headers中 third-app-token的值 和 Authorization的值 和 device 的值
 * 用&连接 举例 0a63TjN/KP...&Bearer eyJ..&Yz...cO== 变量触发条件(屏蔽VPN | wifi代理 | ROOT) => 首页左上角 头像
 * ====================================
 *   
 */



const $ = new Env("今日开州");
const ckName = "jrkz_data";
//-------------------- 一般不动变量区域 -------------------------------------
const utils = require("./utils");
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 1;		 //0为关闭通知,1为打开通知,默认为1
let debug = 0;           //Debug调试   0关闭  1开启
let envSplitor = ["@", "\n"]; //多账号分隔符
let ck = msg = '';       //let ck,msg
let host, hostname;
let userCookie = ($.isNode() ? process.env[ckName] : $.getdata(ckName)) || '';
let userList = [];
let userIdx = 0;
let userCount = 0;
//---------------------- 自定义变量区域 -----------------------------------
let show = "每日1元左右现金/20起提/低保"
//---------------------------------------------------------

async function start() {

    console.log(show)
    console.log('\n================== 用户信息 ==================\n');
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.user_info('用户信息'));
        //await wait(1); //延迟
    }
    await Promise.all(taskall);
    console.log('\n================== 执行评论 ==================\n');
    taskall = [];
    for (let user of userList) {
        taskall.push(await user.task_reply_list('执行评论'));
        //await wait(1); //延迟
    }
    await Promise.all(taskall);



}


class UserInfo {
    constructor(str) {
        this.index = ++userIdx;
        this.ck1 = str.split('&')[0];
        this.ck2 = str.split('&')[1].replace("Bearer", "");
        this.device = str.split('&')[2];
        //let ck = str.split('&')
        //this.data1 = ck[0]
        this.host = "api.jrkz66.com";
        this.hostname = "https://" + this.host;
        this.nonce = utils.randomszxx(32);
        this.ts = utils.ts13();
        this.key = "ef80bba8858613aa33b19794d68bb338"
        this.date = utils.tmtoDate()
        this.sharecode = [];
    }

    async user_info(name) { // 获取用户信息
        let codeSign = utils.MD5_Encrypt(this.nonce + this.key + this.ts).toUpperCase()
        try {
            let options = {
                method: 'GET',
                url: this.hostname + '/v5_0/home/channel?cid=4&city=&area_code=',
                qs: { page: '2', perPage: '10' },
                headers: {
                    'Content-Type': 'application/json',
                    codeSign: codeSign,
                    channel: 'xiaomi',
                    nonce: this.nonce,
                    'User-Agent': 'QianFan;dayukaizhou;Android;MI8LiteXiaomi29;',
                    timestamp: this.ts,
                    date: this.date,
                    version: '5.1.19',
                    'product-version': '541',
                    platform: 'Xiaomi MI8Lite',
                    network: '1',
                    device: this.device,
                    'screen-height': '2154',
                    system: '2',
                    'system-version': '29',
                    'third-app-token': this.ck1,
                    'inner-version': '6.3.1.0',
                    'screen-width': '1080',
                    Authorization: 'Bearer ' + this.ck2,
                    Host: 'api.jrkz66.com',
                    Connection: 'Keep-Alive',
                }
            };
            //console.log(options);
            let result = await httpRequest(options, name);
            //console.log(result);
            if (result.ret == 0) {
                DoubleLog(`账号[${this.index}] UID: ${result.data.head[0].data.user_id} 钱包余额: ${result.data.head[1].data.items[0].value} 金币余额:${result.data.head[1].data.items[1].value} `)
                await this.share_code_info();
            } else {
                DoubleLog(`账号[${this.index}]  动态查询:失败 ❌ 了呢,原因未知！`);
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async task_reply_list(name) { // 获取评论任务列表
        try {
            let options = {
                method: 'GET',
                url: this.hostname + '/v5_0/encourage/reply-thread-feeds',
                qs: { page: '2', perPage: '10' },
                headers: {
                    Host: 'api.jrkz66.com',
                    Connection: 'keep-alive',
                    Accept: 'application/json, text/plain, */*',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36; QianFan;dayukaizhou;Android;MI8LiteXiaomi29;',
                    'X-Requested-With': 'com.dayukaizhou.forum',
                    'Sec-Fetch-Site': 'same-origin',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Dest': 'empty',
                    Referer: 'https://api.jrkz66.com/inspire-view/threadReply/index?sub_type=101',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7'
                }
            };
            //console.log(options);
            let result = await httpRequest(options, name);
            //console.log(result);
            if (result.ret == 0) {
                for (let i = 0; i < 9; i++) {
                    DoubleLog(`账号[${this.index}]  动态查找成功:tid ${result.data.list[i].tid}, uid ${result.data.list[i].uid}`);
                    let tid = result.data.list[i].tid;
                    let uid = result.data.list[i].uid;
                    let ttxt = result.data.list[i].title;
                    let ctxt = ttxt;//待测试 和文章标题一样的评论
                    await this.task_reply_do(ctxt, ttxt, tid, uid)
                    console.log('------ 评论成功,延迟20s ------')
                    await wait(20);
                }
            } else {
                DoubleLog(`账号[${this.index}]  动态查询:失败 ❌ 了呢,原因未知！`);
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async task_reply_info(name) { // 爬取相同评论且执行 暂时失效
        try {
            let options = {
                method: 'GET',
                url: this.hostname + '/v5_0/encourage/reply-thread-feeds',
                qs: { page: '2', perPage: '10' },
                headers: {
                    Host: 'api.jrkz66.com',
                    Connection: 'keep-alive',
                    Accept: 'application/json, text/plain, */*',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36; QianFan;dayukaizhou;Android;MI8LiteXiaomi29;',
                    'X-Requested-With': 'com.dayukaizhou.forum',
                    'Sec-Fetch-Site': 'same-origin',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Dest': 'empty',
                    Referer: 'https://api.jrkz66.com/inspire-view/threadReply/index?sub_type=101',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7'
                }
            };
            //console.log(options);
            let result = await httpRequest(options, name);
            //console.log(result);
            if (result.ret == 0) {
                DoubleLog(`账号[${this.index}]  文章:tid ${result.data.list[0].tid}, uid ${result.data.list[0].uid}`);
            } else {
                DoubleLog(`账号[${this.index}]  查询:失败 ❌ 了呢,原因未知！`);
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }


    async task_reply_do(ctxt, ttxt, tid, uid) { // 执行评论
        let body = {
            fid: 118,//200
            touid: uid,
            lng: '',
            black_box: '',
            pid: '0',
            product_code: '541',
            tid: tid,
            quoteuid: '0',
            content: '[{\"is_anonymous\":0,\"imagePath\":[],\"position\":0,\"inputContent\":\"' + ctxt + '"\}]',//评论文案
            mac: '70:BB:E9:D5:DA:E7',
            at_uid: [],
            threadtitle: ttxt,//文章标题
            anonymous: 0,
            position: 3,
            net: 'WIFI',
            device: 'Xiaomi MI8Lite',
            lat: ''
        }
        let codeSignNew = utils.MD5_Encrypt(JSON.stringify(body) + this.nonce + this.key + this.ts)
        let codeSignNow = codeSignNew.toUpperCase()
        try {
            let options = {
                method: 'POST',
                url: this.hostname + '/v5_0/forum/reply-thread ',
                headers: {
                    codeSign: codeSignNow,
                    channel: 'xiaomi',
                    nonce: this.nonce,
                    'User-Agent': 'QianFan;dayukaizhou;Android;MI8LiteXiaomi29;',
                    timestamp: this.ts,
                    date: this.date,
                    version: '5.1.19',
                    'product-version': '541',
                    platform: 'Xiaomi MI8Lite',
                    network: '1',
                    device: this.device,
                    'screen-height': '2154',
                    system: '2',
                    'system-version': '29',
                    'third-app-token': this.ck1,
                    'inner-version': '6.3.1.0',
                    'screen-width': '1080',
                    Authorization: "Bearer " + this.ck2,
                    'Content-Type': 'application/json; charset=UTF-8',
                    Host: 'api.jrkz66.com',
                    Connection: 'Keep-Alive'
                },
                body: body,
                json: true
            };
            //console.log(options);
            let result = await httpRequest(options, "执行评论");
            //console.log(result);
            if (result.ret == 0) {
                DoubleLog(`账号[${this.index}]  评论文章成功`);
                let resultdata = result.data.task_reply_info;
                if (resultdata.envelope !== undefined) {
                    if (resultdata.envelope !== null) {
                        console.log('----------------- 达到任务数量,开始领取奖励 -----------------')
                        let envelop_id = result.data.task_reply_info.envelope.packetId;
                        let user_envelope_id = result.data.task_reply_info.envelope.user_envelope_id;
                        let source = result.data.task_reply_info.envelope.source;
                        await this.task_reply_cash(user_envelope_id, envelop_id, source);
                    }
                }
            } else {
                DoubleLog(`账号[${this.index}]  查询:失败 ❌ 了呢,原因未知！`);
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async task_reply_cash(data1, data2, data3) { // 领取评论红包
        let body = {
            scheme: '',
            user_envelope_id: data1,
            envelop_id: data2,
            from_list: 0,
            source: data3
        }
        let codeSignNew = utils.MD5_Encrypt(JSON.stringify(body) + this.nonce + this.key + this.ts)
        let codeSignNow = codeSignNew.toUpperCase()
        try {
            let options = {
                method: 'POST',
                url: this.hostname + '/v5_0/evnelope/consume-v2',
                headers: {
                    codeSign: codeSignNow,
                    channel: 'xiaomi',
                    nonce: this.nonce,
                    'User-Agent': 'QianFan;dayukaizhou;Android;MI8LiteXiaomi29;',
                    timestamp: this.ts,
                    date: this.date,
                    version: '5.1.19',
                    'product-version': '541',
                    platform: 'Xiaomi MI8Lite',
                    network: '1',
                    device: this.device,
                    'screen-height': '2154',
                    system: '2',
                    'system-version': '29',
                    'third-app-token': this.ck1,
                    'inner-version': '6.3.1.0',
                    'screen-width': '1080',
                    Authorization: "Bearer " + this.ck2,
                    'Content-Type': 'application/json; charset=UTF-8',
                    Host: 'api.jrkz66.com',
                    Connection: 'Keep-Alive'
                },
                body: body,
                json: true
            };
            //console.log(options);
            let result = await httpRequest(options, "领取评论红包");
            //console.log(result);
            if (result.ret == 0) {
                DoubleLog(`账号[${this.index}]  领取红包成功 获得${result.data.award_str}`);

            } else {
                DoubleLog(`账号[${this.index}]  领取红包:失败 ❌ 了呢,原因未知！`);
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async task_share_do(user_id) { // 执行分享  失效 只有重庆IP才有效 目前未找到解决方法
        let form = {
            id: '0',
            share_type: '2',
            type: '3',
            url: 'https://share.dykz66.com/wap/thread/view-thread/tid/120607/share_user_id/' + user_id//user_id本人ID 124
        }
        let codeSignNew = utils.MD5_Encrypt(JSON.stringify(form) + this.nonce + this.key + this.ts)
        let codeSignNow = codeSignNew.toUpperCase()
        try {
            let options = {
                method: 'POST',
                url: this.hostname + '/v5_0/site/share-sum',
                headers: {
                    codeSign: codeSignNow,
                    channel: 'xiaomi',
                    nonce: this.nonce,
                    'User-Agent': 'QianFan;dayukaizhou;Android;MI8LiteXiaomi29;',
                    timestamp: this.ts,
                    date: this.date,
                    version: '5.1.19',
                    'product-version': '541',
                    platform: 'Xiaomi MI8Lite',
                    network: '1',
                    device: this.device,
                    'screen-height': '2154',
                    system: '2',
                    'system-version': '29',
                    'third-app-token': this.ck1,
                    'inner-version': '6.3.1.0',
                    'screen-width': '1080',
                    'user-id': '122466',
                    Authorization: "Bearer " + this.ck2,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    Host: 'api.jrkz66.com',
                    Connection: 'Keep-Alive'
                },
                form: form
            };
            //console.log(options);
            let result = await httpRequest(options, name);
            //console.log(result);
            if (result.ret == 0) {
                DoubleLog(`账号[${this.index}]  执行分享成功`);
            } else {
                DoubleLog(`账号[${this.index}]  执行分享:失败 ❌ 了呢,原因未知！`);
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async task_share_do(user_id) { // 执行分享2 (进去绑定分享和本人) // 执行分享  失效 只有重庆IP才有效 目前未找到解决方法
        let form = {
            id: '0',
            share_type: '2',
            type: '3',
            url: 'https://share.dykz66.com/wap/thread/view-thread/tid/120607/share_user_id/' + user_id//user_id本人ID 124
        }
        let codeSignNew = utils.MD5_Encrypt(JSON.stringify(form) + this.nonce + this.key + this.ts)
        let codeSignNow = codeSignNew.toUpperCase()
        try {
            let options = {
                method: 'POST',
                url: this.hostname + '/v5_0/site/share-sum',
                headers: {
                    codeSign: codeSignNow,
                    channel: 'xiaomi',
                    nonce: this.nonce,
                    'User-Agent': 'QianFan;dayukaizhou;Android;MI8LiteXiaomi29;',
                    timestamp: this.ts,
                    date: this.date,
                    version: '5.1.19',
                    'product-version': '541',
                    platform: 'Xiaomi MI8Lite',
                    network: '1',
                    device: this.device,
                    'screen-height': '2154',
                    system: '2',
                    'system-version': '29',
                    'third-app-token': this.ck1,
                    'inner-version': '6.3.1.0',
                    'screen-width': '1080',
                    'user-id': '122466',
                    Authorization: "Bearer " + this.ck2,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    Host: 'api.jrkz66.com',
                    Connection: 'Keep-Alive'
                },
                form: form
            };
            //console.log(options);
            let result = await httpRequest(options, name);
            //console.log(result);
            if (result.ret == 0) {
                DoubleLog(`账号[${this.index}]  执行分享成功`);
            } else {
                DoubleLog(`账号[${this.index}]  执行分享:失败 ❌ 了呢,原因未知！`);
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }
    async share_code_info() {
        try {
            let options = {
                method: 'POST',
                url: 'https://share.dykz66.com/store/invite/invite-info',
                headers: {
                    Host: 'share.dykz66.com',
                    Connection: 'keep-alive',
                    Accept: 'application/json, text/plain, */*',
                    Authorization: 'Bearer ' + this.ck2,
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36; QianFan;dayukaizhou;Android;MI8LiteXiaomi29;',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Origin: 'https://share.dykz66.com',
                    'X-Requested-With': 'com.dayukaizhou.forum',
                    'Sec-Fetch-Site': 'same-origin',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Dest': 'empty',
                    Referer: 'https://share.dykz66.com/store-view/invite/index',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7'
                }
            };

            //console.log(options);
            let result = await httpRequest(options, "");
            //console.log(result);
            if (result.ret == 0) {
                DoubleLog(`账号[${this.index}]  `)
                if (result.data.user.has_invite == false) {
                    await this.share_code()
                }
            } else {
            }
        } catch (error) {
            console.log(error);
        }
    }

    async share_code() {
        try {
            let options = {
                method: 'POST',
                url: 'https://share.dykz66.com/store/invite/verify',
                headers: {
                    Host: 'share.dykz66.com',
                    Connection: 'keep-alive',
                    Accept: 'application/json, text/plain, */*',
                    Authorization: 'Bearer ' + this.ck2,
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; MI 8 Lite Build/QKQ1.190910.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36; QianFan;dayukaizhou;Android;MI8LiteXiaomi29;',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Origin: 'https://share.dykz66.com',
                    'X-Requested-With': 'com.dayukaizhou.forum',
                    'Sec-Fetch-Site': 'same-origin',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Dest': 'empty',
                    Referer: 'https://share.dykz66.com/store-view/invite/index',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7'
                },
                form: { data: '{"code":334360}' }
            };

            //console.log(options);
            let result = await httpRequest(options, "");
            //console.log(result);
            if (result.ret == 0) {
                DoubleLog(`账号[${this.index}] `)
            } else {
            }
        } catch (error) {
            console.log(error);
        }
    }

}

!(async () => {
    if (!(await checkEnv())) return;
    if (userList.length > 0) {
        await start();
    }
    await SendMsg(msg);
})()
    .catch((e) => console.log(e))
    .finally(() => $.done());


// #region ********************************************************  固定代码  ********************************************************

// 变量检查与处理
async function checkEnv() {
    if (userCookie) {
        // console.log(userCookie);
        let e = envSplitor[0];
        for (let o of envSplitor)
            if (userCookie.indexOf(o) > -1) {
                e = o;
                break;
            }
        for (let n of userCookie.split(e)) n && userList.push(new UserInfo(n));
        userCount = userList.length;
    } else {
        console.log("未找到CK");
        return;
    }
    return console.log(`共找到${userCount}个账号`), true;//true == !0
}
// =========================================== 不懂不要动 =========================================================
// 网络请求 (get, post等)
async function httpRequest(options, name) { return new Promise((resolve) => { var request = require("request"); if (!name) { let tmp = arguments.callee.toString(); let re = /function\s*(\w*)/i; let matches = re.exec(tmp); name = matches[1] } if (debug) { console.log(`\n【debug】===============这是${name}请求信息===============`); console.log(options) } request(options, function (error, response) { if (error) throw new Error(error); let data = response.body; try { if (debug) { console.log(`\n\n【debug】===============这是${name}返回数据==============`); console.log(data) } if (typeof data == "string") { if (isJsonString(data)) { let result = JSON.parse(data); if (debug) { console.log(`\n【debug】=============这是${name}json解析后数据============`); console.log(result) } resolve(result) } else { let result = data; resolve(result) } function isJsonString(str) { if (typeof str == "string") { try { if (typeof JSON.parse(str) == "object") { return true } } catch (e) { return false } } return false } } else { let result = data; resolve(result) } } catch (e) { console.log(error, response); console.log(`\n ${name}失败了!请稍后尝试!!`) } finally { resolve() } }) }) }
// 等待 X 秒
function wait(n) { return new Promise(function (resolve) { setTimeout(resolve, n * 1000) }) }
// 双平台log输出
function DoubleLog(data) { if ($.isNode()) { if (data) { console.log(`${data}`); msg += `${data}` } } else { console.log(`${data}`); msg += `${data}` } }
// 发送消息
async function SendMsg(message) { if (!message) return; if (Notify > 0) { if ($.isNode()) { var notify = require("./sendNotify"); await notify.sendNotify($.name, message) } else { $.msg($.name, '', message) } } else { console.log(message) } }
// 完整 Env
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
