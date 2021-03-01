/**
 * 倒计时
 * */
const countdown = (time, begin, perSecond, end) => {
    begin && begin(time);
    const timer = setInterval(() => {
        time--;
        perSecond && perSecond(time);
        if (time <= 0){
            end && end(time);
            clearInterval(timer);
        }
    }, 1000);
};
/**
 * 生成链接url，params
 * */
const createUrl = function (serviceURL, obj) {
    var url = serviceURL + "?";
    for (var key in obj) {
        url += key + '=' + obj[key] + '&';
    }
    return url.substring(0, url.lastIndexOf('&'));
};
/**
 * 定义一个正则
 * */
const regex = {
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    phoneNumber: /^((\(\d{3}\))|(\d{3}\\-))?1[23456789][0-9]\d{8}|15[89]\d{8}/,
    https: /^https/,
};

/**
 * 生成32位随机码
 * */
const randomCode = () => {
    var timestamp = new Date().getTime().toString();
    var arr = 'abcdefghijklmnopqrstuvwsyz0123456789'.split('');
    var nonce = '',
        len = 32 - timestamp.length;
    for (var i = 0; i < timestamp.length; i++) {
        nonce += arr[timestamp[i]];
    }
    for (var j = 0; j < len; j++) {
        var num = Math.round(Math.random() * 35);
        nonce += arr[num];
    }
    return nonce;
};

/**
 * 获取浏览器内核
 * */
const browserVersion = () => {
    const u = window.navigator.userAgent;
    const version = {
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者安卓QQ浏览器
        iPad: u.indexOf('iPad') > -1, //是否为iPad
        webApp: u.indexOf('Safari') == -1,//是否为web应用程序，没有头部与底部
        weixin: u.indexOf('MicroMessenger') == -1 //是否为微信浏览器
    };
    return version
};
/**
 * 获取浏览器终端
 * */
const mobilePhoneSystem = () => {
    const browser = browserVersion();
    let appType = '';
    //  1. 是否为移动终端
    if (browser.mobile) {
        if (browser.ios || browser.iPhone || browser.iPad) {
            //  3. 是否为ios移动终端
            appType = "ios";
        } else if (browser.android) {
            //  4. 是否为android移动终端
            appType = "android";
        } else {
            appType = "web";
        }
    } else {
        // 2. 是否为web 端
        appType = "web";
    }
    return appType;
};


export {
    countdown,
    regex,
    createUrl,
    randomCode,
    browserVersion,
    mobilePhoneSystem
}