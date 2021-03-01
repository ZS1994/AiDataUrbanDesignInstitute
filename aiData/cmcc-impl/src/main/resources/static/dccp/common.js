function Common(){
	
}

// 用于日志统计用
var logStastic = {};
	logStastic.prevItem = "";
	logStastic.visitLogId = "";
	
/**
 * 广告栏广告查询接口（queryAdClmnAd）
 */
Common.queryAdClmnAd = function(adClmnId,succCallback) {
	$.ajax({
		url : ctx+ "/ad/queryAd.ajax",
		/*url : ctx+ "/guangdong/js/rcmd/ads.json",*/
		type : "POST",
		cache : false,
		dataType : "json",		
		data : {
			"adClmnId" : adClmnId,
			"cityId": 0
		},
		 
		success : function(resp) {
			if (!resp.isSuccess) {
				// 出错
				$("#orderTips").text(resp.msg);
				showPopBoxNew(5);
				return;
			}
			var jsonData = eval('(' + resp.data + ')');
			/*var dt=JSON.stringify(resp.data);
			var jsonData = JSON.parse(dt);*/
			if(succCallback){
				succCallback.call(this,jsonData,adClmnId);
				return;
			}
		}
	});

};
/**
 * 2.4.13 收藏/取消收藏接口（favoritesAddOrCancel）
 */
Common.favoritesAddOrCancel = function(operType,objType,objIId,succCallback) {
	$.ajax({
		url : ctx+ "/content/favoritesAddOrCancel.ajax",
		type : "POST",
		cache : false,
		dataType : "json",		
		data : {
			"operType" : operType,
			"objType" : objType,
			"objIId" : objIId
		},
		 
		success : function(resp) {
			if (!resp.isSuccess) {
				// 出错
				$("#orderTips").text(resp.msg);
				showPopBoxNew(5);
				return;
			}
			var jsonData = eval('(' + resp.data + ')');
			if(succCallback){
				succCallback.call(this,jsonData,objIId,operType);
				return;
			}
		}
	});

};


/**
 * 2.4.10 用户标签分类查询
 * @author was
 * @create 20170712
 * @param callback
 */
Common.queryUserLabelCatList=function(callback){
	var url=ctx+"/my/queryUserLabelCatList.ajax";
	$.ajax({
		url : url,
		type : "POST",
		cache : false,
		dataType : "json",
/*		data : {
			"activityId" : activityId
		},*/
		success : function(resp) {
			if (!resp.isSuccess) {
				// 出错
				$("#orderTips").text(resp.msg);
				showPopBoxNew(5);
				return;
			}
			var jsonData = eval('(' + resp.data + ')');
			if(callback){
				callback.call(this,jsonData);
			}
		}
	});

};

/**
 * 用户标签提交
 * @author was
 * @create 20170713
 * @param callback
 */
Common.userLabelSubmit=function(array,callback){
	var url=ctx+"/my/userLabelSubmit.ajax";
	$.ajax({
		url : url,
		type : "POST",
		cache : false,
		dataType : "json",
		data : {
			"catIds" : array
		},
		traditional: true,//这里设置为true
		success : function(resp) {
			if (!resp.isSuccess) {
				// 出错
				$("#orderTips").text(resp.msg);
				showPopBoxNew(5);
				return;
			}
			var jsonData = eval('(' + resp.data + ')');
			if(callback){
				callback.call(this,jsonData);
			}
		}
	});

};

/**
 * 查询用户收藏列表
 * @author was
 * @create20170714
 * @param return
 */
Common.queryUserFavoritesList=function(objType,pageNo,callback){
	var url=ctx+"/my/queryUserFavoritesList.ajax";
	$.ajax({
		url : url,
		type : "POST",
		cache : false,
		dataType : "json",
		data : {
			"objType" : objType,
			"pageNo":pageNo,
			"pageSize":pageSize
			
		},
		success : function(resp) {
			if (!resp.isSuccess) {
				// 出错
				$("#orderTips").text(resp.msg);
				showPopBoxNew(5);
				return;
			}
			var jsonData = eval('(' + resp.data + ')');
			if(callback){
				callback.call(this,jsonData);
			}
		}
	});

};
//统计方法
//统计用户访问网站页面时间  
var timeLength = 0;
var firstVisit = 0;
//定时增加时间  
window.setInterval(function() {  
	timeLength++;
},1000);  
//获取随机的时间  
var tjRandom = (new Date()).valueOf(); 
//reserver1:用作所选择渠道类型下的活动ID
Common.pageVisitLogMethod=function(pageType,pageId,pageUrl,channelId,clmnId,longUrl,contentType,ssoTagetId,reserver1,visitTime,operType,visitLogId){
	/*if(timeLength > 0 || (firstVisit == 0)){
		if (firstVisit == 0){
			firstVisit +=1;
			operType = "A";  //日志操作类型：A新增，U更新
		}
	
	$.ajax({
		url : ctx+"/content/pageVisitLog.ajax",
		type : "POST",
		cache : false,
		dataType : "json",		
		data : {
			"pageType" : pageType,
			"pageId" : pageId,
			"pageUrl" : pageUrl,
			"visitTime" : Date.parse(new Date()) - (timeLength * 1000),
			"endTime" : Date.parse(new Date()),
			"timeLength" : timeLength,
			"channelId" : channelId,
			"clmnId" : clmnId,
			"operType" : operType,
			"visitLogId" : visitLogIdOri,
			"reserver1" : reserver1
		},
		success : function(resp) {
			if (!resp.isSuccess) {
				// 出错
				$("#orderTips").text(resp.msg);
				showPopBoxNew(5);
				return;
			}
			var jsonData = eval('(' + resp.data + ')');
			if(jsonData){
				visitLogId = jsonData.visitLogId;
				visitTime = jsonData.visitTime;
				alert(visitLogId+"--"+visitTime);
			}
			if(longUrl!=null && longUrl!=""){
				skipMiGuUrl(longUrl,contentType,ssoTagetId);
			}
			
		}
	});
	timeLength = 0;
  }*/
	
	// 重新改造
	var  callBack = function(jsonData){
		logStastic.visitLogId = jsonData.visitLogId;
	};
	
	if(firstVisit == 0){
		firstVisit +=1;
		logStastic.prevItem = pageType;
		Common.pageVisitLog(pageType, pageId, pageUrl, visitTime, channelId, clmnId, reserver1, 'A',"", callBack);
	}else{
		// 更新旧日志.日志操作类型：A新增，U更新
		Common.pageVisitLog(logStastic.prevItem, pageId, pageUrl, visitTime, channelId, clmnId, reserver1, 'U', logStastic.visitLogId);
		// 新增新日志
		logStastic.prevItem = pageType;
		Common.pageVisitLog(pageType, pageId, pageUrl, visitTime, channelId, clmnId, reserver1, 'A',"",callBack);
	}
	
};
Common.pageVisitLog=function(pageType,pageId,pageUrl,visitTime,channelId,clmnId,reserver1,operType,visitLogId,succCallback,reserver2,timeLen){
	var sendVisitTime;
	if(visitTime!=null && visitTime!="" && visitLogId!=null && visitLogId!=""){
		sendVisitTime= visitTime;
	}else{
		sendVisitTime= Date.parse(new Date());
	}
	var time = timeLength;
	if(timeLen !== undefined && timeLen !== null && timeLen !== ""){
		time = timeLen;
	}
	$.ajax({
		url : ctx+"/pageVisitLog.ajax",
		type : "POST",
		cache : false,
		dataType : "json",		
		data : {
			"pageType" : pageType,
			"pageId" : pageId,
			"pageUrl" : pageUrl,
			"visitTime" : sendVisitTime,
			"endTime" : Date.parse(new Date()),
			"timeLength" : time,
			"channelId" : channelId,
			"clmnId" : clmnId,
			"reserver1" : reserver1,
			"reserver2" : reserver2,
			"operType" : operType,
			"visitLogId" : visitLogId
		},
		success : function(resp) {
			if (!resp.isSuccess) {
				// 出错
				msgBoxShow(resp.msg);
				return;
			}
			var jsonData = eval('(' + resp.data + ')');
			if(succCallback){
				succCallback.call(this,jsonData);
			}
		}
	});
	timeLength = 0;
};
Common.urlJieQu=function(url){
	if(url.indexOf("http://")==0){
  		url=url.substr(7);
  	}else{
		url=url.substr(8);
  	}
	return url;
};

/**
 * 获取url上的参数
 * @param name
 * @returns {*}
 */
Common.getUrlParam=function(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return decodeURIComponent(r[2]); return null;
};
//2.3.5	页面分享及分享访问日志接口（pageShareLog）
Common.pageShareLog=function(shareMsisdn,accessMsisdn,shareType,shareMode,shareUrl,
		activityId,contentId,prodId,channelId,storeId,salesId,reserver1,reserver2,succCallback){
	$.ajax({
		url : ctx+"/page/pageShareLog.ajax",
		type : "POST",
		cache : false,
		dataType : "json",
		data : {
			"shareMsisdn" : shareMsisdn,
			"accessMsisdn" : accessMsisdn,
			"shareType" : shareType,
			"shareMode" : shareMode,
			"shareUrl" : shareUrl,
			"activityId" : activityId,
			"contentId" : contentId,
			"prodId" : prodId,
			"channelId" : channelId,
			"storeId" : storeId,
			"salesId" : salesId,
			"reserver1" : reserver1,
			"reserver2" : reserver2
		},
		success : function(resp) {
			if (!resp.isSuccess) {
				// 出错
				msgBoxShow(resp.msg);
				return;
			}
			var jsonData = eval('(' + resp.data + ')');
			if(succCallback){
				succCallback.call(this,jsonData);
			}
		}
	});	
};
/**
 * (通用)分享页面点击统计
 * @param shareMsisdn 分享手机号
 * @param isExecute 是否一定执行
 * 			true:是
 * 			其他:否
 */
Common.pageShareVisitStatistics=function(shareMsisdn,isExecute){
	var shareMode=Common.getUrlParam("shareMode");
	if(isExecute){
		shareMode="0";
	}
	if(shareMode=="0"){
		//普通访问
		var accessMsisdn="";
		var shareType="0";
		var shareUrl=window.location.href;
		var activityId=Common.getUrlParam("activityId");
		var contentId=Common.getUrlParam("contentId");
		var prodId=Common.getUrlParam("prodId");
		var channelId=Common.getUrlParam("channelId");
		var storeId=Common.getUrlParam("storeId");
		var salesId="";
		var reserver1="";
		var reserver2="";
		Common.pageShareLog(shareMsisdn,accessMsisdn,shareType,shareMode,shareUrl,
				activityId,contentId,prodId,channelId,storeId,salesId,reserver1,reserver2,null);
	}
};
Common.isNotBlank=function(msg){
	if(msg==undefined){
		return false;
	}else if(msg==null){
		return false;
	}else if(msg==""){
		return false;
	}else{
		return true;
	}
};
Common.isBlank=function(msg){
	if(msg==undefined){
		return true;
	}else if(msg==null){
		return true;
	}else if(msg==""){
		return true;
	}else{
		return false;
	}
};

Common.partitionLog = function(source, srcId) {
    if(srcId == undefined || srcId == "null" || srcId == "") {
        srcId = null;
    }
    $.ajax({
        url : ctx + "/partitionLog.ajax",
        type : "POST",
        cache : false,
        dataType : "json",
        data : {
            "source" : source,
            "srcId" : srcId
        },
        success : function(resp) {
        },
        error: function(err) {
        }
    });
};


/**
 * 获取当前地址
 * @returns
 */
function getCurrLink(){
	return window.location.href;
}
//获取随机数0-1
function getRandom(){
	var array = new Uint32Array(1);
	window.crypto.getRandomValues(array);
	var randomNum=array[0]+"";
	if(randomNum.length<10){
		var cha=10-randomNum.length;
		for(var x=0;x<cha;x++){
			randomNum+="0";
		}
	}
	return Number(randomNum)/10000000000;
}


Common.pageAccessLog=function(channelId,pageId,pageName,versionId,versionName,moduleId,moduleName
		,pointId,pointName,event,operType,logId,pageUrl,pageReferer
		,reserver1,reserver2,reserver3,reserver4,reserver5,reserver6,endTime,timeLength){
	
	var time = 0;
	if(timeLength !== undefined && timeLength !== null && timeLength !== ""){
		time = timeLength;
	}
	$.ajax({  
		url : ctx+"/pageAccessLog.ajax",
		type : "POST",
		cache : false,
		dataType : "json",		
		data : {
			"channelId" : channelId,
			"pageId" : pageId,
			"pageName" : pageName,
			"versionId" : versionId,
			"versionName" : versionName,
			"moduleId" : moduleId,
			"moduleName" : moduleName,
			"pointId" : pointId,
			"pointName" : pointName,
			"event" : event,
			"operType" : operType,
			"logId" : logId,
			"pageUrl" : pageUrl,
			"pageReferer" : pageReferer,
			"visitTime" : formatDate(new Date()),
			"reserver1" : reserver1,
			"reserver2" : reserver2,
			"reserver3" : reserver3,
			"reserver4" : reserver4,
			"reserver5" : reserver5,
			"reserver6" : reserver6,
			"endTime" : endTime,
			"timeLength" : timeLength
		},
		success : function(resp) {
			if (!resp.isSuccess) {
				// 出错
				msgBoxShow(resp.msg);
				return;
			}
			var jsonData = eval('(' + resp.data + ')');
			/*if(succCallback){
				succCallback.call(this,jsonData);
			}*/
		}
	});
	timeLength = 0;
};

function formatDate(date) {
    if(!date){
      return "";
    }
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
  }