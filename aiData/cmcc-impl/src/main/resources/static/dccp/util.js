/**
 * 登陆模块 Util
 */

// 登录
$(".btn_submit").on("click", function () {
    var tel = $("#phone").val();
    var pass = $("#authcode").val();
    if (tel == "") {
        alert("请输入正确的手机号码！");
        return;
    }
    if (!tel.match(mobileReg)) {
        alert("手机号格式错误");
        return;
    }
    if (pass == "") {
        alert("请输入验证码！");
        return;
    }
    userLoginTo(tel, pass, function () {
        location.reload();
    });
});

// 一键登录
$(".btn_submit2").on("click", function () {
    oneForLogin2(appid_new, messageNew, function (msisdn) {
        // 成功获取，登录
        var tel = encryptedString(key, msisdn);
        login.userLogin(tel, '5', '', messageNew, function () {
            loginTel = msisdn;
            loginStatus = "2";
            fillinGiftPacksUser();
            location.reload();
        }, true);
    }, function () {
        alert("获取号码失败");
    });
});
$(".fx").on("click", function () {
    share();
});

// 登录
function userLoginTo(tel, pass, callback) {
    tel = encryptedString(key, tel);
    pass = encryptedString(key, pass);
    login.userLogin(tel, 6, pass, messageNew, callback);
}

// 登录失败
function msgShowalert(msg) {
    layer.close(gpLoadingWin);
    alert(msg);
}

// 获取验证码倒计时
function startSendSms(obj) {
    if ($("#phone").val() == "") {
        alert("请输入正确的手机号码！");
        return;
    }
    sendSmsTo(function () {
        counttime(obj);
    });
}

// 发验证码短信
function sendSmsTo(callback) {

    // 获取填写的手机号码
    var tel = $("#phone").val();
    // 手机号为空
    if (tel == "") {
        alert("请输入正确的手机号码！");
        return;
    }
    // 不匹配手机号码规则
    if (!tel.match(mobileReg)) {
        alert("手机号格式错误");
        return;
    }

    // 如果校验成功，发送验证码短信
    tel = encryptedString(key, tel);
    $.ajax({
        url: "http://127.0.0.1:8080//aidata/cmcc/dccp/sendSmsCode",
        type: "POST",
        cache: false,
        dataType: "json",
        data: {
            "loginTel": tel
        },
        success: function (resp) {
            var jsonData = eval('(' + resp.data + ')');
            var errorMsg = messageUtil.getMessage("MSG_999999");
            if (jsonData == null || !resp.isSuccess) {
                errorMsg = resp.msg;
            }
            else {
                var code = jsonData.retCode;
                if ("010001" == code) {
                    errorMsg = messageUtil.getMessage("MSG_010001").replace("{0}", jsonData.interval);
                } else if ("010002" == code) {
                    errorMsg = messageUtil.getMessage("MSG_010002").replace("{0}", jsonData.timeLimit);
                } else if ("010003" == code) {
                    errorMsg = messageUtil.getMessage("MSG_010003");
                } else if ("0" == code) {
                    callback.call(this);
                    return;
                } else if ("000002" == code) {
                    errorMsg = messageUtil.getMessage("MSG_000002");
                } else if ("000003" == code) {
                    errorMsg = messageUtil.getMessage("MSG_000003");
                }
            }
            alert(errorMsg);
        },
        error: function (resp) {
            alert(messageUtil.getMessage("MSG_999999"));
        }
    });
}

// 倒计时
var reFlag = false;

function counttime(obj) {
    var countdown = 60;
    $(".btn-code").removeClass('btn-b');
    settime(obj);

    function settime(obj) {
        if (reFlag) {
            $(obj).attr("disabled", false);
            $(obj).text("获取验证码");
            countdown = 60;
            $(".btn-code").addClass('btn-b');
            return;
        }
        if (countdown == 0) {
            $(obj).attr("disabled", false);
            $(obj).text("重新获取");
            countdown = 60;
            $(".btn-code").addClass('btn-b');
            return;
        } else {
            $(obj).attr("disabled", true);
            $(obj).text("请稍候(" + countdown + ") s");
            countdown--;
        }
        setTimeout(function () {
                settime(obj);
            }
            , 1000);
    }
}

function alert(msg) {
    layer.msg(msg, {area: '60%', offset: '25%'});
}

/**
 * 等待弹框......
 */
var gpLoadingWin;

function gpCommonWait(callback) {
    gpLoadingWin = layer.open({
        type: 1,
        title: false,
        area: '100%',
        content: '<div class="msgbg" id="waiting"><div class="waiting1"><div class="waiting1_ani"></div><div>请求中...</div></div></div>',
        shade: [0.1, '#000'],
        offset: '0%',
        success: function (layero, index) {
            if (callback) {
                callback.call(this);
            }
        }
    });
}

/**
 * 订购等待
 */
function gpWaitClose() {
    layer.close(gpLoadingWin);
    layer.closeAll();
}






// 记录用户信息
function logUserMsg(activityId) {
    $.ajax({
        url: ctx + "/activity/accessActPage.ajax",
        type: "POST",
        dataType: "json",
        data: {
            "activityId": activityId
        },
        success: function (resp) {
        },
        error: function (xhr, status) {
        }
    });
}
//转化手机格式
function getLoginTel() {
    if (loginTel == "" || loginTel == null) {
        return "";
    }
    var tel = loginTel;
    if (tel.indexOf('*') < 0) {
        tel = tel.substr(0, 3) + '****' + tel.substr(7, 4);
    }
    return tel;
}

function showPopwap(index) {
    $(".pop_wap").hide();
    gpWaitClose();
    $(".layui-layer-shade").hide();
    $(".pop_wap").eq(index).show();
}

function closePopwap() {
    gpWaitClose();
    $(".layui-layer-shade").hide();
    $(".pop_wap").hide();
}


//订购
function zeroServiceSubsTo1(prodId, activityId, syncType, orderType, salesId, channelId, callback,failback) {
    $.ajax({
        url: ctx + "/service/serviceSubscribe.ajax",
        type: "POST",
        dataType: "json",
        data: {
            "prodId": prodId,
            "srcType": "2",
            "srcId": activityId,
            "syncType": syncType,
            "orderType": (orderType == undefined ? 1 : orderType),
            "salesId": (salesId == undefined ? "" : salesId),
            "channelId": (channelId == undefined ? "" : channelId)
        },
        success: function (resp) {
            if (!resp || !resp.isSuccess) {
                return;
            }
            else {
                var jsonData = eval('(' + resp.data + ')');
                if (jsonData != null && "0" == jsonData.retCode) {
                    if (callback) {
                        callback.call(this);
                    }
                } else {
                   if(failback){
                       failback.call(this);
                   }
                }
            }
        },
        error: function (xhr, status) {

        }
    });
}

//用户是否已订购
function queryUserSubsed(prodIds, callback, failCallback) {
    $.ajax({
        url: ctx + "/gd/vipactivity/queryUserSubsed.ajax",
        data: {
            "prodId[0]": prodIds
        },
        async: false,
        dataType: 'json',
        type: 'POST',
        success: function (resp) {
            if (!resp || !resp.isSuccess) {
                if (failCallback) {
                    failCallback.call(this);
                }
                return;
            }
            var data = resp.data;
            if (data != null && data.isSubs == 1 && ("0" == data.retCode)) {
                if (callback) {
                    callback.call(this, data);
                }
            } else if (data != null && data.isSubs == 2 && ("0" == data.retCode)) {
                if (failCallback) {
                    failCallback.call(this);
                }
            }
            else {
                alert('系统繁忙，请稍后再试');
            }
        },
        error: function () {
            if (failCallback) {
                failCallback.call(this);
            }
        }
    });
}



/**
 * 查询
 * @param adClmnId
 * @param callback
 */
function queryAd(adClmnId, callback) {
    $.ajax({
        url: ctx + "/ad/queryAd.ajax",
        type: "POST",
        dataType: "json",
        data: {
            "adClmnId": adClmnId
        },
        success: function (resp) {
            if (!resp.isSuccess) {
                return;
            }
            var jsonData = eval('(' + resp.data + ')');
            if (jsonData != null) {
                if (callback) {
                    callback.call(this, adClmnId, jsonData);
                }
            }
        }
    });
}


function getProdInfo(prodId, callback, failCallback) {
    $.ajax({
        url: ctx + '/prod/queryProdDetail.ajax',
        type : "POST",
        dataType : "json",
        async: false,
        data: {
            "prodId": prodId
        },
        success: function(resp){
            if (!resp || !resp.isSuccess || resp.data == "") {
                if(failCallback) {
                    failCallback.call(this);
                }
                return;
            }
            var jsonData = eval('(' + resp.data + ')');
            if(jsonData != null && jsonData.retCode == "0") {
                var pro = jsonData.product;
                var promoName = pro.promoName;
                var slogan = pro.slogan;
                var promoDesc = pro.promoDesc;
                if(callback) {
                    callback.call(this,promoName, slogan, promoDesc);
                }
            }
            else {
                alert(jsonData.retMsg);
                if(failCallback) {
                    failCallback.call(this);
                }
            }
        },
        error: function(xhr, status, err){
            if(failCallback) {
                failCallback.call(this);
            }
        }
    });
}