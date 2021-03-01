var Len = 0;
var curProdName = '';
var stempprodId = '';
var srempeffectRule = '';
$(function () {
    initZeroUser();
    initZeroListener();
    queryAd('GD_FLOW_0', querySuccess);
    queryAd('GD_FLOW_LUNBO', querySuccess);
});

//登录
function initZeroUser() {
    if (loginStatus == "1") {
        // 获取一键登录手机号
        oneForLogin(appid_new, messageNew, function (msisdn) {
            // 成功获取，登录
            var tel = encryptedString(key, msisdn);
            login.userLogin(tel, '5', '', messageNew, function () {
                loginTel = msisdn;
                loginStatus = "2";
                fillinZeroUser();
            }, true);
        }, function () {
            Common.pageVisitLog("ZTHD", activityId, location.href, new Date(), channelId, '', '', '', '', null, '', 0);
            $(".gh_btn").html('未登录');
            $(".zero_login").hide();
            //弹登录框
            showPopwap(0);
        });
    }
    else {
        fillinZeroUser();
    }
}

//事件
function initZeroListener() {
    $('#zero_content').on('click', 'img', function () {
        sdcSubscribe('浏览产品', 0);
        if (loginStatus == "1") {
            showPopwap(0);
            return
        }
        var adAttr = $(this).attr('adAttr');
        var adUrl = $(this).attr('adUrl');
        var prodId = $(this).attr('prodId');
        var subTitleUrl = $(this).attr('subTitleUrl');
        var adId = $(this).attr('adId');
        var effectRule = $(this).attr('effectRule');
        srempeffectRule = effectRule;
        stempprodId = prodId;
        $('.zero_downLoad').attr('url', subTitleUrl);
        Common.pageVisitLog("ADVERT", adId, location.href, new Date(), channelId, '', '', '', '', null, '', 0);
        if (adAttr == 0) {
            skipAppAdUrl(adUrl, '')
        } else {
            getProdInfo(prodId, function (promoName, slogan, promoDesc) {
                $('.zero_prodName').html(promoName);
                $('.zero_prodDesc').html(promoDesc);
                $(".zero_prodFee").html(slogan);
                curProdName = promoName;
                sdcSubscribe(promoName + '开始办理', 20);
                showPopwap(2);
            }, function () {

            });
        }
    });
    //订购
    $('.zero_banli').click(function () {
        if (loginStatus == "1") {
            showPopwap(0);
            return
        }
        sdcSubscribe(curProdName + '确认办理', 30);
        gpCommonWait(zeroServiceSubsTo1(stempprodId, activityId, 'YES', '1', '', channelId, function () {
                sdcSubscribe(curProdName + '办理成功', 99);
                if (srempeffectRule != '') {
                    $(".zero_rule").html(srempeffectRule);
                }
                showPopwap(3);
            }, function () {
                sdcSubscribe(curProdName + '办理失败', -99);
                showPopwap(4);
            })
        )

    });
    //
    $('.zero_downLoad').click(function () {
        if (loginStatus == "1") {
            showPopwap(0);
            return
        }
        var url = $(this).attr('url');
        url = returnSdcAdLink(url, '订购成功-立即下载');
        skipAppAdUrl(url, '')
    });

    $("#zero_init").click(function () {
        if (loginStatus == "1") {
            showPopwap(0);
            return
        }
        var url = $(this).attr('adUrl');
        skipAppAdUrl(url, '')
    })
}

//添加号码
function fillinZeroUser() {
    Common.pageVisitLog("ZTHD", activityId, location.href, new Date(), channelId, '', '', '', '', null, '', 0);
    //记录用户信息
    logUserMsg(activityId);
    setSdcMsisdn(loginTel);
    $(".gh_btn").html('更换');
    $(".zero_login").show();
    $(".zero_phone").text(getLoginTel());
}


//成功的回调
function querySuccess(adClmnId, jsondata) {
    if (jsondata == null) {
        return
    }
    var ads = jsondata.ads;
    var html = "";
    if (ads != null && ads != undefined && ads.length > 0) {
        console.log(adClmnId,ads);
        for (var i = 0; i < ads.length; i++) {
            var ad = ads[i];
            var prod = ad.adProduct;
            var subPicUrl = ad.subPicUrl;
            var subTitleUrl = ad.subTitleUrl;
            var prodId = '', prodName = '', prodDesc = '', prodFee = '', effectRule = '';
            if (prod != null && prod != undefined && prod != "") {
                prodId = prod.prodId;
                prodName = prod.prodName;
                prodDesc = prod.prodDesc;
                prodFee = prod.prodFee;
                effectRule = prod.effectRule;
            }
            if (adClmnId == 'GD_FLOW_0') {
                html += '<li><img src="' + ad.adPicUrl + '" adAttr="' + ad.adAttr + '" adClmnId="' + adClmnId + '" adName = "' + ad.adName + '" adUrl = "' + ad.adUrl + '" adId = "' + ad.adId + '" ssoTargetId ="' + ad.ssoTargetId + '" prodId="' + prodId + '" prodName="' + prodName + '" prodFee="' + prodFee + '" prodDesc="' + prodDesc + '" subPicUrl="' + subPicUrl + '" effectRule="' + effectRule + '" subTitleUrl="' + subTitleUrl + '" alt=""></li>';
                $("#zero_content").html(html);
            }
            if (adClmnId == 'GD_FLOW_LUNBO') {
                html += '<div class="swiper-slide"><img src="' + ad.adPicUrl + '" adAttr="' + ad.adAttr + '" adClmnId="' + adClmnId + '" adName = "' + ad.adName + '" adUrl = "' + ad.adUrl + '" adId = "' + ad.adId + '" ssoTargetId ="' + ad.ssoTargetId + '" prodId="' + prodId + '" prodName="' + prodName + '" prodFee="' + prodFee + '" prodDesc="' + prodDesc + '" subPicUrl="' + subPicUrl + '" effectRule="' + effectRule + '" subTitleUrl="' + subTitleUrl + '" alt=""></div>';
                $("#zero_init").html(html);
            }
        }
        if (adClmnId == 'GD_FLOW_LUNBO') {
            initS();
        }
    }
}

function initS() {
    if ($('.index_mai_yhswiper .swiper-container .swiper-slide').length > 0) {
        if ($('.index_mai_yhswiper .swiper-container .swiper-slide').length == 1) {
            var yhSwiper = new Swiper('.index_mai_yhswiper .swiper-container', {
                autoplay: 4000,
                pagination : '.swiper-pagination',
                paginationClickable : true,
                loop: false,
                loopAdditionalSlides: true,
                autoplayDisableOnInteraction : false,
                observer: true,
                observeParents: true,
            });
        } else {
            var yhSwiper = new Swiper('.index_mai_yhswiper .swiper-container', {
                autoplay: 4000,
                pagination : '.swiper-pagination',
                paginationClickable : true,
                loop: true,
                loopAdditionalSlides: true,
                autoplayDisableOnInteraction : false,
                observer: true,
                observeParents: true,
            });
        }
    }
}

