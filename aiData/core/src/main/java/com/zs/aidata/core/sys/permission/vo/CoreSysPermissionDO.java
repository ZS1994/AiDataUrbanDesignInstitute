package com.zs.aidata.core.sys.permission.vo;

import com.zs.aidata.core.tools.BaseEntityVO;
import lombok.Data;

@Data
public class CoreSysPermissionDO extends BaseEntityVO {

    private String permName;

    private String permUrl;

    private String permMethod;

    private String permCode;

    private String methodType;

    private String permType;

    private String permFlag;

    private String menuImg;

    private Integer menuOrder;

    private Integer menuParentId;

}