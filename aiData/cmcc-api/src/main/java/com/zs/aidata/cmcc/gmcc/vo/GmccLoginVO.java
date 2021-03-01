package com.zs.aidata.cmcc.gmcc.vo;

import com.zs.aidata.core.tools.BaseEntityVO;
import lombok.Data;

/**
 * @author 张顺
 * @since 2020/10/22
 */
@Data
public class GmccLoginVO extends BaseEntityVO {

    // 手机号
    private String phone;

    // 验证码
    private String smsCode;

}
