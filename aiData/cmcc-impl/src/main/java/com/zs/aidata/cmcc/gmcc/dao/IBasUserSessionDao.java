package com.zs.aidata.cmcc.gmcc.dao;


import com.zs.aidata.cmcc.gmcc.vo.BasUserSessionDO;
import com.zs.aidata.core.tools.BaseCoreDao;
import org.apache.ibatis.annotations.Mapper;


@Mapper
public interface IBasUserSessionDao extends BaseCoreDao<BasUserSessionDO> {
    int deleteByPrimaryKey(Integer pId);

    int insert(BasUserSessionDO record);

    int insertSelective(BasUserSessionDO record);

    BasUserSessionDO selectByPrimaryKey(Integer pId);

    int updateByPrimaryKeySelective(BasUserSessionDO record);

    int updateByPrimaryKey(BasUserSessionDO record);

}