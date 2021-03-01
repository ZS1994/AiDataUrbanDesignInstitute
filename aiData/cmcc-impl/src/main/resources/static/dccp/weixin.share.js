/**
 * weixin.share.js
 * @author yinx
 * @date 2016-09-09
 */
function weixinShare(){
}
weixinShare.getBasicPath=function(){
	var curWwwPath=window.document.location.href;
    //获取主机地址之后的目录
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    var localhostPath=curWwwPath.substring(0,pos);
    //获取带"/"的项目名，如：/dccp-portal
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
	return localhostPath+projectName;
};
weixinShare.config={
	"getJSTicketUrl":"/weixin/getWeixinJsTicket.ajax"
};
weixinShare.basicPath=weixinShare.getBasicPath();
weixinShare.errPopBox=null;
weixinShare.isWeixinBrowser=function(){
	var userAgent = navigator.userAgent.toLowerCase();
	if(userAgent.match(/MicroMessenger/i) == 'micromessenger'){
		return true;
	}
	var appVersion = navigator.appVersion.toLowerCase();
	if (appVersion.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    }
	return false;
};

weixinShare.isEmpty=function(obj){
	if(obj==null||obj==""){
		return true;
	}
	return false;
};
function getCurrLink(){
	return window.location.href;
}
weixinShare.init=function(){
	if(!weixinShare.isWeixinBrowser()){
		return;
	}
	var requestUrl=encodeURIComponent(getCurrLink());
	$.ajax({
		url : weixinShare.basicPath+weixinShare.config.getJSTicketUrl,
		type : "POST",
		cache : false,
		dataType : "json",
		data : {
			"requestURI" : requestUrl
		},
		success : function(resp) {
			if (!resp.isSuccess) {
				if(weixinShare.errPopBox){
					weixinShare.errPopBox.call(this,"系统繁忙");
				}
				return;
			}
			var jsonData = eval('(' + resp.data + ')');
			var retCode=jsonData.retCode;
			var retMsg=jsonData.retMsg;
			if(retCode!="0"){
				if(weixinShare.errPopBox){
					weixinShare.errPopBox.call(this,retMsg);
				}
				return;
			}
			var nonceStr=jsonData.nonceStr;
			var timestamp=jsonData.timestamp;
			var appId=jsonData.appId;
			var wxMessage=jsonData.wxMessage;
			var wxCode=jsonData.wxCode;
			var signature=jsonData.signature;
            ////alert(nonceStr+","+timestamp+","+appId+","+wxMessage+","+wxCode+","+signature);
            wx.config({
				debug : false,
				appId : appId,
				timestamp : timestamp,
				nonceStr : nonceStr,
				signature : signature,
				jsApiList : [ 
					'checkJsApi', 
					'onMenuShareTimeline',
					'onMenuShareAppMessage', 
					'onMenuShareQQ', 
					'onMenuShareWeibo',
					'onMenuShareQZone']
			});
            ////alert("wx.config finished");
		},
		error : function(){
			if(weixinShare.errPopBox){
				weixinShare.errPopBox.call(this,"系统繁忙");
			}
		}
	});
};
weixinShare.ready=function(config,succCallback,failCallback,triggerCallback,cancelCallback){
	if(!weixinShare.isWeixinBrowser()){
		return;
	}
	var longUrl=config.link;
	if(config.link.indexOf("/")==0){
		//相对路径
		longUrl=weixinShare.basicPath+config.link;
	}
	var imgUrl_=config.imgUrl;
	if(config.imgUrl.indexOf("/")==0){
		//相对路径
		imgUrl_=weixinShare.basicPath+config.imgUrl;
	}
	
	var shareType = "0";
	if(config.shareType){
		shareType=config.shareType;
	}
	var shortUrl = longUrl;
	if(shortUrl.indexOf("?") != -1){
		shortUrl = shortUrl +"&shareMode=0";
	}else{
		shortUrl = shortUrl +"?shareMode=0";
	}
	//alert("short URL:"+shortUrl);
	wx.ready(function(){
		//alert("wx.ready start");
    	var type_=config.type;
    	if(weixinShare.isEmpty(config.type)){
    		type_="";
    	}
    	var dataUrl_=config.dataUrl;
    	if(weixinShare.isEmpty(config.dataUrl)){
    		dataUrl_="";
    	}
    	//alert(config.title+","+config.desc+","+shortUrl+","+longUrl+","+imgUrl_+","+type_+","+dataUrl_);
    	//分享给朋友
    	wx.onMenuShareAppMessage({
			title :config.title,
			desc : config.desc,
			link : shortUrl,
			imgUrl : imgUrl_,
			type : type_,
			dataUrl : dataUrl_,
			trigger : function(res) {
				////alert("trigger friend");
				if(triggerCallback){
					triggerCallback.call(this,res);
				}
			},
			success : function(res) {
				//alert("success friend");
				weixinShare.pageShareLog(shareType,longUrl,"10");
				if(succCallback){
					succCallback.call(this,res);
				}
			},
			cancel : function(res) {
				if(cancelCallback){
					cancelCallback.call(this,res);
				}
			},
			fail : function(res) {
				////alert("fail friend");
				if(failCallback){
					failCallback.call(this,res);
				}else{
					if(weixinShare.errPopBox){
						weixinShare.errPopBox.call(this,res);
					}
				}
			}
		});
    	////alert("分享给朋友 finished");
	    //分享到朋友圈
		wx.onMenuShareTimeline({
			title :config.title,
			desc : config.desc,
			link : shortUrl,
			imgUrl : imgUrl_,
			trigger : function(res) {
				if(triggerCallback){
					triggerCallback.call(this,res);
				}
			},
			success : function(res) {
				weixinShare.pageShareLog(shareType,longUrl,"11");
				if(succCallback){
					succCallback.call(this,res);
				}
			},
			cancel : function(res) {
				if(cancelCallback){
					cancelCallback.call(this,res);
				}
			},
			fail : function(res) {
				if(failCallback){
					failCallback.call(this,res);
				}else{
					if(weixinShare.errPopBox){
						weixinShare.errPopBox.call(this,res);
					}
				}
			}
		});
		////alert("分享到朋友圈 finished");
		//分享到QQ
		wx.onMenuShareQQ({
			title :config.title,
			desc : config.desc,
			link : shortUrl,
			imgUrl : imgUrl_,
			trigger : function(res) {
				if(triggerCallback){
					triggerCallback.call(this,res);
				}
			},
			success : function(res) {
				weixinShare.pageShareLog(shareType,longUrl,"12");
				if(succCallback){
					succCallback.call(this,res);
				}
			},
			cancel : function(res) {
				if(cancelCallback){
					cancelCallback.call(this,res);
				}
			},
			fail : function(res) {
				if(failCallback){
					failCallback.call(this,res);
				}else{
					if(weixinShare.errPopBox){
						weixinShare.errPopBox.call(this,res);
					}
				}
			}
		});
		////alert("分享到QQ finished");
		//分享到腾讯微博
		wx.onMenuShareWeibo({
			title :config.title,
			desc : config.desc,
			link : shortUrl,
			imgUrl : imgUrl_,
			trigger : function(res) {
				if(triggerCallback){
					triggerCallback.call(this,res);
				}
			},
			success : function(res) {
				weixinShare.pageShareLog(shareType,longUrl,"20");
				if(succCallback){
					succCallback.call(this,res);
				}
			},
			cancel : function(res) {
				if(cancelCallback){
					cancelCallback.call(this,res);
				}
			},
			fail : function(res) {
				if(failCallback){
					failCallback.call(this,res);
				}else{
					if(weixinShare.errPopBox){
						weixinShare.errPopBox.call(this,res);
					}
				}
			}
		});
		////alert("分享到腾讯微博 finished");
		//分享到QQ空间
		wx.onMenuShareQZone({
			title :config.title,
			desc : config.desc,
			link : shortUrl,
			imgUrl : imgUrl_,
			trigger : function(res) {
				if(triggerCallback){
					triggerCallback.call(this,res);
				}
			},
			success : function(res) {
				weixinShare.pageShareLog(shareType,longUrl,"13");
				if(succCallback){
					succCallback.call(this,res);
				}
			},
			cancel : function(res) {
				if(cancelCallback){
					cancelCallback.call(this,res);
				}
			},
			fail : function(res) {
				if(failCallback){
					failCallback.call(this,res);
				}else{
					if(weixinShare.errPopBox){
						weixinShare.errPopBox.call(this,res);
					}
				}
			}
		});
		////alert("分享到QQ空间 finished");
	});
	
//	$.ajax({
//		url : weixinShare.basicPath + "/url/getShortUrlByLong.ajax",
//		type : "POST",
//		async :false, 
//		dataType : "json",
//		data : {
//			"longUrl" : longUrl
//		},
//		success : function(resp) {
//			var jsonData = eval('(' + resp.data + ')');
//			if (!resp.isSuccess) {
//				// 出错
//				if(weixinShare.errPopBox){
//					weixinShare.errPopBox.call(this,"系统繁忙");
//				}
//				return;
//			}else{
//				var code = jsonData.retCode;
//				if("0" == code){
//					
//				}else{
//					if(weixinShare.errPopBox){
//						weixinShare.errPopBox.call(this,"系统繁忙");
//					}
//					return;
//				}
//			}
//		},
//		error : function(resp) {
//			if(weixinShare.errPopBox){
//				weixinShare.errPopBox.call(this,"系统繁忙");
//			}
//		}
//	});
};
weixinShare.ready_short=function(config,succCallback,failCallback,triggerCallback,cancelCallback){
	if(!weixinShare.isWeixinBrowser()){
		return;
	}
	//alert("ready_short开始");
	var shortUrl=config.link;
	var imgUrl_=config.imgUrl;
	if(config.imgUrl.indexOf("/")==0){
		//相对路径
		imgUrl_=weixinShare.basicPath+config.imgUrl;
	}
	wx.ready(function(){
		//alert("wx.ready开始");
		//alert("wx.ready start");
    	var type_=config.type;
    	if(weixinShare.isEmpty(config.type)){
    		type_="";
    	}
    	var dataUrl_=config.dataUrl;
    	if(weixinShare.isEmpty(config.dataUrl)){
    		dataUrl_="";
    	}
    	//alert("参数开始");
    	//alert(config.title+","+config.desc+","+shortUrl+","+imgUrl_+","+type_+","+dataUrl_);
    	//alert("参数结束");
    	//分享给朋友
    	wx.onMenuShareAppMessage({
			title :config.title,
			desc : config.desc,
			link : shortUrl,
			imgUrl : imgUrl_,
			type : type_,
			dataUrl : dataUrl_,
			trigger : function(res) {
				//alert(1);
				//alert(res);
				////alert("trigger friend");
				if(triggerCallback){
					triggerCallback.call(this,res);
				}
			},
			success : function(res) {
				//alert(2);
				//alert(res);
				////alert("success friend");
				if(succCallback){
					succCallback.call(this,res);
				}
			},
			cancel : function(res) {
				//alert(3);
				//alert(res);
				if(cancelCallback){
					cancelCallback.call(this,res);
				}
			},
			fail : function(res) {
				//alert(4);
				//alert(res);
				////alert("fail friend");
				if(failCallback){
					failCallback.call(this,res);
				}else{
					if(weixinShare.errPopBox){
						weixinShare.errPopBox.call(this,res);
					}
				}
			}
		});
    	////alert("分享给朋友 finished");
	    //分享到朋友圈
		wx.onMenuShareTimeline({
			title :config.title,
			link : shortUrl,
			imgUrl : imgUrl_,
			trigger : function(res) {
				//alert(1);
				//alert(res);
				if(triggerCallback){
					triggerCallback.call(this,res);
				}
			},
			success : function(res) {
				//alert(2);
				//alert(res);
				if(succCallback){
					succCallback.call(this,res);
				}
			},
			cancel : function(res) {
				//alert(3);
				//alert(res);
				if(cancelCallback){
					cancelCallback.call(this,res);
				}
			},
			fail : function(res) {
				//alert(4);
				//alert(res);
				if(failCallback){
					failCallback.call(this,res);
				}else{
					if(weixinShare.errPopBox){
						weixinShare.errPopBox.call(this,res);
					}
				}
			}
		});
		////alert("分享到朋友圈 finished");
		//分享到QQ
		wx.onMenuShareQQ({
			title :config.title,
			desc : config.desc,
			link : shortUrl,
			imgUrl : imgUrl_,
			trigger : function(res) {
				if(triggerCallback){
					triggerCallback.call(this,res);
				}
			},
			success : function(res) {
				if(succCallback){
					succCallback.call(this,res);
				}
			},
			cancel : function(res) {
				if(cancelCallback){
					cancelCallback.call(this,res);
				}
			},
			fail : function(res) {
				if(failCallback){
					failCallback.call(this,res);
				}else{
					if(weixinShare.errPopBox){
						weixinShare.errPopBox.call(this,res);
					}
				}
			}
		});
		////alert("分享到QQ finished");
		//分享到腾讯微博
		wx.onMenuShareWeibo({
			title :config.title,
			desc : config.desc,
			link : shortUrl,
			imgUrl : imgUrl_,
			trigger : function(res) {
				if(triggerCallback){
					triggerCallback.call(this,res);
				}
			},
			success : function(res) {
				if(succCallback){
					succCallback.call(this,res);
				}
			},
			cancel : function(res) {
				if(cancelCallback){
					cancelCallback.call(this,res);
				}
			},
			fail : function(res) {
				if(failCallback){
					failCallback.call(this,res);
				}else{
					if(weixinShare.errPopBox){
						weixinShare.errPopBox.call(this,res);
					}
				}
			}
		});
		////alert("分享到腾讯微博 finished");
		//分享到QQ空间
		wx.onMenuShareQZone({
			title :config.title,
			desc : config.desc,
			link : shortUrl,
			imgUrl : imgUrl_,
			trigger : function(res) {
				if(triggerCallback){
					triggerCallback.call(this,res);
				}
			},
			success : function(res) {
				if(succCallback){
					succCallback.call(this,res);
				}
			},
			cancel : function(res) {
				if(cancelCallback){
					cancelCallback.call(this,res);
				}
			},
			fail : function(res) {
				if(failCallback){
					failCallback.call(this,res);
				}else{
					if(weixinShare.errPopBox){
						weixinShare.errPopBox.call(this,res);
					}
				}
			}
		});
		////alert("分享到QQ空间 finished");
	});
};

weixinShare.pageShareLog = function(shareType,shareUrl,shareMode){
	$.ajax({
		url : ctx + "/page/pageShareLog.ajax",
		type : "post",
		cache : false,
		dataType : "json",
		data : {
			"shareType" : shareType,
			"shareMode" : shareMode,
			"shareUrl" : shareUrl,
			"activityId" : activityId,
			"contentId" : "",
			"prodId" : "",
			"channelId" : "",
			"storeId" : "",
			"salesId" : "",
			"reserver1" : "",
			"reserver2" : ""
		},
		success:function(resp){
			if (!resp.isSuccess) {
				// 出错
				msgBoxShow(resp.msg);
				return;
			}
			var jsonData = eval('(' + resp.data + ')');
		}
	});
}
