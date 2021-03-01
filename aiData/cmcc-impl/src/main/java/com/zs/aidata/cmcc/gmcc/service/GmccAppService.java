package com.zs.aidata.cmcc.gmcc.service;

import com.alibaba.fastjson.JSONObject;
import com.zs.aidata.core.tools.BaseCoreService;
import com.zs.aidata.core.tools.RestTemplateUtils;
import com.zs.aidata.cmcc.gmcc.vo.GmccOutVO;
import com.zs.aidata.cmcc.gmcc.vo.SessionidRequestVO;
import com.zs.aidata.cmcc.gmcc.vo.SysDoAjaxVO;
import com.zs.aidata.core.tools.Constans;
import com.zs.aidata.core.tools.ValueUtils;
import lombok.extern.slf4j.Slf4j;

import javax.inject.Named;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 广东移动
 *
 * @author 张顺
 * @since 2020/10/18
 */
@Slf4j
@Named
public class GmccAppService extends BaseCoreService implements IGmccAppService {

//    @Inject
//    private IBasUserSessionDao iBasUserSessionDao;


    public static void main(String[] args) throws Exception {
//        GmccAppService dccpService = new GmccAppService();
//        dccpService.getVerificationCode("734d900f83cda193f8407a5fda1e01d0ce1854158dcc2cfac62ef51ad0a442bc3689c4a885a8bac0ce51f7f57a6d9bd88e3ad3bb6d39c55c2acb3d9eadb5a45c65b718629a59fc5f7c4f0131adcf7b8fb08ae59d1420d82ce3284c5cfa4d18ce36fa22e61a7834b9bb4024c0f02b5f4f96f1a5575079c885a33fcaaf774ceeac391c17940e2b8a5b72554befc820c6cb3d814bf92b21d173f11f25ac8fe986973c9284f08f85a8f07279850a4f24ccf5a6dc4ae84f446240f71b2d0aec364cf2521ed2b2b4f6bb3ad0a0a1ce18a587e6df9e22625be988a1cb047668b532adb75bc394eff223cb165205fed8bfb6652eacc5835f7253c7ed607cc09e92fd34bb");
//        String r = dccpService.randomCode();
//        log.debug(r);
//        dccpService.sessionidRequest(null);
//        dccpService.getVerificationCode("13502898808", BUSSNISSID_LOGIN);
//        dccpService.login("13502898808", "633237");
    }


    @Override
    public GmccOutVO sendSmsCode(String phone) throws Exception {
        SysDoAjaxVO doAjaxVO = new SysDoAjaxVO();
        doAjaxVO.setService("login");
        doAjaxVO.setServicePath("GMCCAPP_000_000_001_009");
        Map<String, Object> jsonData = new HashMap<>();
        jsonData.put("mobileNumber", phone);
        jsonData.put("bussnissId", BUSSNISSID_SEND_SMD_CODE);
        doAjaxVO.setJsonData(jsonData);
        String res = sysDoAjax(doAjaxVO);
        JSONObject jsonRes = JSONObject.parseObject(res);
        return jsonRes.toJavaObject(GmccOutVO.class);
    }

    @Override
    public String sysDoAjax(SysDoAjaxVO inVo) throws Exception {
        // 默认值
        if (inVo == null) {
            inVo = new SysDoAjaxVO();
        }
        if (inVo.getMethod() == null) {
            inVo.setMethod("POST");
        }
        if (inVo.getJsonData() == null) {
            inVo.setJsonData(new HashMap<>());
        }
        if (inVo.getHeader() == null) {
            inVo.setHeader(new HashMap<>());
        }
        if (inVo.getTimeout() == 0) {
            inVo.setTimeout(100000);
        }

        Map<String, String> hDefault = new HashMap<>();
        hDefault.put("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        Map<String, String> h = new HashMap<>();
        h.putAll(inVo.getHeader());
        h.putAll(hDefault);

        String url = "serviceValue/serviceKey/".replace("serviceValue", PATH).replace("serviceKey", inVo.getService());
        String sessionid = "";
        // 张顺，2020-10-26 01:02:54，这里通过标记来判断是否需要sessionid，目前只有获取sessionid时可以传Y
        if (Constans.FLAG_Y.equals(inVo.getWithoutSessionidFlag())) {
            sessionid = "";
        } else {
            sessionid = getSessionid();
        }
        Map<String, String> params = new HashMap<>();
        params.put("servicename", inVo.getServicePath());
        params.put("sessionid", sessionid);

        String urlP = createUrl(url, params);
        String nonce = randomCode();
        long timestamp = new Date().getTime();
        String sign = sessionid + "," + nonce + "," + timestamp;
        Map<String, String> headerP = new HashMap<>();
        headerP.put("nonce", nonce);
        headerP.put("timestamp", timestamp + "");
        headerP.put("sign", ValueUtils.getMD5Str(sign).toUpperCase());

        inVo.getJsonData().put("header", headerP);

        String reqJson = JSONObject.toJSONString(inVo.getJsonData()).replaceAll("/\\+ / g", "%2B");
        reqJson = reqJson.replaceAll("/\\&/g", "%26");

        Map<String, String> data = new HashMap<>();
        data.put("reqJson", reqJson);

        String responseStr = RestTemplateUtils.execHttpRequest(urlP, inVo.getMethod(), data, h);
        return responseStr;
    }


    /**
     * 生成链接url，params
     */
    private String createUrl(String serviceURL, Map<String, String> obj) {
        String url = serviceURL + "?";
        for (String key : obj.keySet()) {
            url += key + '=' + obj.get(key) + '&';
        }
        return url.substring(0, url.lastIndexOf('&'));
    }


    @Override
    public String getSessionid() throws Exception {
        Object sessionid = ValueUtils.getRequest().getAttribute(Constans.KEY_GMCC_SESSION_ID);
        if (isEmpty(sessionid)) {
            String sessionRes = sessionidRequest(null);
            return sessionRes;
        } else {
            return sessionid.toString();
        }
    }

    @Override
    public void setSessionid(String sessionid) {
        ValueUtils.getRequest().setAttribute(Constans.KEY_GMCC_SESSION_ID, sessionid);
    }

    @Override
    public String sessionidRequest(SessionidRequestVO inVo) throws Exception {
        // 入参默认值设置
        String method = "POST";
        String service = "autologin";
        Map<String, Object> jsonData = new HashMap<>();
        Map<String, String> header = new HashMap<>();
        int timeout = 100000;
        if (isNotEmpty(inVo)) {
            if (isNotEmpty(inVo.getMethod())) {
                method = inVo.getMethod();
            }
            if (isNotEmpty(inVo.getService())) {
                service = inVo.getService();
            }
            if (isNotEmpty(inVo.getJsonData())) {
                jsonData = inVo.getJsonData();
            }
            if (isNotEmpty(inVo.getHeader())) {
                header = inVo.getHeader();
            }
        }

        Map<String, Object> data = new HashMap<>();
        jsonData.put("equipmentNo", "WEB");
        jsonData.put("mobileSystem", "WEB");
        jsonData.put("mobileType", "WEB");
        jsonData.put("mobileView", "WEB");
        jsonData.put("appVersion", "5.4.0");
        jsonData.put("channelId", "gmccweb");
        jsonData.put("distribution", "WEB");
        jsonData.put("appId", getRandom(32));
        jsonData.put("appUid", getRandom(32));
        data.putAll(jsonData);

        SysDoAjaxVO doAjaxVO = new SysDoAjaxVO();
        doAjaxVO.setMethod(method);
        doAjaxVO.setService(service);
        doAjaxVO.setServicePath("GMCCAPP_000_000_000_000");
        doAjaxVO.setJsonData(data);
        doAjaxVO.setHeader(header);
        doAjaxVO.setTimeout(timeout);
        doAjaxVO.setWithoutSessionidFlag(Constans.FLAG_Y);
        // 示例：{"sessionId":"7194dac41aec246bbbaba6a4be03f2e77","sessionKey":"378016fe","mobileNumber":"","city":"","brand":"","isLogined":"1","SMSLoginChannel":"1","result":"000","desc":"获取成功","isViceNumber":"1","isGDMobile":"0"}
        String res = sysDoAjax(doAjaxVO);
        JSONObject jsonRes = JSONObject.parseObject(res);
        String result = jsonRes.getString("result");
        String session = "";
        if (result.equals("000")) {
            session = jsonRes.getString("sessionId");
            setSessionid(session);
        }
        return session;
    }

    @Override
    public GmccOutVO login(String phone, String smsCode) throws Exception {
        SysDoAjaxVO doAjaxVO = new SysDoAjaxVO();
        doAjaxVO.setService("login");
        doAjaxVO.setServicePath("GMCCAPP_000_000_001_010");
        Map<String, Object> jsonData = new HashMap<>();
        jsonData.put("mobileNumber", phone);
        jsonData.put("bussnissId", BUSSNISSID_LOGIN);
        jsonData.put("isGDMobile", "true");
        jsonData.put("password", smsCode);
        jsonData.put("identifyingCode", "");
        doAjaxVO.setJsonData(jsonData);
        String res = sysDoAjax(doAjaxVO);
        JSONObject jsonRes = JSONObject.parseObject(res);
        return jsonRes.toJavaObject(GmccOutVO.class);
    }


    /**
     * 生成32位随机码
     */
    private String randomCode() {
        String timestamp = new Date().getTime() + "";
        String[] arr = "abcdefghijklmnopqrstuvwsyz0123456789".split("");
        String nonce = "";
        int len = 32 - timestamp.length();
        for (int i = 0; i < timestamp.length(); i++) {
            nonce += arr[Integer.valueOf(timestamp.split("")[i])];
        }
        for (int j = 0; j < len; j++) {
            int num = Long.valueOf(Math.round(Math.random() * 35)).intValue();
            nonce += arr[num];
        }
        return nonce;
    }


    /**
     * 获取指定位数的随机数
     */
    @Override
    public String getRandom(int length) {
        String res = (Math.random() + "").substring(2);
        if (res.length() > length) return res.substring(0, length);
        while (res.length() < length) {
            res += Math.floor(Math.random() * 10);
        }
        return res;
    }


}
