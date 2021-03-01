package com.zs.aidata.cmcc.gmcc.service;

import com.alibaba.fastjson.JSONObject;
import com.zs.aidata.core.tools.BaseCoreService;
import com.zs.aidata.cmcc.gmcc.vo.GmccOutVO;
import com.zs.aidata.cmcc.gmcc.vo.SysDoAjaxVO;

import javax.inject.Inject;
import javax.inject.Named;
import java.util.HashMap;
import java.util.Map;

/**
 * 【东莞】0元10G流量特惠包+和彩云网盘
 * * 10GB国内通用流量+200G和彩云网盘空间
 *
 * @author 张顺
 * @since 2020/11/8
 */
@Named
public class GmccAppService_DW_0RMB_10G extends BaseCoreService implements IGmccAppService_DW_0RMB_10G {

    @Inject
    private IGmccAppService iGmccAppService;


    @Override
    public GmccOutVO getProdToken(String phone, String smsCode) throws Exception {
        SysDoAjaxVO doAjaxVO = new SysDoAjaxVO();
        doAjaxVO.setService("login");
        doAjaxVO.setServicePath(SERVICE_NAME_GMCCAPP_000_000_001_010);
        Map<String, Object> jsonData = new HashMap<>();
        jsonData.put("mobileNumber", phone);
        jsonData.put("bussnissId", "singleProd");
        jsonData.put("identifyingCode", "9vcsyp");
        jsonData.put("password", smsCode);
        doAjaxVO.setJsonData(jsonData);
        String res = iGmccAppService.sysDoAjax(doAjaxVO);
        JSONObject jsonRes = JSONObject.parseObject(res);

        GmccOutVO out = new GmccOutVO();
        out.setData(jsonRes.getString("prodToken"));
        out.setResult(jsonRes.getString("result"));
        out.setDesc(jsonRes.getString("desc"));
        return out;
    }

    @Override
    public void getPicCode() throws Exception {
        /**
         * servicename: 'GMCCAPP_000_000_001_009',
         * 	picCode: function() {
         * 		this.setCode = $('.yanzheng1').val().toLowerCase();
         * 		this.VERIFYCODE = Utils.cookie.get('VERIFYCODE');
         * 		if (this.setCode.length == 6) {
         * 			if (this.VERIFYCODE !== md5(this.setCode)) {
         * 				$('#error2').show();
         * 				$('#error2 span').html('图形验证码错误');
         * 				$('.yanzheng1').addClass('errorLine');
         * 				phoneNumber.code1 = false;
         * 				phoneNumber.comm();
         *                        } else {
         * 				phoneNumber.code1 = true;
         * 				phoneNumber.comm();
         *            }* 		} else {
         * 			phoneNumber.code1 = false;
         * 			$('#error2').hide();
         * 			$('.yanzheng1').removeClass('errorLine');
         * 			phoneNumber.comm();
         *        }
         *    },
         */

        SysDoAjaxVO doAjaxVO = new SysDoAjaxVO();
        doAjaxVO.setService("login");
        doAjaxVO.setServicePath("identifyingCode");
        Map<String, Object> jsonData = new HashMap<>();
        jsonData.put("bussnissId", "singleProd");
        jsonData.put("id", iGmccAppService.getRandom(18));
        doAjaxVO.setJsonData(jsonData);
        String result = iGmccAppService.sysDoAjax(doAjaxVO);



    }
}
