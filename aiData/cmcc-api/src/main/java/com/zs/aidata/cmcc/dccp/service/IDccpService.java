package com.zs.aidata.cmcc.dccp.service;

import com.zs.aidata.cmcc.dccp.vo.DccpOutVO;

/**
 * 和彩云
 *
 * @author 张顺
 * @since 2020/10/18
 */
public interface IDccpService {

    // 发送验证码
    String URL_SEND_SMS_CODE = "http://gd.dccp.liuliangjia.cn/dccp-portal/my/sendSmsCode.ajax";
    // 登录
    String URL_LOGIN = "http://gd.dccp.liuliangjia.cn/dccp-portal/my/sendSmsCode.ajax";
    // 10元2T
    String URL_PRODUCT_10RMB_2T = "http://gd.dccp.liuliangjia.cn/dccp-portal/service/serviceSubscribe.ajax";

    String LZY_PHONE = "13502898808";
    String ZS_PHONE = "15022084174";

    DccpOutVO sendSmsCode(String tel);



}
