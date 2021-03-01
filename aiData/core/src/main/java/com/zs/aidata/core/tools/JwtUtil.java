package com.zs.aidata.core.tools;

import com.alibaba.fastjson.JSONObject;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;

import java.util.Date;
import java.util.Map;

/**
 * jwt身份认证
 *
 * @author 张顺
 * @since 2020/11/1
 */
@Slf4j
public class JwtUtil {

    String SECRET = "secret123456";

    /**
     * 生成一个TOKEN
     *
     * @param params 参数
     * @return
     */
    public String createToken(Map<String, String> params) {
        String token = "";
        try {
            Algorithm algorithm = Algorithm.HMAC256(SECRET);
            JWTCreator.Builder builder = JWT.create()
                    .withIssuer("auth0")    // 发布者
                    .withIssuedAt(new Date())   // 生成签名的时间
                    .withExpiresAt(ValueUtils.addHours(new Date(), 2));   // 生成签名的有效期,小时
            params.forEach((k, v) -> {
                builder.withClaim(k, v);
            });
            token = builder.sign(algorithm);
            log.info(token);
        } catch (JWTCreationException e) {
            log.error("Claim不能转换为JSON，或者在签名过程中使用的密钥无效");
            e.printStackTrace();
            //如果Claim不能转换为JSON，或者在签名过程中使用的密钥无效，那么将会抛出JWTCreationException异常。
        }
        return token;
    }


    public DecodedJWT verifierToken(String jwtToken) {
        String token = jwtToken;
        try {
            Algorithm algorithm = Algorithm.HMAC256(SECRET);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer("auth0") //匹配指定的token发布者 auth0
                    .build();
            DecodedJWT jwt = verifier.verify(token); //解码JWT ，verifier 可复用
            log.info(JSONObject.toJSONString(jwt));
            return jwt;
        } catch (JWTVerificationException e) {
            //无效的签名/声明
            log.error("无效的签名");
            e.printStackTrace();
        }
        return null;
    }

}
