import {YDRZ} from './YDRZ.min'
import {sys_doAjax} from '../request/index'

/**
 * 4G取号嵌码
 * */
function getMobileNumberBy4GEmbeddedCode() {
    var appId = '300011877495';
    var _udataProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
    // document.write(unescape("%3Cscript src='" + _udataProtocol + "da.mmarket.com/udata/udata.js%3faid%"+appId+"' type='text/javascript'%3E%3C/script%3E"));
    let $el = document.createElement('script');
    $el.setAttribute('src',unescape(_udataProtocol+'da.mmarket.com/udata/udata.js%3faid%'+appId));
    $el.setAttribute('type',unescape('text/javascript'));
    document.body.appendChild($el)
}

function getMNumberBy4GInit() {
    let meta = document.createElement('meta');
    meta.content='always';
    meta.name='referrer';
    document.getElementsByTagName('head')[0].appendChild(meta);
    getMobileNumberBy4GEmbeddedCode()
}

/**
 * 智能链接准签名
 * @param {string} bussinessId 业务Id
 * */
function signVerify({
                        bussinessId = ''
                    }) {
    return new Promise((resolve, reject) => {
        const appId = '300011877495',
            version = '1.2';
        sys_doAjax({
            service: 'login',
            servicePath: 'GMCCAPP_000_000_002_006',
            jsonData: {
                rawData: YDRZ.getSign(appId, version),
                bussinessId: bussinessId
            }
        }).then((res) => {
            const data = res.data;
            const result = data.result;
            const desc = data.desc;
            if (result === '000') {
                let sign = data.sign;
                YDRZ.getTokenInfo({
                    data: {//请求的参数
                        version: version, //接口版本号 （必填）
                        appId: appId, //应用Id （必填）
                        sign: sign,//RSA加密后的sign（必填）
                        openType: '1', //移动取号接口填写1,三网取号接口填写0 （必填）
                        // expandParams: encodeURI('phoneNum=13824947127'),//扩展参数  格式：参数名=值  多个时使用 | 分割 （选填）
                        expandParams: '',//扩展参数  格式：参数名=值  多个时使用 | 分割 （选填）
                        isTest: '1'//是否启用测试线地址（传0时为启用不为0或者不传时为不启用）
                    },
                    success: function (res) {//成功回调
                        if (res.code === '000000') {
                            resolve({
                                bussinessId: bussinessId,
                                token: res.token,
                                userInformation: encodeURIComponent(res.userInformation),
                            })
                        }else{
                            reject(res.message);
                        }
                    },
                    error: function (res) {//错误回调
                        reject(res.message);
                    }
                })
            }else{
                reject(desc)
            }
        }).catch((res) => {
            reject(res.message)
        })
    })
}

/**
 * 智能链接token校验
 * @param {string} bussinessId 业务Id
 * @param {string} token
 * @param {string} userInformation
 * */
function tokenVerify({
                         bussinessId = '',
                         token,
                         userInformation
                     }) {
    return new Promise((resolve, reject) => {
        sys_doAjax({
            service: 'login',
            servicePath: 'GMCCAPP_000_000_002_007',
            jsonData: {
                token: token,
                userInformation: userInformation,
                bussinessId: bussinessId
            }
        }).then((res) => {
            const data = res.data;
            const result = data.result;
            const desc = data.desc;
            if (result === '000') {
                resolve({
                    mobileNumber: data.mobileNumber
                })
            }else{
                reject(desc)
            }
        }).catch((res) => {
            reject(res.message)
        })
    })
}

/**
 * 智能链接登录
 * @param {string} bussinessId 业务Id
 * */
function loginMNumberBy4G({
                                   bussinessId = '',
                                    channelId = ''
                               }) {
    return new Promise((resolve, reject) => {
        sys_doAjax({
            service: 'login',
            servicePath: 'GMCCAPP_000_000_002_008',
            jsonData: {
                bussinessId: bussinessId,
                channelId: channelId
            }
        }).then((res) => {
            const data = res.data;
            const result = data.result;
            const desc = data.desc;
            if (result === '000') {
                resolve({
                    mobileNumber: data.mobileNumber,
                    prodToken: data.prodToken
                })
            }else{
                reject(desc)
            }
        }).catch((res) => {
            reject(res.message)
        })
    })
}

/**
 * 4G获取手机号码
 * @param {string} bussinessId 业务Id
 * */
function getMNumberBy4G({
                            bussinessId = ''
                        }) {
    return new Promise((resolve, reject) => {
        signVerify({
            bussinessId
        }).then((data) => {
            tokenVerify({
                token: data.token,
                userInformation: data.userInformation,
                bussinessId: data.bussinessId
            }).then((data) => {
                resolve({
                    mobileNumber: data.mobileNumber
                })
            }).catch((msg) => {
                reject(msg)
            })
        }).catch((msg) => {
            reject(msg)
        })
    })
}

export {
    getMNumberBy4G,
    loginMNumberBy4G,
    getMNumberBy4GInit
}
