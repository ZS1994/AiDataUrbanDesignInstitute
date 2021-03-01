package com.zs.aidata.cmcc.gmcc.service;

import com.zs.aidata.cmcc.gmcc.vo.GmccOutVO;
import com.zs.aidata.cmcc.gmcc.vo.SessionidRequestVO;
import com.zs.aidata.cmcc.gmcc.vo.SysDoAjaxVO;

/**
 * 里面很多代码是从这个网址上下载下来的，如果以后有变动，比如appVersion变动了，可以从这个网站重新下载代码下来即可
 * 源码网站：https://gd.10086.cn/gmccapp/webpage/setMealPackage/index.html#/?id=fa937841ec9a4a6196ced624119b49ac&prodChannelId=%2a%2a2005260001&operatorid=%2a%2a2005260001
 * 博客日记：
 *
 * @author 张顺
 * @since 2020/10/22
 */
public interface IGmccAppService {

    // 发送验证码
    String URL_SEND_SMS_CODE = "http://gd.10086.cn/gmccapp/login/?sessionid=1d8674941571a48538f4d0fc24b2d26a3&servicename=GMCCAPP_000_000_001_028";

    // 发送验证码
    String BUSSNISSID_SEND_SMD_CODE = "differentNets";
    // 登录
    String BUSSNISSID_LOGIN = "flowPackageHandle";

    /**
     * 发送短信验证码
     *
     * @param phone
     * @return
     */
    GmccOutVO sendSmsCode(String phone) throws Exception;


    String PATH = "http://gd.10086.cn/gmccapp";
    String GMCC_APP_ID = "51cc2c2ac500435e91ca9ca1b0449baa";


    /**
     * 广东移动的基础的ajax方法转为java版，原函数名叫做sys_doAjax
     * <p>
     * ajax请求
     *
     * @param {string} service 服务
     * @param {string} servicePath 接口名
     * @param {object} jsonData 请求数据
     * @param {string} method 请求方式
     * @param {object} header 请求头
     * @param {number} timeout 请求响应时间
     * @param inVo
     * @return {promise} promise对象
     */
    String sysDoAjax(SysDoAjaxVO inVo) throws Exception;


    /**
     * 得到sessionId
     *
     * @return
     */
    String getSessionid() throws Exception;

    /**
     * 设置sessionId
     *
     * @return
     */
    void setSessionid(String sessionid);

    /**
     * 请求获取sessionid
     *
     * @param {string} service 服务
     * @param {object} jsonData 请求数据
     * @param {string} method 请求方式
     * @param {object} header 请求头
     * @param {number} timeout 请求响应时间
     * @return {promise} promise对象
     */
    String sessionidRequest(SessionidRequestVO inVo) throws Exception;


    /**
     * 登录
     *
     * @param phone
     * @param smsCode
     * @return
     */
    GmccOutVO login(String phone, String smsCode) throws Exception;


    String getRandom(int length);
}
