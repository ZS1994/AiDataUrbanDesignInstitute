package com.zs.aidata.config;

import cn.hutool.core.codec.Base64;
import com.zs.aidata.filter.CORSAuthenticationFilter;
import com.zs.aidata.otherconfig.CustomSessionManager;
import com.zs.aidata.realm.MyRealm;
import org.apache.shiro.cache.CacheManager;
import org.apache.shiro.cache.MemoryConstrainedCacheManager;
import org.apache.shiro.realm.Realm;
import org.apache.shiro.session.mgt.SessionManager;
import org.apache.shiro.spring.LifecycleBeanPostProcessor;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.CookieRememberMeManager;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.apache.shiro.web.servlet.SimpleCookie;
import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.apache.shiro.mgt.SecurityManager;

import javax.servlet.Filter;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Shiro的配置
 *
 * @author 张顺
 * @since 2021/2/18
 */
@Configuration
public class ShiroConfig {

    /**
     * 配置一个SecurityManager安全管理器
     *
     * @return
     */
    @Bean
    public SecurityManager securityManager(Realm myRealm, SessionManager sessionManager) {
        DefaultWebSecurityManager webSecurityManager = new DefaultWebSecurityManager();
        webSecurityManager.setRealm(myRealm);
        //自定义session管理
        webSecurityManager.setSessionManager(sessionManager);
        return webSecurityManager;
    }

    @Bean
    public CacheManager cacheManager() {
        return new MemoryConstrainedCacheManager();
    }

    /**
     * cookie对象;
     * rememberMeCookie()方法是设置Cookie的生成模版，比如cookie的name，cookie的有效时间等等。
     *
     * @return
     */
    @Bean
    public SimpleCookie rememberMeCookie() {
        //System.out.println("ShiroConfiguration.rememberMeCookie()");
        //这个参数是cookie的名称，对应前端的checkbox的name = rememberMe
        SimpleCookie simpleCookie = new SimpleCookie("rememberMe");
        //<!-- 记住我cookie生效时间30天 ,单位秒;-->
        simpleCookie.setMaxAge(259200);
        return simpleCookie;
    }

    /**
     * cookie管理对象;
     * rememberMeManager()方法是生成rememberMe管理器，而且要将这个rememberMe管理器设置到securityManager中
     *
     * @return
     */
    @Bean
    public CookieRememberMeManager rememberMeManager() {
        //System.out.println("ShiroConfiguration.rememberMeManager()");
        CookieRememberMeManager cookieRememberMeManager = new CookieRememberMeManager();
        cookieRememberMeManager.setCookie(rememberMeCookie());
        //rememberMe cookie加密的密钥 建议每个项目都不一样 默认AES算法 密钥长度(128 256 512 位)
        cookieRememberMeManager.setCipherKey(Base64.decode("2AvVhdsgUs0FSA3SDFAdag=="));
        return cookieRememberMeManager;
    }


    /**
     * 配置一个自定义对的realm的bean，最终将使用这个bean返回哦对象来完成认证和授权
     *
     * @return
     */
    @Bean
    public MyRealm myRealm() {
        MyRealm myRealm = new MyRealm();
        return myRealm;
    }

    public CORSAuthenticationFilter corsAuthenticationFilter() {
        return new CORSAuthenticationFilter();
    }

    /**
     * 配置一个shiro的过滤器，进行一些规则的拦截，例如什么样的请求可以访问什么样的请求不可以访问等等
     *
     * @return
     */
    @Bean
    public ShiroFilterFactoryBean shiroFilter(SecurityManager securityManager) {
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        shiroFilterFactoryBean.setSecurityManager(securityManager);
        /*// 配置用户的登录请求，如果需要进行登录，shiro就要会转到这个请求进入这个登录页面
        shiroFilterFactoryBean.setLoginUrl("/");
        // 配置登录成功后的地址
        shiroFilterFactoryBean.setSuccessUrl("/success");
        // 配置没有权限的地址
        shiroFilterFactoryBean.setUnauthorizedUrl("/noPermission");*/

        // 配置权限的拦截规则
        Map<String, String> filterChainMap = new HashMap<>();
        // 配置登录请求不需要认证
//        filterChainMap.put("/**/login", "anon");
        // 配置登出会清空当前用户的内存
//        filterChainMap.put("/**/logout", "logout");
        // admin开头的请求需要登录认证
//        filterChainMap.put("/admin/**", "authc");
        // 配置剩余请求必须全部需要进行登录认证，注意这个必须写在最后
//        filterChainMap.put("/**", "corsAuthenticationFilter");
        //自定义过滤器
        Map<String, Filter> filterMap = new LinkedHashMap<>();
//        filterMap.put("corsAuthenticationFilter", corsAuthenticationFilter());
        shiroFilterFactoryBean.setFilters(filterMap);

        // 设置权限拦截规则
        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainMap);
        return shiroFilterFactoryBean;
    }

    /**
     * Shiro生命周期处理器
     *
     * @return
     */
    @Bean
    public LifecycleBeanPostProcessor lifecycleBeanPostProcessor() {
        return new LifecycleBeanPostProcessor();
    }

    /**
     * 开启shiro的注解支持，例如：@RequiresRoles()   @RequiresUser
     * shiro的注解需要借助spring的aop支持
     *
     * @return
     */
    @Bean
    public DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator() {
        DefaultAdvisorAutoProxyCreator autoProxyCreator = new DefaultAdvisorAutoProxyCreator();
        // 开启shiro的注解支持
        autoProxyCreator.setProxyTargetClass(true);
        return autoProxyCreator;
    }


    /**
     * 开启shiro的注解的aop支持
     *
     * @param securityManager
     * @return
     */
    @Bean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor(SecurityManager securityManager) {
        AuthorizationAttributeSourceAdvisor sourceAdvisor = new AuthorizationAttributeSourceAdvisor();
        // 开启AOP的支持
        sourceAdvisor.setSecurityManager(securityManager);
        return sourceAdvisor;
    }

    /**
     * 采用 DefaultWebSessionManager 替代掉容器内置的 Session 实现。
     */
    @Bean
    public SessionManager sessionManager() {
        CustomSessionManager sessionManager = new CustomSessionManager();
        //配置监听
//        sessionManager.setSessionIdCookie(simpleCookie);
        // 设置 sessionDAO
//        sessionManager.setSessionDAO(sessionDAO());
        // 配置 session
        sessionManager.setDeleteInvalidSessions(true);
        sessionManager.setSessionValidationSchedulerEnabled(true);
        // 10 分钟检查一遍失效 session
        sessionManager.setSessionValidationInterval(10 * 60 * 1000);
        return sessionManager;
    }

}
