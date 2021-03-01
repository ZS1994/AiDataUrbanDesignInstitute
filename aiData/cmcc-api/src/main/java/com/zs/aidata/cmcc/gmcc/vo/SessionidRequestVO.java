package com.zs.aidata.cmcc.gmcc.vo;

import com.zs.aidata.core.tools.BaseEntityVO;
import lombok.Data;

import java.util.Map;

/**
 * @author 张顺
 * @since 2020/10/25
 */
@Data
public class SessionidRequestVO extends BaseEntityVO {
    private String method;
    private String service;
    Map<String, Object> jsonData;
    Map<String, String> header;
    int timeout;
}
