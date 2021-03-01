/**
 *  获取浏览器内核
 **/
var browser={
    versions:function(){
        var u = window.navigator.userAgent;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者安卓QQ浏览器
            iPad: u.indexOf('iPad') > -1, //是否为iPad
            webApp: u.indexOf('Safari') == -1 ,//是否为web应用程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') != -1 //是否为微信浏览器
        };
    }()
};
/**
 *  获取浏览器终端
 * */
function getMobileForm(){
    //  1. 是否为移动终端
    if(browser.versions.mobile){
        if(browser.versions.ios | browser.versions.iPhone | browser.versions.iPad){
            //  3. 是否为ios移动终端
            return "ios";
        }else if(browser.versions.android){
            //  4. 是否为android移动终端
            return "android";
        }else{
            return "web";
        }
    }else{
        // 2. 是否为web 端
        return "web";
    }

};

/**
 * 与客户端交互方法
 * reqJson:传给客户端的json对象
 * appDataCallbackObj ： 客户端回调方法返回json对象
 * @return
 */
var appCommunication = function (reqJson, appDataCallbackObj) {
    var appType = getMobileForm();
    if (appType === "android") {
        var reqJson = JSON.stringify(reqJson);
        // android 客户端回调
        window.appCallback = function (respJsonBack) {
            var respJsonBack = respJsonBack.replace(/\n/g, "");
            respJsonBack = JSON.parse(respJsonBack);
            appDataCallbackObj && appDataCallbackObj(respJsonBack);
        };
        // android 调用客户端（传递字符串）
        try {
            window.kingpoint.commonServer(reqJson);
        } catch (error) {
            console.log(error);
        }
    } else if (appType == "ios") {
        try {
            //ios 客户端回调
            jsBridge.bind('commonServer', function (respJsonBack) {
                appDataCallbackObj && appDataCallbackObj(respJsonBack);
            });
            // ios 调用客户端(传递对象)
            jsBridge.postNotification('commonServer', reqJson);
        } catch (error) {
            console.log(error);
            alert("jsBridge不存在！");
        }
    }
};

/**
 * 获取客户端版本号
 * @return 返回版本号  -1 (为旧版本<7.0.4，不需要使用接口鉴权直接调用接口)
 * */
function gmccappVersion() {
    var u = window.navigator.userAgent;
    var match = u.match(/GDMobile\/([\d\.]+)/);
    if (match) {
        return match[1]
    }else{
        return -1;
    }
}