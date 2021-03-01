package com.zs.aidata.core.tools;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 一些通用工具
 *
 * @author 张顺
 * @since 2020/10/18
 */
public class ValueUtils {

    public static String FORMAT_DATE_14 = "yyyyMMddHHmmss";
    public static String FORMAT_DATE_NORMAL = "yyyy/MM/dd HH:mm:ss";


    /**
     * 判断一个对象是不是空，
     * 空的含义是：null，空的字符串，空的list，空的map
     *
     * @param o
     * @return
     */
    public static boolean isEmpty(Object o) {
        if (o == null) {
            return true;
        }
        if (o instanceof String) {
            return ((String) o).length() == 0;
        }
        if (o instanceof List) {
            List list = (List) o;
            return list.size() == 0;
        }
        if (o instanceof Map) {
            Map map = (Map) o;
            return map.keySet().size() == 0;
        }
        return false;
    }

    public static boolean isNotEmpty(Object o) {
        return !isEmpty(o);
    }


    /**
     * 非空检验
     *
     * @param obj
     * @param fieldNames
     * @throws Exception
     */
    public static void checkNotEmpty(Object obj, String... fieldNames) throws Exception {
        if (isEmpty(obj)) {
            throw new AiDataApplicationException("对象为空");
        }
        for (String field : fieldNames) {
            if (isEmpty(getFieldValue(obj, field))) {
                throw new AiDataApplicationException("属性{0}值不能为空", field);
            }
        }
    }

    public static Object getFieldValue(Object object, String fieldName) throws Exception {
        //我们项目的所有实体类都继承BaseDomain （所有实体基类：该类只是串行化一下）
        //不需要的自己去掉即可
        Object value = "";
        if (object != null && object instanceof BaseEntityVO) {//if (object!=null )  ----begin
            // 拿到该类
            Class<?> clz = object.getClass();
            // 获取实体类的所有属性，返回Field数组
            Field[] fields = clz.getDeclaredFields();
            // 找出field
            Field field = null;
            for (Field f : fields) {
                if (f.getName().equals(fieldName)) {
                    field = f;
                    break;
                }
            }
            if (isEmpty(field)) {
                throw new AiDataApplicationException("找不到{0}字段", fieldName);
            }
            // 拿到该属性的gettet方法
            /**
             * 这里需要说明一下：他是根据拼凑的字符来找你写的getter方法的
             * 在Boolean值的时候是isXXX（默认使用ide生成getter的都是isXXX）
             * 如果出现NoSuchMethod异常 就说明它找不到那个gettet方法 需要做个规范
             */
            Method m = (Method) object.getClass().getMethod("get" + getMethodName(field.getName()));
            String val = (String) m.invoke(object);// 调用getter方法获取属性值
            if (isNotEmpty(val)) {
                value = val;
            }
        }
        return value;
    }

    // 把一个字符串的第一个字母大写、效率是最高的、
    private static String getMethodName(String fildeName) {
        byte[] items = fildeName.getBytes();
        items[0] = (byte) ((char) items[0] - 'a' + 'A');
        return new String(items);
    }


    /**
     * 日期转为相应格式的字符串
     *
     * @param date   为null默认当前时间
     * @param format 为空默认14格式
     * @return
     */
    public static String toDateString(Date date, String format) {
        if (isEmpty(date)) {
            date = new Date();
        }
        if (isEmpty(format)) {
            format = FORMAT_DATE_14;
        }
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        return sdf.format(date);
    }

    public static String getMD5Str(String str) {
        byte[] digest = null;
        try {
            MessageDigest md5 = MessageDigest.getInstance("md5");
            digest = md5.digest(str.getBytes("utf-8"));
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        //16是表示转换为16进制数
        String md5Str = new BigInteger(1, digest).toString(16);
        return md5Str;
    }

    public static HttpServletRequest getRequest() {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return servletRequestAttributes.getRequest();
    }


    public static Date addHours(Date date, int hour) {
        if (isEmpty(date)) {
            date = new Date();
        }
        date.setTime(date.getTime() + (1000 * 60 * 60) * hour);
        return date;
    }

}
