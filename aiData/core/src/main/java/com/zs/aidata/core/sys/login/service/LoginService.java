package com.zs.aidata.core.sys.login.service;

import cn.hutool.http.Method;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.zs.aidata.core.sys.login.vo.AuthVO;
import com.zs.aidata.core.sys.login.vo.LoginInputVO;
import com.zs.aidata.core.sys.permission.vo.CoreSysPermissionDO;
import com.zs.aidata.core.tools.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;

import javax.inject.Named;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author 张顺
 * @since 2021/3/2
 */
@Slf4j
@Named
public class LoginService extends BaseCoreService implements ILoginService {

    @Override
    public AuthVO login(LoginInputVO inputVO) throws AiDataApplicationException {
        checkNotEmpty(inputVO, "userNumber", "userPassword");
        Map<String, String> param = new HashMap<>();
        param.put("appId", "URBAN");
        param.put("userNumber", inputVO.getUserNumber());
        param.put("userPassword", inputVO.getUserPassword());
        String resStr = RestTemplateUtils.execHttpRequest(URL_CENTER_LOGIN, "POST", param, new HashMap<>());
        log.info(resStr);
        AuthVO resObj = JSONObject.parseObject(resStr, AuthVO.class);
        // 如果登录认证不成功，则直接返回校验结果给前端
        if (isNotEmpty(resObj) && Constans.STATUS_ERROR.equals(resObj.getStatus())) {
            return resObj;
        }

        // 此时，获取到jwt的token后立即进行shiro的身份认证来获得shiro的token
        UsernamePasswordToken shiroToken = new UsernamePasswordToken(inputVO.getUserNumber(), inputVO.getUserPassword());
        // 获取权限操作对象，利用这个对象来完成登录操作
        Subject subject = SecurityUtils.getSubject();
        // 先登出一次
        subject.logout();
        subject.login(shiroToken);
        // 对jwt token解析一次，从中取出权限
        DecodedJWT decodedJWT = JwtUtil.verifierToken(resObj.getToken());

        // 存储权限
        Session session = subject.getSession();

        Map<String, Claim> claimMap = decodedJWT.getClaims();
        List<CoreSysPermissionDO> permissionList = JSONArray.parseArray(
                claimMap.get(Constans.JWT_PERMISSION_LIST).asString(),
                CoreSysPermissionDO.class);
        List<String> permStrList = permissionList.stream().map(CoreSysPermissionDO::getPermCode).collect(Collectors.toList());

        session.setAttribute(Constans.SHIRO_PERMISSION_LIST, permStrList);
        return resObj;
    }
}
