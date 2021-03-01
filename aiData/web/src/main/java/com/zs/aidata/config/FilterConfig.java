package com.zs.aidata.config;

import com.zs.aidata.filter.JwtFilter;
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

    @Bean
    public FilterRegistrationBean registFilter() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(new JwtFilter());
        registration.addUrlPatterns("/*");
        registration.setName("CookieJSessionFilter");
        registration.setOrder(1);
        return registration;
    }

}
