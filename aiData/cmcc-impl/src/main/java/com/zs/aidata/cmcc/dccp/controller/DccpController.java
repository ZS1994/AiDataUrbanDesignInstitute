package com.zs.aidata.cmcc.dccp.controller;

import com.zs.aidata.cmcc.dccp.service.IDccpService;
import com.zs.aidata.cmcc.dccp.vo.DccpOutVO;
import com.zs.aidata.cmcc.dccp.vo.DccpQueryVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;

/**
 * @author 张顺
 * @since 2020/10/18
 */
@Api(tags = {"和彩云"})
@RestController
@RequestMapping(value = "cmcc/dccpController", headers = "Accept=application/json", produces = "application/json;charset=UTF-8")
public class DccpController {

    @Inject
    private IDccpService dccpService;


    @PostMapping("sendSmsCode")
    @ApiOperation(value = "发送验证码", notes = "测试用")
    public DccpOutVO sendSmsCode(DccpQueryVO queryVO) {
        return dccpService.sendSmsCode(queryVO.getLoginTel());
    }


}
