package com.zs.aidata.sys.service;


import java.util.List;
import java.util.Map;

/**
 * 权限服务接口，会尝试从公共端获取权限
 *
 * @author 张顺
 * @since 2022/3/13
 */
public interface ISysPermissionService {

    /**
     * 把本工程的权限自动更新至center端
     *
     * @param paramList 入参
     */
    void updateAllPermissionByAuto(List<Map<String, String>> paramList);

}
