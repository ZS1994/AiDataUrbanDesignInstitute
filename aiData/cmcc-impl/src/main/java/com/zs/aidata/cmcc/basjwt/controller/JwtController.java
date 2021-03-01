package com.zs.aidata.cmcc.basjwt.controller;

import com.zs.aidata.core.tools.BaseCoreService;
import com.zs.aidata.cmcc.gmcc.service.IGmccAppService;
import com.zs.aidata.cmcc.basjwt.vo.JwtVO;
import com.zs.aidata.core.tools.Constans;
import com.zs.aidata.core.tools.JwtUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.Map;

/**
 * @author 张顺
 * @since 2020/11/1
 */
@Api(tags = {"JWT"})
@RestController
@RequestMapping(value = "cmcc/jwtController", headers = "Accept=application/json", produces = "application/json;charset=UTF-8")
public class JwtController extends BaseCoreService {

    private JwtUtil jwtUtil = new JwtUtil();

    @Inject
    private IGmccAppService iGmccAppService;


    @PostMapping("createToken")
    @ApiOperation(value = "生成一个token", notes = "生成一个token")
    public JwtVO createToken() throws Exception {
        String sessionid = iGmccAppService.sessionidRequest(null);
        Map<String, String> map = new HashMap<>();
        map.put(Constans.KEY_GMCC_SESSION_ID, sessionid);
        String token = jwtUtil.createToken(map);
        JwtVO out = new JwtVO();
        out.setToken(token);
        return out;
    }

}
