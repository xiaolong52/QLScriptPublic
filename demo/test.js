
//----------------------------获取版本
/**
 * 获取远程版本
 * https://raw.githubusercontent.com/zhaoshicong/QLScriptPublic/main/demo/${name}.js   注意demo为演示
 */
function Version_Check(name) {
	return new Promise((resolve) => {
		let url = {
			url: githubproxy + `https://raw.githubusercontent.com/zhaoshicong/QLScriptPublic/main/demo/${name}.js`,
		}
		$.get(url, async (err, resp, data) => {
			try {
				VersionCheck = resp.body.match(/VersionCheck = "([\d\.]+)"/)[1]
			} catch (e) {
				$.logErr(e, resp);
			} finally {
				resolve(VersionCheck)
			}
		}, timeout = 3)
	})
}
 


let VersionCheck = "0.0.2"
let githubproxy = "https://gh.api.99988866.xyz/"

//----------------------------------获取公告

  async function ScriptNotice() {      
	 try {
		 let url = {
			 url: githubproxy + `https://raw.githubusercontent.com/zhaoshicong/QLScriptPublic/main/notice.json`,     
		 };
		 let result = await httpGet(url, `输出`);
		 //console.log(result);      
		 if (result?.status == "true") {
			 DoubleLog(`公告:${result.Notice} 🎉`);        
			 await wait(2);
		 } else {
			 DoubleLog(`获取公告: 失败 ❌ 了呢,原因未知!`);         
			 //console.log(result);                
		 }
	 } catch (error) {
		 console.log(error);
	 }
 
 }


 console.log("获取公告");
 await ScriptNotice();
 await $.wait(1 * 1000);

//------------------------------------------------------------检测变量是否为双变量 即xxx&yyy@xxx1&yyy1
if (ckStr.indexOf("&") !== -1) {
log("含有")
} else {
log("不含有")
}
