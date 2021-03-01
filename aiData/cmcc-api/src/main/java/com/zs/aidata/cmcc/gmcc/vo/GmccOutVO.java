package com.zs.aidata.cmcc.gmcc.vo;

import com.zs.aidata.core.tools.BaseEntityVO;
import lombok.Data;

/**
 * @author 张顺
 * @since 2020/10/22
 */
@Data
public class GmccOutVO extends BaseEntityVO {

    // 消息
    private String message;


    // 结果码
    private String result;

    // 描述性文字
    private String desc;

    // 存放数据
    private String data;
}
