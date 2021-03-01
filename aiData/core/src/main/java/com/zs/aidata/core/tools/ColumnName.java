package com.zs.aidata.core.tools;

import java.io.ByteArrayInputStream;

public class ColumnName {
	
	/**
	 * 2017-2-23， 张顺
	 * 将对象的属性名转换成数据库的列名，Datagrid排序会用到
	 * @return
	 */
	public static String transToUnderline(String colName) {
		if (colName!=null) {
			ByteArrayInputStream bin = new ByteArrayInputStream(colName.getBytes());
			int t = 0;
			while((t = bin.read()) != -1){
				char c = (char)t;
				if((c >='A')&&(c <= 'Z')){
					colName=colName.replace(String.valueOf(c), "_"+String.valueOf(c).toLowerCase());
				}
				if (Character.isDigit(c)) {
					colName=colName.replace(String.valueOf(c), "_"+String.valueOf(c));
				}
			}
		}
		return colName;
	}
	
}
