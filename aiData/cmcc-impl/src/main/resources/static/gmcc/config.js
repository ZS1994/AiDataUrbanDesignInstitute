const htp = /^https/.test(window.location.href) ? 'https' : 'http';

const path = ({
    development: './mock',
    production: htp+'://gd.10086.cn/gmccapp',
    test: htp+'://gd.10086.cn/gmccuat'
})[process.env.NODE_ENV];
const gmccAPPId = ({
    development: 'f5dc2c42bd254ec1b8e56485c04f14dd',
    production: '51cc2c2ac500435e91ca9ca1b0449baa',
    test: 'f5dc2c42bd254ec1b8e56485c04f14dd'
})[process.env.NODE_ENV];
console.log(process.env.NODE_ENV);

export {
    path,
    gmccAPPId
}