package com.zs.aidata.cmcc.gmcc.vo;

import com.zs.aidata.core.tools.BaseEntityVO;
import lombok.Data;

import java.util.Map;

/**
 * @author 张顺
 * @since 2020/10/24
 */
@Data
public class SysDoAjaxVO extends BaseEntityVO {

    private String method;
    private String service;
    private String servicePath;
    private Map<String, Object> jsonData;
    private Map<String, String> header;
    private int timeout;
    private String withoutSessionidFlag;
}
