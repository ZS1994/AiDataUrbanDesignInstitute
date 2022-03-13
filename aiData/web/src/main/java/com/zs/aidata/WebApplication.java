package com.zs.aidata;

import com.zs.aidata.listener.UploadPermServletContextListener;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

@EnableEurekaClient
@ComponentScan(basePackages = {"com.zs.aidata"})
@SpringBootApplication
@MapperScan("com.zs.aidata.**.dao")//使用MapperScan批量扫描所有的Mapper接口；
public class WebApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebApplication.class, args);
    }

    @Bean
    public UploadPermServletContextListener getServletContextListener() {
        return new UploadPermServletContextListener();
    }

}
