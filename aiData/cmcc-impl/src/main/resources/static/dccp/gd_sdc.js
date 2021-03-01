/**
 * 设置用户登录手机号
 */
function setSdcMsisdn(phone,cityName) {
    $("head").append('<Meta name="WT.cid" content="">');
    $("head").append('<Meta name="WT.mobile" content="'+phone+'">');
    $("head").append('<Meta name="WT.brand" content="">');
    $("head").append('<Meta name="WT.city" content="'+cityName+'">');
}

/**
 * 设置点击锚点
 * @param action 触点点击码
 */
function setSdcClick(action) {
    Webtrends.multiTrack({argsa:['DCS.dcsuri','/nopv.gif','WT.event', action]});
}

/**
 * 外投广告链接营销码
 * @param url
 * @param code 外挂广告外链营销码
 * @returns {*}
 */
function returnSdcAdLink(url, code) {
    if(url.indexOf('?') < 0) {
        url += '?WT.mc_id=' + code;
    }
    else {
        url += '&WT.mc_id=' + code;
    }
    return url;
}

/**
 * 办理产品
 * @param name 业务名称
 * @param step 业务步骤 1浏览 20开始办理（进入二次确认弹框） 30确认 -30取消 99成功 -99失败
 */
function sdcSubscribe(name, step) {
    Webtrends.multiTrack({argsa:[ 'WT.si_n', name,'WT.si_x', step]});
}