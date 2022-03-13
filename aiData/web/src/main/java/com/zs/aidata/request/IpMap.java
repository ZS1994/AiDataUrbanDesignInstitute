package com.zs.aidata.request;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * IP地址转换，这个是为了方便本地调试，通过配置 aidata.ip.map.enable = true开启
 *
 * @author 张顺
 * @since 2022/3/13
 */
@Component
public class IpMap {
    /**
     * 是否转换ip地址由局域网ip转为公网ip的开关，默认关闭
     */
    @Value("${aidata.ip.map.enable}")
    private boolean isTransIp;

    /**
     * key是局域网ip，value是公网ip
     */
    private final Map<String, String> IP_MAP = new HashMap();

    {
        IP_MAP.put("172.24.136.158", "47.115.148.250");
    }

    /**
     * 转换IP地址为公网IP，有开关控制
     *
     * @param privateIp
     * @return
     */
    public String transIp(String privateIp) {
        if (!isTransIp) {
            return privateIp;
        }
        for (String pIp : IP_MAP.keySet()) {
            if (privateIp.contains(pIp)) {
                return privateIp.replace(pIp, IP_MAP.get(pIp));
            }
        }
        return privateIp;
    }

}
