package com.zs.aidata.core.sys.login.vo;

import com.zs.aidata.core.tools.BaseEntityVO;
import lombok.Data;

/**
 * 用户登录封装
 *
 * @author 张顺
 * @since 2021/2/22
 */
@Data
public class LoginInputVO extends BaseEntityVO {

    /**
     * 账号
     */
    private String userNumber;

    /**
     * 密码
     */
    private String userPassword;

}
