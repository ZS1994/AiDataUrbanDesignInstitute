package com.zs.aidata.filter;

import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.zs.aidata.core.tools.AiDataApplicationException;
import com.zs.aidata.core.tools.Constans;
import com.zs.aidata.core.tools.JwtUtil;
import com.zs.aidata.core.tools.ValueUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.connector.RequestFacade;
import org.springframework.util.PatternMatchUtils;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * 解析jwt的token
 *
 * @author 张顺
 * @since 2020/11/1
 */
@Slf4j
public class JwtFilter implements Filter {


    private JwtUtil jwtUtil = new JwtUtil();

    /**
     * 白名单
     */
    List<String> WHITE_LIST = Arrays.asList("*/core/loginController/login");

    /**
     * JWT的开关，N：关，其他:开
     */
    String SWITCH_JWT = "Y";

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        // 如果开关关闭那么直接放行所有请求
        if ("N".equals(SWITCH_JWT)) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        // 获取url链接，如果属于白名单中，那么不用校验直接放行
        String url = ((HttpServletRequest) servletRequest).getRequestURI();
        // 判断是否在白名单之中，白名单中的URL可以使用通配符
        boolean isInWhiteList = PatternMatchUtils.simpleMatch(WHITE_LIST.toArray(new String[WHITE_LIST.size()]), url);
        if (isInWhiteList) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        log.info(url);

        // 拿到request header中的 token，进行JWT TOKEN解析
        String jsessionid = ((RequestFacade) servletRequest).getRequestedSessionId();
        log.info(jsessionid);
        String jwtToken = ((RequestFacade) servletRequest).getHeader("token");
        if (ValueUtils.isEmpty(jwtToken) && "undefined".equals(jwtToken)) {
            throw new AiDataApplicationException("JWT TOKEN为空");
        }
        DecodedJWT jwt = jwtUtil.verifierToken(jwtToken);
        if (ValueUtils.isEmpty(jwt)) {
            throw new AiDataApplicationException("JWT解析失败，可能是因为token过期或者不合法，现在强制终止该request");
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }
}
