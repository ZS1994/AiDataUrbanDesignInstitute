package com.zs.aidata;

import com.zs.aidata.listener.ServletContextListener;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan(basePackages = {"com.zs.aidata"})
@SpringBootApplication
@MapperScan("com.zs.aidata.**.dao")//使用MapperScan批量扫描所有的Mapper接口；
public class WebApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebApplication.class, args);
    }

    @Bean
    public ServletContextListener getServletContextListener() {
        return new ServletContextListener();
    }

}
