package com.zs.aidata.sys.service.impl;

import com.alibaba.fastjson.JSONArray;
import com.zs.aidata.core.tools.BaseCoreService;
import com.zs.aidata.core.tools.Constans;
import com.zs.aidata.core.tools.RestTemplateUtils;
import com.zs.aidata.request.ILoadBalance;
import com.zs.aidata.sys.service.ISysPermissionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 权限服务接口，会尝试从公共端获取权限
 *
 * @author 张顺
 * @since 2022/3/13
 */
@Service
@Slf4j
public class SysPermissionService extends BaseCoreService implements ISysPermissionService {

    @Resource
    private DiscoveryClient discoveryClient;
    @Resource
    private ILoadBalance iLoadBalance;

    @Override
    public void updateAllPermissionByAuto(List<Map<String, String>> paramList) {
        if (isEmpty(paramList)) {
            log.error("=============paramList is NULL");
            return;
        }
        // 请求center端
        Map<String, String> paramMap = new HashMap<>();
        paramMap.put("appId", Constans.APP_ID);
        paramMap.put("coreSysPermissionDOListJsonArr", JSONArray.toJSONString(paramList));
        // 尝试获取微服务
        List<ServiceInstance> instances = discoveryClient.getInstances("AIDATA_9456");
        if (instances == null || instances.size() <= 0) {
            log.error("没有注册的服务");
            return;
        }
        String uri = iLoadBalance.instanceUrlWithTrans(instances);
        log.info("目标服务地址:{}", uri);
        RestTemplateUtils.execHttpRequest(
                uri + "/aidata/core/coreSysPermissionController/updateAllPermissionByAuto",
                "POST", paramMap, new HashMap<>());
    }
}
