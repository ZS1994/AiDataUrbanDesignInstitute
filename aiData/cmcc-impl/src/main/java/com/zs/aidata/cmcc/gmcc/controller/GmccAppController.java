package com.zs.aidata.cmcc.gmcc.controller;

import com.zs.aidata.core.tools.BaseCoreService;
import com.zs.aidata.cmcc.gmcc.service.IGmccAppService;
import com.zs.aidata.cmcc.gmcc.service.IGmccAppService_DW_0RMB_10G;
import com.zs.aidata.cmcc.gmcc.vo.GmccLoginVO;
import com.zs.aidata.cmcc.gmcc.vo.GmccOutVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;

/**
 * @author 张顺
 * @since 2020/10/18
 */
@Api(tags = {"广东移动"})
@RestController
@RequestMapping(value = "cmcc/gmccAppController", headers = "Accept=application/json", produces = "application/json;charset=UTF-8")
//@CrossOrigin(origins = "http://127.0.0.1:8010", maxAge = 3600, allowCredentials = "true")
public class GmccAppController extends BaseCoreService {

    @Inject
    private IGmccAppService iGmccAppService;
    @Inject
    private IGmccAppService_DW_0RMB_10G iGmccAppService_dw_0RMB_10G;

    @PostMapping("sendSmsCode")
    @ApiOperation(value = "发送验证码", notes = "发送验证码")
    public GmccOutVO sendSmsCode(GmccLoginVO queryVO) throws Exception {
        checkNotEmpty(queryVO, "phone");
        return iGmccAppService.sendSmsCode(queryVO.getPhone());
    }


    @PostMapping("login")
    @ApiOperation(value = "登录", notes = "登录")
    public GmccOutVO login(GmccLoginVO inputVo) throws Exception {
        checkNotEmpty(inputVo, "phone", "smsCode");
        return iGmccAppService.login(inputVo.getPhone(), inputVo.getSmsCode());
    }


    @PostMapping("getProdToken")
    @ApiOperation(value = "获取 prodToken", notes = "获取 prodToken")
    public GmccOutVO getProdToken(GmccLoginVO inputVo) throws Exception {
        checkNotEmpty(inputVo, "phone", "smsCode");
        return iGmccAppService_dw_0RMB_10G.getProdToken(inputVo.getPhone(), inputVo.getSmsCode());
    }


    @GetMapping("getPicCode")
    @ApiOperation(value = "获取图形验证码", notes = "获取图形验证码")
    public void getPicCode() throws Exception {
        iGmccAppService_dw_0RMB_10G.getPicCode();
    }
}
