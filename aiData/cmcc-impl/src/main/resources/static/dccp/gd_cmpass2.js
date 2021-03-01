/**
 * 一键登录
 * @date 2018-11-14 统一认证平台升级新版
 * @author chenxu
 * @param appId
 * @param messageNew
 * @param callback  成功回调
 * @param failCallback  失败回调
 */
var phoneNumber="";
function oneForLogin(cmpassAppId, messageNew, callback, failCallback) {
    // 校验
    if(!hasVal(cmpassAppId) && !hasVal(messageNew)) {
        if(failCallback) {
            failCallback.call(this, "参数缺失");
        }
        return;
    }
    // 参数
    var cmpassVersion = "1.2";
    // 获取准签名
    var preSign = YDRZ.getSign(cmpassAppId, cmpassVersion);
    // rsa加密获取签名
    var sign = preSignRSA(preSign);
    // 获取token
    YDRZ.getTokenInfo({
        data: {
            "version": cmpassVersion,
            "appId": cmpassAppId,
            "sign": sign,
            "openType": "1", // 1:移动取号类型
            "expandParams": "", // 扩展参数 格式：参数名=值 多个用|分隔
            "isTest": "" // 0:测试模式
        },
        success: function(resp) {
            if(resp != "" && resp != null) {
                if(resp.code == "000000") {
                    var token = resp.token;
                    var userInformation = resp.userInformation;
                    analysisToken(token, userInformation, messageNew, callback, failCallback);
                }
                else{
                    if(failCallback){
                        failCallback.call(this, resp.message);
                    }
                }
                return;
            }
            if(failCallback){
                failCallback.call(this, "无响应参数");
            }
        },
        error: function(err) {
            if(failCallback){
                failCallback.call(this, "调用token错误");
            }
        }
    });
}

function oneForLogin2(cmpassAppId, messageNew, callback, failCallback) {
    // 校验
    if(!hasVal(cmpassAppId) && !hasVal(messageNew)) {
        if(failCallback) {
            failCallback.call(this, "参数缺失");
        }
        return;
    }
    // 参数
    var cmpassVersion = Math.random();
    // 获取准签名
    var preSign = YDRZ.getSign(cmpassAppId, cmpassVersion);
    // rsa加密获取签名
    var sign = preSignRSA(preSign);
    // 获取token
    YDRZ.getTokenInfo({
        data: {
            "version": cmpassVersion,
            "appId": cmpassAppId,
            "sign": sign,
            "openType": "1", // 1:移动取号类型
            "expandParams": "", // 扩展参数 格式：参数名=值 多个用|分隔
            "isTest": "" // 0:测试模式
        },
        success: function(resp) {
            if(resp != "" && resp != null) {
                if(resp.code == "000000") {
                    var token = resp.token;
                    var userInformation = resp.userInformation;
                    analysisToken(token, userInformation, messageNew, callback, failCallback);
                }
                else{
                    if(failCallback){
                        failCallback.call(this, resp.message);
                    }
                }
                return;
            }
            if(failCallback){
                failCallback.call(this, "无响应参数");
            }
        },
        error: function(err) {
            if(failCallback){
                failCallback.call(this, "调用token错误");
            }
        }
    });
}

function analysisToken(token, userInformation, messageNew, callback, failCallback) {
    $.ajax({
        url: ctx + "/gd/auth/uniTokenValidate.ajax",
        data: {
            "token": token,
            "userInformation": userInformation,
            "area": "GD"
        },
        dataType: "json",
        type: "POST",
        async: false,
        success: function(resp){
            if(resp != null && resp != "" && resp.isSuccess){
                var data = eval('(' + resp.data + ')');
                if(data != "" && data != null){
                    var header = data.header;
                    if(header.resultcode == "103000"){
                        // 成功
                        var body = data.body;
                        getPhoneNumber(body.msisdnmask, body.msisdn, messageNew, callback, failCallback);
                    }
                    else {
                        // 失败
                        if(failCallback){
                            failCallback.call(this, header.resultdesc);
                        }
                    }
                }
            }
        },
        error: function(err){
            if(failCallback){
                failCallback.call(this, "获取手机号码失败");
            }
        }
    });
}
var phoneNumber = "";
function getPhoneNumber(phone, mask, message, callback, failCallback) {
    $.ajax({
        url: ctx + "/gd/auth/getCmpassNumber.ajax",
        data: {
            "maskPhone": mask,
            "message": message,
            "area" : "GD"
        },
        dataType: "json",
        type: "POST",
        async: false,
        success: function(resp){
            if(resp != null && resp != "" && resp.isSuccess){
                var data = resp.data;
                if(data != "" && data != null){
                    // 成功
                    phoneNumber = phone;
                    loginStatus = "2";
                    loginType = 5;
                    if(callback){
                        callback.call(this, data);
                    }
                }
                else {
                    // 失败
                    if(failCallback){
                        failCallback.call(this, "获取手机号码失败");
                    }
                }
            }
            else {
                if(failCallback){
                    failCallback.call(this, "获取手机号码失败");
                }
            }
        },
        error: function(err){
            if(failCallback){
                failCallback.call(this, "获取手机号码失败");
            }
        }
    });
}


function preSignRSA(preSign) {
    var sign = "";
    $.ajax({
        url: ctx + "/gd/auth/signRSA.ajax",
        data: {
            "preSign": preSign
        },
        dataType: "json",
        type: "POST",
        async: false,
        success: function(resp){
            if(resp && resp.isSuccess && resp != "") {
                sign = resp.data;
            }
        },
        error: function(req, status, err){
        }
    });
    return sign;
}

function hasVal(str){
    if(str != undefined && str != "" && str != null) {
        return true;
    }
    return false;
}
