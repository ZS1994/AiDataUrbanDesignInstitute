package com.zs.aidata.listener;

import com.alibaba.fastjson.JSONArray;
import com.zs.aidata.core.tools.AnnotationUtil;
import com.zs.aidata.core.tools.Constans;
import com.zs.aidata.core.tools.RestTemplateUtils;
import com.zs.aidata.sys.service.ISysPermissionService;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 使用 ApplicationListener 来初始化一些数据到 application 域中的监听器
 *
 * @author 张顺
 * @since 2020/11/1
 */
@Slf4j
public class UploadPermServletContextListener implements ApplicationListener<ContextRefreshedEvent> {

    @Override
    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
        // 先获取到 application 上下文
        ApplicationContext applicationContext = contextRefreshedEvent.getApplicationContext();
        /*// 获取对应的 service
        UserService userService = applicationContext.getBean(UserService.class);
        User user = userService.getUser();
        // 获取 application 域对象，将查到的信息放到 application 域中
        ServletContext application = applicationContext.getBean(ServletContext.class);
        application.setAttribute("user", user);*/
        log.info("项目启动成功。请访问地址：http://localhost:8080/aidata");
        log.info("--------------------------------------");
        AnnotationUtil annotationUtil = applicationContext.getBean(AnnotationUtil.class);
        try {
            // 获取所有的权限注解的方法，然后与数据库比对，如果有不一样的就修改
            Map<String, Map<String, Object>> resMap =
                    annotationUtil.getAllAddTagAnnotationUrl("classpath*:com/zs/aidata/**/controller/*.class",
                            RequiresPermissions.class);
            log.info(resMap.toString());
            // 填充参数，请求center端更新权限列表
            List<Map<String, String>> paramList = new ArrayList<>();
            for (String urlMethod : resMap.keySet()) {
                String permUrl = urlMethod.split(":")[0];
                String permMethod = urlMethod.split(":")[1];
                Map<String, Object> permMap = resMap.get(urlMethod);
                String permCode = ((String[]) permMap.get("value"))[0];
                // 封装必须得权限数据
                Map<String, String> permMapTmp = new HashMap<>();
                permMapTmp.put("permUrl", permUrl);
                permMapTmp.put("permMethod", permMethod);
                permMapTmp.put("permCode", permCode);
                permMapTmp.put("permName", permCode);
                permMapTmp.put("appId", Constans.APP_ID);
                paramList.add(permMapTmp);
            }
            // 请求center端
            // 获取service
            ISysPermissionService iSysPermissionService = applicationContext.getBean(ISysPermissionService.class);
            if (iSysPermissionService != null) {
                iSysPermissionService.updateAllPermissionByAuto(paramList);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        log.info("-----------------自动上传更新本工程权限结束---------------------");
    }
}
