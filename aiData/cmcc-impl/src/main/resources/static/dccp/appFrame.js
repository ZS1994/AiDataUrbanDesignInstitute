/**
 * 跳转新窗口，匹配掌厅APP、独立链接、iframe被嵌入链接
 * @param longUrl 跳转链接
 * @param ssoTagetId 单点
 */
var app_appType = getMobileForm();//获取手机类型
var app_version = gmccappVersion(); //广东移动app版本号
var authenticationSucceed = false; //鉴权成功

$(function(){
    if (app_version === -1){//旧版本<7.0.4，无需鉴权直接使用接口
        // $(".authentication span").html('旧版本，无需鉴权；直接调用接口使用');
    }else{
        authentication(function (data) {    //鉴权成功
            authenticationSucceed = true;
            // $(".authentication span").html("接口鉴权成功，内容为"+JSON.stringify(data));
        });
    }
});

/**
 *  接口鉴权
 *  @param {function} success 成功回调
 * */
function authentication(success) {
    var reqJson = {
        servicename: "GMCCJS_704_001_001_001",//鉴权接口名
        reqData: {
            appId: '424a41ec000e4be58ed41b322837465a' // 输入自己申请的广东移动appid
            // appId: '22d5c27a0b14488c9f49bac7c42a9d99'
        }
    };
    appCommunication(reqJson, function(data){ //鉴权成功回调
        var result = data.result;   //响应标识
        var desc = data.desc;   //响应描述
        if (result === '000'){
            success && success(data);
        }else{
            $(".authentication span").html("接口鉴权失败,响应标识："+result+"，响应描述："+desc);
        }
    });
}

function skipAppAdUrl(longUrl, ssoTagetId){
    // 如果是广东掌厅app登录
    if(loginTypeStatus && loginTypeStatus=="4")
    {
    	if(top.location != location){
    		parent.skipAdUrlSun(longUrl, ssoTagetId);
    		return;
    	}
    	else{
    		if(loginStatus!="1" &&  "wap" == ssoTagetId){
                var reqJson = {servicename: "GMCCJS_000_000_000_001",reqData: {code: "GMCCAPP_003_004",id: "2|wap|" + longUrl}};
                appCommunication(reqJson, null);
    		}else if(loginStatus!="1" && "gmccapp" == ssoTagetId){
                var reqJson = {servicename: "GMCCJS_000_000_000_001",reqData: {code: "GMCCAPP_003_004",id: "2|gmccapp|" + longUrl}};
                appCommunication(reqJson, null);
    		}else if(loginStatus!="1"&& ssoTagetId!=null && ssoTagetId!="" && ssoTagetId!="undefined"){
    			$.postUnifiedAuth(longUrl, ssoTagetId, null, "4");
    		}else{
                var reqJson = {servicename: "GMCCJS_000_000_000_001",reqData: {code: "GMCCAPP_003_004",id: "0|appLogin|" + longUrl}};
                appCommunication(reqJson, null);
    		}
    		return;
    	}
	}
    // 非掌厅登录
	if(loginStatus!="1" && ssoTagetId!=null && ssoTagetId!="" && ssoTagetId!="undefined" && ssoTagetId != "wap" && ssoTagetId != "gmccapp"){
		$.postUnifiedAuth(longUrl, ssoTagetId);
	}
	else{
		top.location.href = longUrl;
	}
}


/**
 * 掌厅分享
 * @param title 标题
 * @param brief 描述
 * @param pic logo图片
 * @param url 外链地址
 */
function initSkipShare(title, brief, pic, url){
    var reqJson = {
            servicename: "GMCCJS_620_002_001_001",
            reqData: {
                "shareTitle": title,
                "shareDesc": brief,
                "sharePic": pic,
                "shareUrl": url,
                "alertTitle": ""
            }
        };
        appCommunication(reqJson, function(data) { //成功回调
            var result = data.result;   //响应标识
            var desc = data.desc;   //响应描述
            if (result === '000') {

            } else {

            }
        })
}


/**
 * 通过获取网络状态来判断是否掌厅App
 * 回调callback(isApp)
 */
function judgeApp(callback) {
    var reqJson ='{"servicename":"GMCCJS_620_001_001_001","reqData":""} ';

    var isApp = false;
    var getOnlieStatusCallback = {
        // 在掌厅里
        doSuccess: function (data) {
            isApp = true;
        }
    };

    try{
        gmccapp(reqJson, getOnlieStatusCallback);
    }
    catch (e){
    }

    if(isApp) {
        callback.call(this, true);
    }
    else {
        // 屏蔽
        // callback.call(this, false);
        callback.call(this, true);
    }
}


