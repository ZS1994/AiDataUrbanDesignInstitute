/**
 * 订购
 * @param prodId 产品id
 * @param callback 成功订购回调函数
 */
function serviceSubsTo(prodId, srcType, srcId, callback, orderType, salesId, channelId) {
    $.ajax({
        url : ctx + "/service/serviceSubscribe.ajax",
        type : "POST",
        dataType : "json",
        data : {
            "prodId" : prodId,
            "srcType" : srcType,
            "srcId" : srcId,
            "orderType": (orderType == undefined? 1 : orderType),
            "salesId" : (salesId == undefined? "" : salesId),
            "channelId" : (channelId == undefined? "" : channelId)
        },
        success : function(resp) {
            if (!resp || !resp.isSuccess) {
                fail("未知原因，办理失败！", "办理失败");
                return;
            }
            else {
                var jsonData = eval('(' + resp.data + ')');
                if(jsonData != null && "0" == jsonData.retCode) {
                    if(callback) {
                        callback.call(this);
                    }
                }
                else if(jsonData != null && "981025" == jsonData.retCode) {
                    fail(jsonData.retMsg);
                }
                else {
                    fail("您暂时无法订购该产品，具体业务规则请参照套餐说明。");
                }
            }
        },
        error : function(xhr, status) {
            if(xhr.readyState != 4 || status == "timeout") {
                fail("正在等待产品订购结果，若产品订购成功将会以短信进行通知。");
            }
            else {
                fail("未知原因，办理失败！", "办理失败");
            }
        }
    });
}


/**
 * 订购 -- 异步
 * @param prodId 产品id
 * @param callback 成功订购回调函数
 */
function serviceSubsToSync(prodId, srcType, srcId, callback, orderType, salesId, channelId) {
    $.ajax({
        url : ctx + "/service/serviceSubscribe.ajax",
        type : "POST",
        dataType : "json",
        data : {
            "prodId" : prodId,
            "srcType" : srcType,
            "srcId" : srcId,
            "orderType": (orderType == undefined? 1 : orderType),
            "salesId" : (salesId == undefined? "" : salesId),
            "channelId" : (channelId == undefined? "" : channelId),
            "syncType" : "NO"
        },
        success : function(resp) {
            if (!resp || !resp.isSuccess) {
                fail("未知原因，办理失败！", "办理失败");
                return;
            }
            else {
                var jsonData = eval('(' + resp.data + ')');
                if(jsonData != null && "0" == jsonData.retCode) {
                    if(callback) {
                        callback.call(this);
                    }
                }
                else if(jsonData != null && "981025" == jsonData.retCode) {
                    fail(jsonData.retMsg);
                }
                else {
                    fail("您暂时无法订购该产品，具体业务规则请参照套餐说明。");
                }
            }
        },
        error : function(xhr, status) {
            if(xhr.readyState != 4 || status == "timeout") {
                fail("正在等待产品订购结果，若产品订购成功将会以短信进行通知。");
            }
            else {
                fail("未知原因，办理失败！", "办理失败");
            }
        }
    });
}