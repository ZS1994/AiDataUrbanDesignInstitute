package com.zs.aidata.core.tools;

import java.text.MessageFormat;

/**
 * 该项目唯一指定的自定义异常
 *
 * @author 张顺
 * @since 2020/10/18
 */
public class AiDataApplicationException extends RuntimeException {

    private String message;

    /**
     * 会自动替换里面的关键字。{0}，{1}，{2}。。。。{n}。
     * 注意：下标从0开始
     *
     * @param modelMessage
     * @param keyWords
     */
    public AiDataApplicationException(String modelMessage, String... keyWords) {
        for (int i = 0; i < keyWords.length; i++) {
            modelMessage = modelMessage.replace("{" + i + "}", keyWords[i]);
        }
        fillInStackTrace();
        message = modelMessage;
        this.printStackTrace();
    }


    public AiDataApplicationException(String msg) {
        super(msg);
        message = msg;
        this.printStackTrace();
    }

    @Override
    public String getMessage() {
        return message;
    }

    @Override
    public String toString() {
        return MessageFormat.format("{0}", getMessage());
    }
}
