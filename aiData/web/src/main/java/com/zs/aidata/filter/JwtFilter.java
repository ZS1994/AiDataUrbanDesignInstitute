package com.zs.aidata.filter;

import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.zs.aidata.core.tools.Constans;
import com.zs.aidata.core.tools.JwtUtil;
import com.zs.aidata.core.tools.ValueUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.connector.RequestFacade;

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
    List<String> WHITE_LIST = Arrays.asList("/aidata/core/sys/login/test");

    /**
     * JWT的开关，N：关，其他:开
     */
    String SWITCH_JWT = "N";

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        // 如果开关关闭那么直接放行所有请求
        if ("N".equals(SWITCH_JWT)) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        // 获取url链接，如果属于白名单中，那么不用校验直接放行
        String url = ((HttpServletRequest) servletRequest).getRequestURI();
        if (WHITE_LIST.contains(url)) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        log.debug(url);

        // 拿到request header中的 JSESSIONID ，然后加到cookie里面
        String jsessionid = ((RequestFacade) servletRequest).getRequestedSessionId();
        log.info(jsessionid);
        String jwtToken = ((RequestFacade) servletRequest).getHeader("token");
        if (ValueUtils.isNotEmpty(jwtToken) && !"undefined".equals(jwtToken)) {
            DecodedJWT jwt = jwtUtil.verifierToken(jwtToken);
            if (ValueUtils.isEmpty(jwt)) {
                log.error("JWT解析失败，可能是因为token过期或者不合法，现在强制终止该request");
                return;
            }
            Claim claim = jwt.getClaim(Constans.KEY_GMCC_SESSION_ID);
            if (claim.isNull() == false) {
                String sessionid = claim.asString();
                servletRequest.setAttribute(Constans.KEY_GMCC_SESSION_ID, sessionid);
            }
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }
}
