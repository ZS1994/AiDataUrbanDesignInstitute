import {sys_doAjax} from "../request/index"
import _ from "underscore"

let sessionid = '';

/**
 * 获取sessionid
 * */
const getSessionid = () => {
    return sessionid
};
/**
 * 设置sessionid
 * */
const setSessionid = (sessionId) => {
    sessionid = sessionId
};

/**
 * 获取随机数
 * */
function getRandom(length){
    var res = Math.random().toString().slice(2);
    if(res.length > length) return res.slice(0,length);
    while(res.length < length){
        res += Math.floor(Math.random() * 10)
    }
    return res;
}

/**
 * 请求获取sessionid
 * @param {string} service 服务
 * @param {object} jsonData 请求数据
 * @param {string} method 请求方式
 * @param {object} header 请求头
 * @param {number} timeout 请求响应时间
 * @return {promise} promise对象
 * */
function sessionidRequest({
                              method = 'POST',
                              service,
                              jsonData = {},
                              header = {},
                              timeout = 100000
                          }) {
    const data = _.defaults(jsonData,{
        'equipmentNo': 'WEB',
        'mobileSystem': 'WEB',
        'mobileType': 'WEB',
        'mobileView': 'WEB',
        'appVersion': '5.4.0',
        'channelId': '',
        'distribution': 'WEB',
        'appId': getRandom(32),
        'appUid': getRandom(32)
    });
    return new Promise(function (resolve, reject) {
        sys_doAjax({
            method,
            service: service || 'autologin',
            servicePath: 'GMCCAPP_000_000_000_000',
            jsonData: data,
            header,
            timeout
        }).then((res) => {
            const data = res.data,
                result = data.result;
            if (result === '000'){
                const session = data.sessionId;
                resolve(session)
            }else{
                reject(res)
            }
        }).catch((res) => {
            reject(res)
        })
    })
}


export {
    getSessionid,
    setSessionid,
    sessionidRequest
}