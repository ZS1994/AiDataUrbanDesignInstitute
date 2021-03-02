package com.zs.aidata.core.sys.login.service;

import com.zs.aidata.core.sys.login.vo.AuthVO;
import com.zs.aidata.core.sys.login.vo.LoginInputVO;
import com.zs.aidata.core.tools.AiDataApplicationException;

/**
 * @author 张顺
 * @since 2021/3/2
 */
public interface ILoginService {

    /**
     * center登录的请求地址
     */
    String URL_CENTER_LOGIN = "http://127.0.0.1:8080/aidata/core/loginController/login";


    /**
     * 登录
     *
     * @param inputVO
     * @return
     * @throws AiDataApplicationException
     */
    AuthVO login(LoginInputVO inputVO) throws AiDataApplicationException;
}
