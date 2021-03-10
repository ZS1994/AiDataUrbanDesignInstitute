package com.zs.aidata.core.tools;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.io.Serializable;
import java.util.Date;

/**
 * 实体类的基类
 *
 * @author 张顺
 * @since 2020/10/18
 */
public class BaseEntityVO implements Serializable {
    // 物理主键
    private Integer pId;

    // 应用id
    private String appId;

    // 创建人id
    private String creationById;

    // 创建人名称
    private String creationByUser;

    // 创建时间
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date creationDate;

    // 修改人id
    private String lastUpdatedById;

    // 修改人名称
    private String lastUpdatedByUser;

    // 修改时间
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date lastUpdatedDate;

    //-------------------------------------------

    public Integer getpId() {
        return pId;
    }

    public void setpId(Integer pId) {
        this.pId = pId;
    }

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getCreationById() {
        return creationById;
    }

    public void setCreationById(String creationById) {
        this.creationById = creationById;
    }

    public String getCreationByUser() {
        return creationByUser;
    }

    public void setCreationByUser(String creationByUser) {
        this.creationByUser = creationByUser;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public String getLastUpdatedById() {
        return lastUpdatedById;
    }

    public void setLastUpdatedById(String lastUpdatedById) {
        this.lastUpdatedById = lastUpdatedById;
    }

    public String getLastUpdatedByUser() {
        return lastUpdatedByUser;
    }

    public void setLastUpdatedByUser(String lastUpdatedByUser) {
        this.lastUpdatedByUser = lastUpdatedByUser;
    }

    public Date getLastUpdatedDate() {
        return lastUpdatedDate;
    }

    public void setLastUpdatedDate(Date lastUpdatedDate) {
        this.lastUpdatedDate = lastUpdatedDate;
    }
}
