package com.zs.aidata.core.tools;

import org.springframework.web.client.RestTemplate;

/**
 * 所有的service都应该继承它
 *
 * @author 张顺
 * @since 2020/10/18
 */
public class BaseCoreService {

    public RestTemplate getRestTemplate() {
        return RestTemplateUtils.getRestemplate();
    }


    public boolean isEmpty(Object o) {
        return ValueUtils.isEmpty(o);
    }


    public boolean isNotEmpty(Object o) {
        return !isEmpty(o);
    }


    public void checkNotEmpty(Object obj, String... fieldNames) throws Exception {
        ValueUtils.checkNotEmpty(obj, fieldNames);
    }

}
