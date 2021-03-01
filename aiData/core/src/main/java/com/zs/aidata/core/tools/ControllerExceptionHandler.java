package com.zs.aidata.core.tools;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 自定义的异常处理机制，处理其他controller抛出的异常
 *
 * @author 张顺
 * @since 2021/2/24
 */
@ControllerAdvice
public class ControllerExceptionHandler {

    //这个注解是指当controller中抛出这个指定的异常类的时候，都会转到这个方法中来处理异常
    @ExceptionHandler(Exception.class)
    //将返回的值转成json格式的数据
    @ResponseBody
    //返回的状态码
    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)     //服务内部错误
    public Map<String, Object> handlerException(Exception ex) {
        Map<String, Object> result = new HashMap<>();
        result.put("error", "Internal Server Error");
        result.put("message", ex.getMessage());
        result.put("path", "");
        result.put("status", "500");
        result.put("timestamp", new Date());
        return result;
    }


}
