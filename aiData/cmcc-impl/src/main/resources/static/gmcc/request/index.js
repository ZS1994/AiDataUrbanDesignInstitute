import axios from 'axios'
import md5 from 'md5'
import sha1 from 'js-sha1'
import {path} from "../config";
import {createUrl, randomCode} from "../common"
import {getSessionid} from "../sessionid/index"
import _ from 'underscore'

/**
 * ajax请求
 * @param {string} service 服务
 * @param {string} servicePath 接口名
 * @param {object} jsonData 请求数据
 * @param {string} method 请求方式
 * @param {object} header 请求头
 * @param {number} timeout 请求响应时间
 * @return {promise} promise对象
 * */
function sys_doAjax({
                        method = 'POST',
                        service,
                        servicePath,
                        jsonData = {},
                        header = {},
                        timeout = 100000,
                    }) {
    return new Promise((resolve, reject) => {
        const hDefault = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        const h = _.defaults(header, hDefault);
        const url = 'serviceValue/serviceKey/'.replace('serviceValue', path)
            .replace('serviceKey', service);
        const sessionid = getSessionid();
        const params = {
            servicename: servicePath,
            sessionid: sessionid
        };
        const urlP = createUrl(url, params);
        const nonce = randomCode(),
            timestamp = new Date().getTime(),
            sign = sessionid + "," + nonce + "," + timestamp;
        const headerP = {
            "nonce": nonce,
            "timestamp": timestamp,
            "sign": md5(sign).toUpperCase()
        };
        jsonData.header = headerP;
        let reqJson = JSON.stringify(jsonData).replace(/\+/g, "%2B");
        reqJson = reqJson.replace(/\\&/g, "%26");
        axios({
            method: method,
            headers: h,
            url: urlP,
            timeout: timeout,
            data: 'reqJson=data'.replace('data', reqJson)
        }).then((res) => {
            // const data = res.data,
            //     header = data.header,
            //     retCode = header.retCode,
            //     retMsg = header.retMsg;
            setTimeout(function () {
                resolve(res)
            }, 300)
        }).catch((err) => {
            setTimeout(function () {
                reject(err)
            }, 300)
        })
    })
}

function sys_doAjax_upload({
                               method = 'POST',
                               service,
                               servicePath,
                               formData,
                               jsonData = {},
                               header = {},
                               timeout = 100000,
                           }) {
    return new Promise((resolve, reject) => {
        const url = 'serviceValue/serviceKey/'.replace('serviceValue', path)
            .replace('serviceKey', service);
        const sessionid = getSessionid();
        const params = {
            servicename: servicePath,
            sessionid: sessionid
        };
        console.log(sha1('nonce_strb4736ead1530782006370'));
        const urlP = createUrl(url, params);
        const nonce = randomCode(),
            timestamp = new Date().getTime(),
            sign = nonce + "" + sessionid + "" + timestamp;
        const headerP = _.defaults(jsonData, {
            'Content-Type': 'multipart/form-data',
            "nonce_str": nonce,
            "timestamp": timestamp,
            "sign": sha1(sign),
            "channelId": "gmccweb"
        });
        const h = _.defaults(header, headerP);
        // formData.append("reqJson", JSON.stringify(jsonData))
        axios({
            method: method,
            headers: h,
            url: urlP,
            timeout: timeout,
            data: formData
        }).then((res) => {
            // const data = res.data,
            //     header = data.header,
            //     retCode = header.retCode,
            //     retMsg = header.retMsg;
            setTimeout(function () {
                resolve(res)
            }, 300)
        }).catch((err) => {
            setTimeout(function () {
                reject(err)
            }, 300)
        })
    })
}

export {
    sys_doAjax,
    sys_doAjax_upload
}