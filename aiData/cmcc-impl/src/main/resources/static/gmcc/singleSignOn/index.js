import {sys_doAjax} from "../request/index"
import _ from "underscore"

/**
 * 单点登录
 * @param {string} service 服务
 * @param {object} jsonData 请求数据
 * @param {string} method 请求方式
 * @param {object} header 请求头
 * @param {number} timeout 请求响应时间
 * @return {promise} promise对象
 * */
function singleSignOn({
                          method = 'POST',
                          service,
                          jsonData = {},
                          header = {},
                          timeout = 100000
                      }) {
    const data = _.defaults(jsonData,{
        url: '',
        channelId: '',
        power: '',
        businessId: '',
    });
    return new Promise(function (resolve, reject) {
        sys_doAjax({
            method,
            service: service || 'local',
            servicePath: 'GMCCAPP_305_004_001_001',
            jsonData: data,
            header,
            timeout
        }).then((res) => {
            const data = res.data,
                result = data.result;
            if (result === '000'){
                const url = data.url;
                resolve(url)
            }else{
                reject(res)
            }
        }).catch((res) => {
            reject(res)
        })
    })
}

export {
    singleSignOn
}