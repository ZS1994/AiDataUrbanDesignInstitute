package com.zs.aidata.cmcc.bastest.controller;

import com.zs.aidata.cmcc.bastest.vo.HelloVO;
import com.zs.aidata.cmcc.gmcc.dao.IBasUserSessionDao;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;

/**
 * @author 张顺
 * @since 2020/10/11
 */
@Api(tags = {"测试接口服务"})
@RestController
@RequestMapping(value = "cmcc/basTestController", headers = "Accept=application/json", produces = "application/json;charset=UTF-8")
public class BasTestController {

    @Inject
    private IBasUserSessionDao iBasUserSessionDao;

    @GetMapping("hello")
    @ApiOperation(value = "测试请求是否能通", notes = "备注说明。。。。省略")
    public HelloVO hello() {
        iBasUserSessionDao.selectList(null);

        HelloVO helloVO = new HelloVO();
        helloVO.setMessage("测试成功，该接口是通的");
        return helloVO;
    }
}
