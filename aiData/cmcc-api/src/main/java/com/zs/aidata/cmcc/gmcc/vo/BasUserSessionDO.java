package com.zs.aidata.cmcc.gmcc.vo;

import com.zs.aidata.core.tools.BaseEntityVO;
import lombok.Data;


@Data
public class BasUserSessionDO extends BaseEntityVO {

    private String phone;

    private String sessionId;

}