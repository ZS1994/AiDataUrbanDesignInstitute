package com.zs.aidata.request.impl;

import com.zs.aidata.request.IpMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import com.zs.aidata.request.ILoadBalance;

import javax.annotation.Resource;


/**
 * Created by 张顺 on 2020/4/24.
 */
@Component
@Slf4j
public class MyILoadBalance implements ILoadBalance {

    private AtomicInteger atomicInteger = new AtomicInteger(0);
    @Resource
    private IpMap ipMap;

    /**
     * 得到原子性的第几次访问
     *
     * @return
     */
    public final int getAndIncrement() {
        int current;
        int next;
        do {
            current = this.atomicInteger.get();
            //2147483647 因为int的最大整形数 , compareAndSet修改了就会返回true
            next = current >= 2147483647 ? 0 : current + 1;
        } while (!atomicInteger.compareAndSet(current, next));
        log.info("*****第几次访问*****next*****{}*****", next);
        return next;
    }

    @Override
    public ServiceInstance instance(List<ServiceInstance> serviceInstances) {
        int index = getAndIncrement() % serviceInstances.size();
        return serviceInstances.get(index);
    }

    @Override
    public String instanceUrlWithTrans(List<ServiceInstance> serviceInstances) {
        ServiceInstance instance = instance(serviceInstances);
        String url = "";
        if (instance != null) {
            url = ipMap.transIp(instance.getUri().toString());
        }
        return url;
    }
}
