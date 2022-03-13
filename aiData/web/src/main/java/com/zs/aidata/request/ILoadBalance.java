package com.zs.aidata.request;

import org.springframework.cloud.client.ServiceInstance;

import java.util.List;

/**
 * Created by 张顺 on 2020/4/24.
 * <p>
 * 自定义的负载均衡算法
 *
 * @author 张顺
 * @since 2020/4/24
 */
public interface ILoadBalance {

    /**
     * 均衡算法，得到其中一个具体的服务
     *
     * @param serviceInstances
     * @return
     */
    ServiceInstance instance(List<ServiceInstance> serviceInstances);

    /**
     * 均衡算法，得到其中一个具体的服务，并且转换局域网ip地址为公网ip
     *
     * @param serviceInstances
     * @return
     */
    String instanceUrlWithTrans(List<ServiceInstance> serviceInstances);

}
