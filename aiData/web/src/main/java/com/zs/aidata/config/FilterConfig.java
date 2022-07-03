package com.zs.aidata.config;

import com.zs.aidata.filter.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 过滤器总配置，所有的过滤器需要在这里进行添加
 *
 * @author 张顺
 * @since 2020/11/1
 */
@Configuration
public class FilterConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public FilterRegistrationBean registFilter() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        // 注册jwt的bean
        registration.setFilter(jwtFilter);
        registration.addUrlPatterns("/*");
        registration.setName("CookieJSessionFilter");
        registration.setOrder(1);
        return registration;
    }

}
