/** 
 * 读取请求内容
*/

const path = require('path');
const fs = require('fs');

// 封装读取目录内容方法
const dir = require('./dir');

// 封装读取文件内容方法
const file = require('./file');

/**
 * 获取静态资源内容
 * @param  {object} ctx koa上下文
 * @param  {string} 静态资源目录在本地的绝对路径
 * @return  {string} 请求获取到的本地内容
 */
async function content(ctx, fullStaticPath) {
    let reqPath = path.join(fullStaticPath, ctx.url);

    // 判断请求路径是否为存在目录或者文件
    let exist = fs.existsSync(reqPath);

    let content = '';

    if (!exist) {
        content = '404 Not Found!';
    } else {
        let stat = fs.statSync(reqPath);
        if (stat.isDirectory()) {
            //如果为目录，则渲读取目录内容
            content = dir(ctx.url, reqPath);
        } else {
            content = await file(reqPath);
        }
    }

    return content;
}

module.exports = content;