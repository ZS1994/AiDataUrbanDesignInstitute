/**
 * @author zhaohaiyang
 * 
 */
function Login() {
	this.basePath_ = window.ctxPaths || window.ctx;
	this.userLoginPath_ = this.basePath_ + "/my/userLogin.ajax";
	this.sendSmsCodePath_ = this.basePath_ + "/my/sendSmsCode.ajax";
	this.mbrRegisterPath_ = this.basePath_ + "/my/mbrRegister.ajax";
	this.changeMbrPwdPath_ = this.basePath_ + "/my/changeMbrPwd.ajax";

}
Login.prototype.isSendingSmsCode=false;
/**
 * @author zhaohaiyang
 * 
 */
Login.prototype.sendSmsCode = function(loginTel, smsCodeType,changCssMethod) {
	that = this;
	that.isSendingSmsCode=true;
	$.ajax({
		url : that.sendSmsCodePath_,
		type : "POST",
		cache : false,
		dataType : "json",
		data : {
			"loginTel" : loginTel,
			"smsCodeType" : smsCodeType,
			"implClass":"gdAuthSmsCodeService"
		},
		success : function(resp) {
			if(changCssMethod){
				changCssMethod.call(this,resp);
				return;
			}
			that.isSendingSmsCode=false;
			var jsonData = eval('(' + resp.data + ')');
			var errorMsg = messageUtil.getMessage("MSG_999999");
			if (jsonData == null || !resp.isSuccess) {
				errorMsg = resp.msg;
			} 
			else {
				var code = jsonData.retCode;
				if ("010001" == code) {
					errorMsg = messageUtil.getMessage("MSG_010001").replace("{0}", jsonData.interval);
					wait = parseInt(jsonData.interval);
					time();
				} else if ("010002" == code) {
					errorMsg = messageUtil.getMessage("MSG_010002").replace("{0}", jsonData.timeLimit);
				} else if ("010003" == code) {
					errorMsg = messageUtil.getMessage("MSG_010003");
				} else if ("0" == code) {
					wait = parseInt(jsonData.interval);
					if(changCssMethod == undefined || changCssMethod == null){
						time();
					}else{
						timeChangCss("",changCssMethod);
					}
					msgHideTips();
					return;
				} else if ("000002" == code) {
					errorMsg = messageUtil.getMessage("MSG_000002");
				} else if ("000003" == code) {
					errorMsg = messageUtil.getMessage("MSG_000003");
				}
			}
			msgShowTips(errorMsg);
		},
		error : function(resp) {
			that.isSendingSmsCode=false;
			msgShowTips(messageUtil.getMessage("MSG_999999"));
		}
	});
}

/**
 * @author zhaohaiyang
 * 
 */
Login.prototype.userLogin = function(loginTel, loginType, password, messageNew, callback, donotShowTips, failCallback) {
	that = this;

	var param="";
	if(loginType == 6){
		param={
			"loginTel" : loginTel,
			"loginType" : loginType,
			"password" : password,
			"sharedTelnumber" : "",
			"contentId" : "",
			"prodId" : "",
			"implClass":"gdAuthSmsCodeService"
		};
	}else if(loginType==5){
		param={
			"loginTel" : loginTel,
			"message" :messageNew,
			"loginType" : loginType,
			"password" : password,
			"sharedTelnumber" : "",
			"contentId" : "",
			"prodId" : ""
		};
	}
	$.ajax({
		url : that.userLoginPath_,
		type : "POST",
		cache : false,
		dataType : "json",
		data : param,
		success : function(resp) {
			var jsonData = eval('(' + resp.data + ')');
			var errorMsg = messageUtil.getMessage("MSG_999999");
			if (!resp.isSuccess) {
				errorMsg = resp.msg;
			} else {
				var code = jsonData.retCode;
				if ("020001" == code) {
					errorMsg = messageUtil.getMessage("MSG_020001").replace("{0}", jsonData.errTimes);
				} else if ("020002" == code) {
					errorMsg = messageUtil.getMessage("MSG_020002").replace("{0}", jsonData.errTimes)
							.replace("{1}", jsonData.lockTimes);
				} else if ("020003" == code) {
					errorMsg = messageUtil.getMessage("MSG_020003").replace("{0}", jsonData.errTimes);
				} else if ("020004" == code) {
					errorMsg = messageUtil.getMessage("MSG_020004");
				} else if ("020010" == code) {
					errorMsg = messageUtil.getMessage("MSG_020010").replace("{0}", jsonData.errTimes)
							.replace("{1}", jsonData.lockTimes);
				} else if ("0" == code) {
					if(callback != undefined && callback != null && callback != '' && typeof callback == "function"){
						callback.call(this,jsonData);
					}
					else{
						defaultUserLoginCallback();
					}
					return;
				} else if ("000002" == code) {
					errorMsg = messageUtil.getMessage("MSG_000002");
				} else if ("000003" == code) {
					errorMsg = messageUtil.getMessage("MSG_000003");
				}
			}
			if(donotShowTips == undefined || (donotShowTips != undefined && !donotShowTips)){
				msgShowTips(errorMsg);
			}
			if(failCallback != undefined && failCallback != null && failCallback!=""){
				failCallback.call(this,jsonData);
			}
		},
		error : function(resp) {
			if(donotShowTips == undefined || (donotShowTips != undefined && !donotShowTips)){
				msgShowTips(messageUtil.getMessage("MSG_999999"));
			}
			if(failCallback != undefined && failCallback != null && failCallback!=""){
				failCallback.call(this,jsonData);
			}
		}
	});
}



/**
 * @author zhaohaiyang
 * 
 */
Login.prototype.mbrRegister = function(loginTel, smsCode, password) {
	that = this;

	$.ajax({
		url : that.mbrRegisterPath_,
		type : "POST",
		cache : false,
		dataType : "json",
		data : {
			"loginTel" : loginTel,
			"smsCode" : smsCode,
			"password" : password
		},
		success : function(resp) {
			var jsonData = eval('(' + resp.data + ')');
			var errorMsg = messageUtil.getMessage("MSG_999999");
			if (!resp.isSuccess) {
				errorMsg = resp.msg;
			} else {
				var code = jsonData.retCode;
				if ("020003" == code) {
					errorMsg = messageUtil.getMessage("MSG_020003").replace("{0}", jsonData.errTimes);
				} else if ("020004" == code) {
					errorMsg = messageUtil.getMessage("MSG_020004");
				} else if ("020005" == code) {
					errorMsg = messageUtil.getMessage("MSG_020005");
				} else if ("020006" == code) {
					errorMsg = messageUtil.getMessage("MSG_020006");
				} else if ("020010" == code) {
					errorMsg = messageUtil.getMessage("MSG_020010").replace("{0}", jsonData.errTimes)
							.replace("{1}", jsonData.lockTimes);
				} else if ("0" == code) {
					msgBoxShow(messageUtil.getMessage("MSG_PAGE_00010"));
					html = window.ctxPaths + "/login.ajax";
					return;
				} else if ("000002" == code) {
					errorMsg = messageUtil.getMessage("MSG_000002");
				} else if ("000003" == code) {
					errorMsg = messageUtil.getMessage("MSG_000003");
				}
			}
			msgBoxShow(errorMsg);
		},
		error : function(resp) {
			msgBoxShow(messageUtil.getMessage("MSG_999999"));
		}
	});
}

/**
 * @author zhaohaiyang
 * 
 */
Login.prototype.changeMbrPwd = function(loginTel, smsCode, password) {
	that = this;

	$.ajax({
		url : that.changeMbrPwdPath_,
		type : "POST",
		cache : false,
		dataType : "json",
		data : {
			"loginTel" : loginTel,
			"smsCode" : smsCode,
			"password" : password
		},
		success : function(resp) {
			var jsonData = eval('(' + resp.data + ')');
			var errorMsg = messageUtil.getMessage("MSG_999999");
			if (!resp.isSuccess) {
				errorMsg = resp.msg;
			} else {
				var code = jsonData.retCode;
				if ("020003" == code) {
					errorMsg = messageUtil.getMessage("MSG_020003").replace("{0}", jsonData.errTimes);
				} else if ("020004" == code) {
					errorMsg = messageUtil.getMessage("MSG_020004");
				} else if ("020007" == code) {
					errorMsg = messageUtil.getMessage("MSG_020007");
				} else if ("020008" == code) {
					errorMsg = messageUtil.getMessage("MSG_020008");
				} else if ("020010" == code) {
					errorMsg = messageUtil.getMessage("MSG_020010").replace("{0}", jsonData.errTimes)
							.replace("{1}", jsonData.lockTimes);
				} else if ("0" == code) {
					msgBoxShow(essageUtil.getMessage("MSG_PAGE_00011"));
					html = "./my.ajax";
					return;
				} else if ("000002" == code) {
					errorMsg = messageUtil.getMessage("MSG_000002");
				} else if ("000003" == code) {
					errorMsg = messageUtil.getMessage("MSG_000003");
				}
			}
			msgBoxShow(errorMsg);
		},
		error : function(resp) {
			msgBoxShow(messageUtil.getMessage("MSG_999999"));
		}
	});
}

/**
 * @author zhaohaiyang
 * 
 */
Login.prototype.forgetPwd = function(loginTel, smsCode, password) {
	that = this;

	$.ajax({
		url : that.changeMbrPwdPath_,
		type : "POST",
		cache : false,
		dataType : "json",
		data : {
			"loginTel" : loginTel,
			"smsCode" : smsCode,
			"password" : password
		},
		success : function(resp) {
			var jsonData = eval('(' + resp.data + ')');
			var errorMsg = messageUtil.getMessage("MSG_999999");
			if (!resp.isSuccess) {
				errorMsg = resp.msg;
			} else {
				var code = jsonData.retCode;
				if ("020003" == code) {
					errorMsg = messageUtil.getMessage("MSG_020003").replace("{0}", jsonData.errTimes);
				} else if ("020004" == code) {
					errorMsg = messageUtil.getMessage("MSG_020004");
				} else if ("020007" == code) {
					errorMsg = messageUtil.getMessage("MSG_020007");
				} else if ("020008" == code) {
					errorMsg = messageUtil.getMessage("MSG_020008");
				} else if ("020010" == code) {
					errorMsg = messageUtil.getMessage("MSG_020010").replace("{0}", jsonData.errTimes)
							.replace("{1}", jsonData.lockTimes);
				} else if ("0" == code) {
					msgBoxShow(messageUtil.getMessage("MSG_PAGE_00011"));
					html = window.ctxPaths + "/login.ajax";
					return;
				} else if ("000002" == code) {
					errorMsg = messageUtil.getMessage("MSG_000002");
				} else if ("000003" == code) {
					errorMsg = messageUtil.getMessage("MSG_000003");
				}
			}
			msgBoxShow(errorMsg);
		},
		error : function(resp) {
			msgBoxShow(messageUtil.getMessage("MSG_999999"));
		}
	});
};

/**
 * 默认用户登录回调函数
 */
function defaultUserLoginCallback()
{
	msgHideTips();
	closePopBox();
	// 登录成功，将登录状态改为0
	if(loginStatus != undefined){
		loginStatus = "0";
	}
	if("" == backURL || null == backURL || undefined == backURL || 'null' == backURL){
		top.location.href = window.location.href;
	}else{
		top.location.href = backURL;
	}
}

$(function(){
	login = new Login();
});