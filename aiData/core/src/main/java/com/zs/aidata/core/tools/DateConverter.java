package com.zs.aidata.core.tools;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

/**
 * 日期数据绑定转换类
 */
@Component()
public class DateConverter implements Converter<String, Date> {

    /**
     * 尝试从各种格式去获取时间，如果实在获取不到，就是null
     *
     * @param source
     * @return
     */
    public Date convert(String source) {
        if (source.equals("")) {
            return null;
        } else {
            SimpleDateFormat sdf = null;
            try {
                sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
                return sdf.parse(source);
            } catch (Exception e) {
                try {
                    sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    return sdf.parse(source);
                } catch (Exception e2) {
                    try {
                        sdf = new SimpleDateFormat("yyyy/MM/dd");
                        return sdf.parse(source);
                    } catch (Exception e3) {
                        try {
                            sdf = new SimpleDateFormat("yyyy-MM-dd");
                            return sdf.parse(source);
                        } catch (Exception e4) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }
        return null;
    }


}
