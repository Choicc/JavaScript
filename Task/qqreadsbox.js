
/* ziye

本人github地址     https://github.com/ziye12/JavaScript
转载请备注个名字，谢谢

11.25 增加 阅读时长上传，阅读金币，阅读随机金币
11.25 修复翻倍宝箱不同时领取的问题.增加阅读金币判定
11.25 修复阅读时长问题，阅读金币问题，请重新获取时长cookie
11.26 随机金币只有一次，故去除，调整修复阅读金币问题，增加时长上传限制
11.26 增加领取周时长奖励
11.26 增加结束命令
11.27 调整通知为，成功开启宝箱再通知
11.28 修复错误
11.29 更新 支持action.默认每天21点到21点20通知
12.2 修复打卡问题
12.3 缩短运行时间，由于企鹅读书版本更新.请手动进去看一次书
12.3 调整推送时间为12点和24点左右
12.6 精简打印通知
12.7 解决1金币问题，务必重新获取一次更新body

⚠️cookie获取方法：

进 https://m.q.qq.com/a/s/d3eacc70120b9a37e46bad408c0c4c2a  

进书库选择一本书,看10秒以下,然后退出，获取时长url和时长header以及更新body，看书一定不能超过10秒



Secrets对应关系如下，多账号默认换行

qqreadbodyVal         👉   QQREAD_BODY
qqreadtimeurlVal      👉   QQREAD_TIMEURL
qqreadtimeheaderVal   👉   QQREAD_TIMEHD



⚠️宝箱奖励为20分钟一次，自己根据情况设置定时，建议设置11分钟一次

hostname=mqqapi.reader.qq.com

############## 圈x

#企鹅读书获取更新body
https:\/\/mqqapi\.reader\.qq\.com\/log\/v4\/mqq\/track url script-request-body https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js

#企鹅读书获取时长cookie
https:\/\/mqqapi\.reader\.qq\.com\/mqq\/addReadTimeWithBid? url script-request-header https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js

############## loon

//企鹅读书获取更新body
http-request https:\/\/mqqapi\.reader\.qq\.com\/log\/v4\/mqq\/track script-path=https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js,requires-body=true, tag=企鹅读书获取更新body

//企鹅读书获取时长cookie
http-request https:\/\/mqqapi\.reader\.qq\.com\/mqq\/addReadTimeWithBid? script-path=https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js, requires-header=true, tag=企鹅读书获取时长cookie

############## surge

//企鹅读书获取更新body
企鹅读书获取更新body = type=http-request,pattern=https:\/\/mqqapi\.reader\.qq\.com\/log\/v4\/mqq\/track,script-path=https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js, 

//企鹅读书获取时长cookie
企鹅读书获取时长cookie = type=http-request,pattern=https:\/\/mqqapi\.reader\.qq\.com\/mqq\/addReadTimeWithBid?,script-path=https://raw.githubusercontent.com/ziye12/JavaScript/master/Task/qqreads.js, 


*/
const { resolve } = require('path');
const jsname = "企鹅读书";
const $ = Env(jsname);
const notify = $.isNode() ? require("./sendNotify") : "";

let tz = "";
let kz = "";
let task = "";
let config = "";

let COOKIES_SPLIT = "\n"; // 自定义多cookie之间连接的分隔符，默认为\n换行分割，不熟悉的不要改动和配置，为了兼容本地node执行

const logs = 0; // 0为关闭日志，1为开启
const notifyInterval = 0;
// 0为关闭通知，1为所有通知，2为宝箱领取成功通知，3为宝箱每15次通知一次

const dd = 1; // 单次任务延迟,默认1秒
const TIME = 30; // 单次时长上传限制，默认5分钟
const maxtime = 12; // 每日上传时长限制，默认12小时
const wktimess = 1200; // 周奖励领取标准，默认1200分钟

const qqreadbdArr = [];
let qqreadbodyVal = "";
const qqreadtimeurlArr = [];
let qqreadtimeurlVal = "";
const qqreadtimehdArr = [];
let qqreadtimeheaderVal = "";
let qqreadBD = [];
let qqreadtimeURL = [];
let qqreadtimeHD = [];
process.env.COOKIES_SPLIT = "!"
process.env.QQREAD_BODY = `{"common":{"appid":1450024393,"areaid":5,"qq_ver":"8.4.8","os_ver":"Android 10","mp_ver":"0.31.0","mpos_ver":"1.19.0","brand":"Xiaomi","model":"MI 8 SE","screenWidth":393,"screenHeight":816,"windowWidth":393,"windowHeight":762,"openid":"255DB9F053BDBBF9BF566158586EA4FB","guid":1063814387,"session":"ay6z9zej8fza6l7rk7ezzcpvrkegoprk","scene":3001,"source":-1,"hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"bookStore_newCI_unit_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"26346851","cid":"1"},"dis":1607411742779,"ext6":37,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"26346851","bookStatus":1,"bookPay":0,"chapterStatus":0,"ext1":{"font":18,"bg":3,"pageMode":1},"from":"3001_26346851"}]}!{"common":{"appid":1450024393,"areaid":5,"qq_ver":"8.4.8","os_ver":"Android 10","mp_ver":"0.31.0","mpos_ver":"1.19.0","brand":"Xiaomi","model":"MI 8 SE","screenWidth":393,"screenHeight":816,"windowWidth":393,"windowHeight":762,"openid":"255DB9F053BDBBF9BF566158586EA4FB","guid":906319480,"session":"ay6z9zej8fza6l7rk7ezzcpvrkegoprk","scene":3001,"source":-1,"hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"bookStore_newCI_unit_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"26346851","cid":"1"},"dis":1607411742779,"ext6":37,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"26346851","bookStatus":1,"bookPay":0,"chapterStatus":0,"ext1":{"font":18,"bg":3,"pageMode":1},"from":"3001_26346851"}]}!{"common":{"appid":1450024393,"areaid":5,"qq_ver":"8.4.8","os_ver":"Android 10","mp_ver":"0.31.0","mpos_ver":"1.19.0","brand":"Xiaomi","model":"MI 8 SE","screenWidth":393,"screenHeight":816,"windowWidth":393,"windowHeight":762,"openid":"255DB9F053BDBBF9BF566158586EA4FB","guid":1024182633,"session":"ay6z9zej8fza6l7rk7ezzcpvrkegoprk","scene":3001,"source":-1,"hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"bookStore_newCI_unit_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"26346851","cid":"1"},"dis":1607411742779,"ext6":37,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"26346851","bookStatus":1,"bookPay":0,"chapterStatus":0,"ext1":{"font":18,"bg":3,"pageMode":1},"from":"3001_26346851"}]}!{"common":{"appid":1450024393,"areaid":5,"qq_ver":"8.4.8","os_ver":"Android 10","mp_ver":"0.32.5","mpos_ver":"1.19.0","brand":"Xiaomi","model":"MI 8 SE","screenWidth":393,"screenHeight":816,"windowWidth":393,"windowHeight":816,"openid":"E9C74E8358BDB583151807B900256C7E","guid":172387927,"session":"xh7krxcmplmfm0a9mg049fisy6ckx1ff","scene":1007,"source":"wza0002wzb0002","hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"bookLib2_bookList_bookClick_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"31808365","cid":"1"},"dis":1607482212772,"ext6":96,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"31808365","bookStatus":0,"bookPay":1,"chapterStatus":0,"ext1":{"font":18,"bg":0,"pageMode":1},"from":"bookLib2_bookList_bookClick_C_0_31808365"}]}!{"common":{"appid":1450024393,"areaid":5,"qq_ver":"8.4.8","os_ver":"Android 10","mp_ver":"0.32.5","mpos_ver":"1.19.0","brand":"Xiaomi","model":"MI 8 SE","screenWidth":393,"screenHeight":816,"windowWidth":393,"windowHeight":816,"openid":"86D203F10F388FF4BAA41C39AC3CD81F","guid":714420209,"session":"mddbiukjv17x3w322u4f935v25v1r7rk","scene":1007,"source":"wza0001wzb0002","hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"bookLib2_bookList_bookClick_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"31808365","cid":"1"},"dis":1607482604351,"ext6":67,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"31808365","bookStatus":0,"bookPay":1,"chapterStatus":0,"ext1":{"font":18,"bg":0,"pageMode":1},"from":"bookLib2_bookList_bookClick_C_0_31808365"}]}!{"common":{"appid":1450024393,"areaid":5,"qq_ver":"8.4.8","os_ver":"Android 10","mp_ver":"0.32.5","mpos_ver":"1.19.0","brand":"Xiaomi","model":"MI 8 SE","screenWidth":393,"screenHeight":816,"windowWidth":393,"windowHeight":816,"openid":"C75D054CCC9EEB20C27CEEECC0F37C18","guid":2433500459,"session":"1czqj7bsr3wkyu8q7n58mqbpzpydg41f","scene":1007,"source":"wza0001wzb0004","hasRedDot":"false","missions":-1,"caseID":-1},"dataList":[{"click1":"bookDetail_bottomBar_read_C","click2":"bookLib2_bookList_bookClick_C","route":"pages/book-read/index","refer":"pages/book-detail/index","options":{"bid":"31808365","cid":"1"},"dis":1607482894100,"ext6":57,"eventID":"bookRead_show_I","type":"shown","ccid":1,"bid":"31808365","bookStatus":0,"bookPay":1,"chapterStatus":0,"ext1":{"font":18,"bg":0,"pageMode":1},"from":"bookLib2_bookList_bookClick_C_0_31808365"}]}`
process.env.QQREAD_TIMEURL = `https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=3001&refer=pages%2Findex%2Findex&bid=26346851&readTime=2504&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A2504%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1!https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=3001&refer=-1&bid=933335&readTime=2050&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%222%22%3A%7B%22readTime%22%3A2050%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1!https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=3026&refer=-1&bid=29709406&readTime=3172&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A3172%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1!https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1007&refer=pages%2Fbook-category%2Findex&bid=31808365&readTime=2624&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A2624%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1!https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1007&refer=pages%2Fbook-category%2Findex&bid=31808365&readTime=2445&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A2445%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1!https://mqqapi.reader.qq.com/mqq/addReadTimeWithBid?scene=1007&refer=pages%2Fbook-category%2Findex&bid=31808365&readTime=3020&read_type=0&conttype=1&read_status=0&chapter_info=%5B%7B%221%22%3A%7B%22readTime%22%3A3020%2C%22pay_status%22%3A0%7D%7D%5D&sp=-1`
process.env.QQREAD_TIMEHD = `{"Cookie":"ywguid=1063814387;ywkey=ywBmYaZSTr6Y;platform=android;channel=mqqmina;mpVersion=0.31.0;qq_ver=8.4.8;os_ver=Android 10;mpos_ver=1.19.0","mpVersion":"0.31.0","YwSession":"ay6z9zej8fza6l7rk7ezzcpvrkegoprk","Referer":"https://appservice.qq.com/1110657249/0.31.0/page-frame.html","User-Agent":"Mozilla/5.0 (Linux; Android 10; MI 8 SE Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/85.0.4183.127 Mobile Safari/537.36 QQ/MiniApp QQ/8.4.8","content-type":"application/json;charset=UTF-8","Content-Length":"805","Host":"mqqapi.reader.qq.com","Connection":"Keep-Alive","Accept-Encoding":"gzip"}!{"Cookie":"ywguid=906319480;ywkey=ywShOcEHMgXV;platform=android;channel=mqqmina;mpVersion=0.31.0;qq_ver=8.4.8;os_ver=Android 10;mpos_ver=1.19.0;platform=android;openid=6E7DC856C15AE5A683EE5E4588E01613","mpVersion":"0.31.0","YwSession":"omb3c5wwqdhml2dok6u0yyt4qc8nj236","Referer":"https://appservice.qq.com/1110657249/0.31.0/page-frame.html","User-Agent":"Mozilla/5.0 (Linux; Android 10; MI 8 SE Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/85.0.4183.127 Mobile Safari/537.36 QQ/MiniApp QQ/8.4.8","content-type":"application/json","Host":"mqqapi.reader.qq.com","Connection":"Keep-Alive","Accept-Encoding":"gzip"}!{"Cookie":"ywguid=1024182633;ywkey=yw54IkJ6PGog;platform=android;channel=mqqmina;mpVersion=0.31.0;qq_ver=8.4.8;os_ver=Android 10;mpos_ver=1.19.0;platform=android;openid=DB0B406CCBE1941F85DE5D92E7CAE2A2","mpVersion":" 0.31.0","YwSession":"jw2570jn3ovpermgbuc1trshd207xcqf","Referer":"https://appservice.qq.com/1110657249/0.31.0/page-frame.html","User-Agent":"Mozilla/5.0 (Linux; Android 10; MI 8 SE Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/85.0.4183.127 Mobile Safari/537.36 QQ/MiniApp QQ/8.4.8","content-type":" application/json","Host":"mqqapi.reader.qq.com","Connection":"Keep-Alive","Accept-Encoding":"gzip"}!{"Cookie":"ywguid=172387927;ywkey=ywzN3snOXnxf;platform=android;channel=mqqmina;mpVersion=0.32.5;qq_ver=8.4.8;os_ver=Android 10;mpos_ver=1.19.0;platform=android;openid=E9C74E8358BDB583151807B900256C7E","mpVersion":"0.32.5","YwSession":"xh7krxcmplmfm0a9mg049fisy6ckx1ff","Referer":"https://appservice.qq.com/1110657249/0.32.5/page-frame.html","User-Agent":"Mozilla/5.0 (Linux; Android 10; MI 8 SE Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/85.0.4183.127 Mobile Safari/537.36 QQ/MiniApp QQ/8.4.8","content-type":"application/json","Host":"mqqapi.reader.qq.com","Connection":"Keep-Alive","Accept-Encoding":"gzip"}!{"Cookie":"ywguid=714420209;ywkey=ywfxYcJko4z2;platform=android;channel=mqqmina;mpVersion=0.32.5;qq_ver=8.4.8;os_ver=Android 10;mpos_ver=1.19.0;platform=android;openid=86D203F10F388FF4BAA41C39AC3CD81F","mpVersion":"0.32.5","YwSession":"mddbiukjv17x3w322u4f935v25v1r7rk","Referer":"https://appservice.qq.com/1110657249/0.32.5/page-frame.html","User-Agent":"Mozilla/5.0 (Linux; Android 10; MI 8 SE Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/85.0.4183.127 Mobile Safari/537.36 QQ/MiniApp QQ/8.4.8","content-type":"application/json","Host":"mqqapi.reader.qq.com","Connection":"Keep-Alive","Accept-Encoding":"gzip"}!{"Cookie":"ywguid=2433500459;ywkey=ywq1u6Oog73w;platform=android;channel=mqqmina;mpVersion=0.32.5;qq_ver=8.4.8;os_ver=Android 10;mpos_ver=1.19.0;platform=android;openid=C75D054CCC9EEB20C27CEEECC0F37C18","mpVersion":"0.32.5","YwSession":"1czqj7bsr3wkyu8q7n58mqbpzpydg41f","Referer":"https://appservice.qq.com/1110657249/0.32.5/page-frame.html","User-Agent":"Mozilla/5.0 (Linux; Android 10; MI 8 SE Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/85.0.4183.127 Mobile Safari/537.36 QQ/MiniApp QQ/8.4.8","content-type":"pplication/json","Host":"mqqapi.reader.qq.com","Connection":"Keep-Alive","Accept-Encoding":"gzip"}`
// console.log(process.env.QQREAD_BODY)
if ($.isNode()) {
  if (process.env.COOKIES_SPLIT) {
    COOKIES_SPLIT = process.env.COOKIES_SPLIT;
  }
  console.log(
    `============ cookies分隔符为：${JSON.stringify(
      COOKIES_SPLIT
    )} =============\n`
  );
  if (
    process.env.QQREAD_BODY &&
    process.env.QQREAD_BODY.indexOf(COOKIES_SPLIT) > -1
  ) {
    qqreadBD = process.env.QQREAD_BODY.split(COOKIES_SPLIT);
  } else {
    qqreadBD = process.env.QQREAD_BODY.split();
  }

  if (
    process.env.QQREAD_TIMEURL &&
    process.env.QQREAD_TIMEURL.indexOf(COOKIES_SPLIT) > -1
  ) {
    qqreadtimeURL = process.env.QQREAD_TIMEURL.split(COOKIES_SPLIT);
  } else {
    qqreadtimeURL = process.env.QQREAD_TIMEURL.split();
  }

  if (
    process.env.QQREAD_TIMEHD &&
    process.env.QQREAD_TIMEHD.indexOf(COOKIES_SPLIT) > -1
  ) {
    qqreadtimeHD = process.env.QQREAD_TIMEHD.split(COOKIES_SPLIT);
  } else {
    qqreadtimeHD = process.env.QQREAD_TIMEHD.split();
  }
}

if ($.isNode()) {
  Object.keys(qqreadBD).forEach((item) => {
    if (qqreadBD[item]) {
      qqreadbdArr.push(qqreadBD[item]);
    }
  });
  Object.keys(qqreadtimeURL).forEach((item) => {
    if (qqreadtimeURL[item]) {
      qqreadtimeurlArr.push(qqreadtimeURL[item]);
    }
  });
  Object.keys(qqreadtimeHD).forEach((item) => {
    if (qqreadtimeHD[item]) {
      qqreadtimehdArr.push(qqreadtimeHD[item]);
    }
  });

  console.log(
    `============ 共${qqreadtimehdArr.length}个企鹅读书账号  =============\n`
  );
  // console.log(
  //   `============ 脚本执行-北京时间(UTC+8)：${new Date(
  //     new Date().getTime() + 8 * 60 * 60 * 1000
  //   ).toLocaleString()}  =============\n`
  // );
} else {
  qqreadbdArr.push($.getdata("qqreadbd"));
  qqreadtimeurlArr.push($.getdata("qqreadtimeurl"));
  qqreadtimehdArr.push($.getdata("qqreadtimehd"));
}

if ((isGetCookie = typeof $request !== "undefined")) {
  GetCookie();
  $.done();
}

function GetCookie() {

  if ($request && $request.url.indexOf("addReadTimeWithBid?") >= 0) {
    const qqreadtimeurlVal = $request.url;
    if (qqreadtimeurlVal) $.setdata(qqreadtimeurlVal, "qqreadtimeurl");
    $.log(
      `[${jsname}] 获取时长url: 成功,qqreadtimeurlVal: ${qqreadtimeurlVal}`
    );
    $.msg(jsname, `获取时长url: 成功🎉`, ``);
    const qqreadtimeheaderVal = JSON.stringify($request.headers);
    if (qqreadtimeheaderVal) $.setdata(qqreadtimeheaderVal, "qqreadtimehd");
    $.log(
      `[${jsname}] 获取时长header: 成功,qqreadtimeheaderVal: ${qqreadtimeheaderVal}`
    );
    $.msg(jsname, `获取时长header: 成功🎉`, ``);
  }
  else if ($request && $request.body.indexOf("bookDetail_bottomBar_read_C") >= 0 && $request.body.indexOf("bookRead_show_I") >= 0 && $request.body.indexOf("topBar_left_back_C") < 0 && $request.body.indexOf("bookRead_dropOut_shelfYes_C") < 0) {
    const qqreadbodyVal = $request.body;
    if (qqreadbodyVal) $.setdata(qqreadbodyVal, "qqreadbd");
    $.log(
      `[${jsname}] 获取更新body: 成功,qqreadbodyVal: ${qqreadbodyVal}`
    );
    $.msg(jsname, `获取更新body: 成功🎉`, ``);

  }

}



let K = 0;
all();
function all() {
  qqreadbodyVal = qqreadbdArr[K];
  qqreadtimeurlVal = qqreadtimeurlArr[K];
  qqreadtimeheaderVal = qqreadtimehdArr[K];
  (() => {
    qqreadtask(K).then(() => {
      if (task.data && task.data.treasureBox.doneFlag == 0) {
        return qqreadbox(K)
      }
      return
    }).
      then(() => {
        if (task.data &&
          task.data.treasureBox.videoDoneFlag == 0) {
          return qqreadbox2(K)
        }
        return
      }
      ).then(() => {
        if (K < qqreadbdArr.length - 1) {
          K += 1;
          all();
        }
      }).catch(err => {
        console.log(err)
      });
  })();
}

// 任务列表
function qqreadtask(k) {
  return new Promise((resolve, reject) => {
    const toqqreadtaskurl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/page?fromGuid=",
      headers: JSON.parse(qqreadtimeheaderVal),

      timeout: 60000,
    };
    $.get(toqqreadtaskurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 任务列表: ${data}`);
      task = JSON.parse(data);
      kz +=
        `【现金余额】:${(task.data.user.amount / 10000).toFixed(2)}元\n` +
        `【已开宝箱】:${task.data.treasureBox.count}个\n`;

      tz +=
        `【现金余额】:${(task.data.user.amount / 10000).toFixed(2)}元\n` +
        `【第${task.data.invite.issue}期】:时间${task.data.invite.dayRange}\n` +
        ` 已邀请${task.data.invite.inviteCount}人，再邀请${task.data.invite.nextInviteConfig.count}人获得${task.data.invite.nextInviteConfig.amount}金币\n` +
        `【${task.data.taskList[0].title}】:${task.data.taskList[0].amount}金币,${task.data.taskList[0].actionText}\n` +
        `【${task.data.taskList[1].title}】:${task.data.taskList[1].amount}金币,${task.data.taskList[1].actionText}\n` +
        `【${task.data.taskList[2].title}】:${task.data.taskList[2].amount}金币,${task.data.taskList[2].actionText}\n` +
        `【${task.data.taskList[3].title}】:${task.data.taskList[3].amount}金币,${task.data.taskList[3].actionText}\n` +
        `【宝箱任务${task.data.treasureBox.count + 1}】:${task.data.treasureBox.tipText
        }\n` +
        `【${task.data.fans.title}】:${task.data.fans.fansCount}个好友,${task.data.fans.todayAmount}金币\n`;
      console.log(`【${k + 1}宝箱任务${task.data.treasureBox.count + 1}】:${task.data.treasureBox.tipText
        }\n`)
      resolve();
    });
  });
}

// 宝箱奖励
function qqreadbox(k) {
  return new Promise((resolve, reject) => {
    const toqqreadboxurl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/treasure_box",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    // console.log(`${k+1}【宝箱奖励】\n`)
    $.get(toqqreadboxurl, (error, response, data) => {
      if (logs) $.log(`${jsname}, 宝箱奖励: ${data}`);
      box = JSON.parse(data);
      if (box.data.count >= 0) {
        tz += `【宝箱奖励${box.data.count}】:获得${box.data.amount}金币\n`;
        console.log(`${k + 1}【宝箱奖励${box.data.count}】:获得${box.data.amount}金币\n`)
      }

      resolve();
    });
  });
}

// 宝箱奖励翻倍
function qqreadbox2(k) {
  return new Promise((resolve, reject) => {
    const toqqreadbox2url = {
      url:
        "https://mqqapi.reader.qq.com/mqq/red_packet/user/treasure_box_video",

      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    // console.log(`${k+1}【宝箱翻倍】\n`)
    $.get(toqqreadbox2url, (error, response, data) => {
      if (logs) $.log(`${jsname}, 宝箱奖励翻倍: ${data}`);
      box2 = JSON.parse(data);
      if (box2.code == 0) {
        tz += `【宝箱翻倍】:获得${box2.data.amount}金币\n`;
        console.log(`${k + 1}【宝箱翻倍】:获得${box2.data.amount}金币\n`)
      }
      resolve();
    });
  });
}



// prettier-ignore
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), a = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(a, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t) { let e = { "M+": (new Date).getMonth() + 1, "d+": (new Date).getDate(), "H+": (new Date).getHours(), "m+": (new Date).getMinutes(), "s+": (new Date).getSeconds(), "q+": Math.floor(((new Date).getMonth() + 3) / 3), S: (new Date).getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length))); for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))); let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="]; h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h) } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }