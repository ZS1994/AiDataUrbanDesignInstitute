package com.zs.aidata.core.tools;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * rest的一些请求封装
 *
 * @author 张顺
 * @since 2020/10/12
 */
@Slf4j
public class RestTemplateUtils {
    private static RestTemplate restTemplate = new RestTemplate();

    public static RestTemplate getRestemplate() {
        //RestTemplate设置编码
        restTemplate.getMessageConverters().set(1, new StringHttpMessageConverter(StandardCharsets.UTF_8));
        return restTemplate;
    }


    /**
     * 通用的请求方法
     *
     * @param url
     * @param method
     * @param params
     * @param header
     * @return
     */
    public static String execHttpRequest(String url, String method, Map<String, String> params, Map<String, String> header) {
        HttpHeaders headers = new HttpHeaders();
        // 设置header
        if (ValueUtils.isNotEmpty(header)) {
            header.forEach((k, v) -> {
                headers.add(k, v);
            });
        }
        // 字符集的设置，基本上所有请求都需要
        headers.add("charset", "UTF-8");
        headers.add("Accept-Language", "zh-CN,zh;q=0.9");
        RestTemplate rest = RestTemplateUtils.getRestemplate();
        // 设置body
        MultiValueMap<String, String> param = new LinkedMultiValueMap<>();
        if (ValueUtils.isNotEmpty(params)) {
            params.forEach((k, v) -> {
                param.add(k, v);
            });
        }
        HttpEntity<Map> requestEntity = new HttpEntity<Map>(param, headers);

        HttpMethod httpMethod = HttpMethod.POST;
        switch (method.toLowerCase()) {
            case "post":
                httpMethod = httpMethod.POST;
                break;
            case "get":
                httpMethod = httpMethod.GET;
                break;
        }
        ResponseEntity<String> response = rest.exchange(url, httpMethod, requestEntity, String.class);
        String str = response.getBody();
        log.info("url：" + url);
        log.info("httpMethod：" + httpMethod);
        log.info("requestEntity：" + requestEntity);
        log.info("response：" + str);
        return str;
    }


}
