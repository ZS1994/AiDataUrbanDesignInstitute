package com.zs.aidata.cmcc.gmcc.service;

import com.zs.aidata.cmcc.gmcc.vo.GmccOutVO;

/**
 * 【东莞】0元10G流量特惠包+和彩云网盘
 * 10GB国内通用流量+200G和彩云网盘空间
 *
 * @author 张顺
 * @since 2020/11/8
 */
public interface IGmccAppService_DW_0RMB_10G {

    // 获取sessionid
    String SERVICE_NAME_GMCCAPP_000_000_000_000 = "GMCCAPP_000_000_000_000";

    String SERVICE_NAME_GMCCAPP_000_000_002_006 = "GMCCAPP_000_000_002_006";
    // 获取 prodId
    String SERVICE_NAME_GMCCAPP_620_006_001_001 = "GMCCAPP_620_006_001_001";
    String SERVICE_NAME_GMCCAPP_410_009_001_001 = "GMCCAPP_410_009_001_001";
    // 获取短信验证码
    String SERVICE_NAME_GMCCAPP_000_000_001_009 = "GMCCAPP_000_000_001_009";
    // 获取 prodToken
    String SERVICE_NAME_GMCCAPP_000_000_001_010 = "GMCCAPP_000_000_001_010";
    // 验证
    String SERVICE_NAME_GMCCAPP_620_006_001_002 = "GMCCAPP_620_006_001_002";
    // 办理业务
    String SERVICE_NAME_GMCCAPP_620_006_001_003 = "GMCCAPP_620_006_001_003";
    String SERVICE_NAME_GMCCAPP_620_006_001_004 = "GMCCAPP_620_006_001_004";


    /**
     * 获取 prodToken
     *
     * @param phone
     * @param smsCode
     * @return
     */
    GmccOutVO getProdToken(String phone, String smsCode) throws Exception;


    /**
     * 获取图形验证码
     */
    void getPicCode() throws Exception;
}
