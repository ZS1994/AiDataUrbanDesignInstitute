import {mobilePhoneSystem} from '../common'
import {jsBridge} from './TGJSBridge'

/**
 * 与客户端交互方法
 * reqJson:传给客户端的json对象
 * appDataCallbackObj ： 客户端回调
 * @return
 */
function appCommunication(reqJsonP, appDataCallbackObj) {
    const appType = mobilePhoneSystem();
    if (appType === "android") {
        var reqJson = JSON.stringify(reqJsonP);
        // android 客户端回调
        window.appCallback = function (respJsonBackP) {
            var respJsonBack = respJsonBackP.replace(/\n/g, "");
            respJsonBack = JSON.parse(respJsonBack);
            appDataCallbackObj && appDataCallbackObj(respJsonBack);
        };
        // android 调用客户端（传递字符串）
        try {
            window.kingpoint.commonServer(reqJson);
        } catch (error) {
            console.log(error);
        }
    } else if (appType === "ios") {
        try {
            //ios 客户端回调
            jsBridge.bind('commonServer', function (respJsonBack) {
                appDataCallbackObj && appDataCallbackObj(respJsonBack);
            });
            // ios 调用客户端(传递对象)
            jsBridge.postNotification('commonServer', reqJsonP);
        } catch (error) {
            console.log(error);
            alert("jsBridge不存在！");
        }
    }
}
/**
 * 客户端跳转功能
 * @param {Object} reqData 传递的对象数据
 * */
function appJump(reqData) {
    var reqJson = {};
    reqJson.servicename = 'GMCCJS_000_000_000_001';
    reqJson.reqData = reqData;
    //alert(reqJson);
    var appDataCallbackObj = null;
    appCommunication(reqJson, appDataCallbackObj); // 与客户端交互
}
/**
 * 跳转登录超时
 * */
function appJumpLogin() {
    appJump({
        code: 'GMCCAPP_001_019'
    })
}
/**
 * 跳转卡卷优惠券中心
 * */
function appYouhui() {
    appJump({
        code: 'GMCCAPP_001_028'
    })
}


export {
    appCommunication,
    appJump,
    appJumpLogin,
    appYouhui
}