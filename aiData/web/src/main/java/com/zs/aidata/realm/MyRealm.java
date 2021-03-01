package com.zs.aidata.realm;

import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * 自定义的realm用来实现用户的认证和授权的
 * AuthenticatingRealm是专门用于用户认证的
 * AuthorizingRealm 即可以用来用户认证，又可以用户授权
 *
 * @author 张顺
 * @since 2021/2/18
 */
@Slf4j
public class MyRealm extends AuthorizingRealm {
    /**
     * 用户认证的方法
     *
     * @param token 用户身份，存放用户的账号和密码
     * @return 用户登录成功后的身份证明
     * @throws AuthenticationException 如果认证失败，那么shiro会抛出各种异常
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        log.info("------------------用户认证------------------------");
        UsernamePasswordToken userToken = (UsernamePasswordToken) token;
        // 获取页面中传递的用户账号
        String username = userToken.getUsername();
        // 获取页面中的用户密码，实际工作中基本上用不着
        String password = new String(userToken.getPassword());
        // 认证账号，这里应该从数据库中获取数据
//        if (!"admin".equals(username)) {
//            // 密码错误
//            throw new UnknownAccountException("账号错误");
//        }

        // 这里到底要怎么校验就看自己的需要了。如果现有的异常无法满足要求，也可以实现自定义的异常

        /**
         * 数据密码加密主要目的是为了防止浏览器到服务器之间密码被窃取，所以才需要加密，
         * 而服务器端内部程序中加密其实没有多大必要，除非是为了防止有人从数据库中看到密码
         * 建议放在前端加密
         */
        // 设置当前登录用户中的密码数据进行加密
//        HashedCredentialsMatcher hashedCredentialsMatcher = new HashedCredentialsMatcher();
//        hashedCredentialsMatcher.setHashAlgorithmName("MD5");
//        hashedCredentialsMatcher.setHashIterations(2);
//        setCredentialsMatcher(hashedCredentialsMatcher);

        /**
         * 创建密码认证对象，由shiro自动认证密码
         * 参数1：数据库中的账号（或者页面账号均可）
         * 参数2：数据中读取数据来的密码
         * 参数3：当前realm的名称
         * 如果密码认证成功则返回一个用户身份对象，如果密码认证失败，则shiro会抛出异常
         */
        Subject subject = SecurityUtils.getSubject();
        Session session = subject.getSession();
        List<String> permissionList = new ArrayList<>();
        permissionList.add("test1");
        permissionList.add("test2");
        session.setAttribute("permissionList", permissionList);
        return new SimpleAuthenticationInfo(username, password, getName());
    }

    /**
     * 用户授权的方法，当用户认证通过之后，将自动执行该方法
     *
     * @param principals
     * @return
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        log.info("---------------授权了---------------------");
        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
        Subject subject = SecurityUtils.getSubject();
        Session session = subject.getSession();
        List<String> permissionList = (List<String>) session.getAttribute("permissionList");
        Set<String> permissionSet = new HashSet<>(permissionList);
        authorizationInfo.setStringPermissions(permissionSet);
        return authorizationInfo;
    }
}
