const Koa = require('koa');
const path = require('path');
const static = require('koa-static');
const content = require('./util/content'); // 手动解析静态内容
const mimes = require('./util/mime');

const app = new Koa();

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './static';
app.use(static(path.join(__dirname, staticPath)));

// function parseMime(url) {
//     let extName = path.extname(url);
//     extName = extName ?  extName.slice(1) : 'unknown';
//     return  mimes[ extName ];
// }

app.use(async (ctx) => {
    ctx.body = 'hello world';
    // // 静态资源目录在本地的绝对路径
    // let fullStaticPath = path.join(__dirname, staticPath);

    // // 获取静态资源内容，有可能是文件内容，目录，或404
    // let _content = await content(ctx, fullStaticPath);

    // let _mime = parseMime(ctx.url);

    // // 如果有对应的文件类型，就配置
    // if (_mime) {
    //     ctx.type = _mime;
    // }

    // if (_mime && _mime.indexOf('image/') >= 0) {
    //     // 如果是图片，输出二进制
    //     ctx.res.writeHead(200);
    //     ctx.res.write(_content, 'binary');
    //     ctx.res.end();
    // } else {
    //     // 输出文本
    //     ctx.body = _content;
    // }
});

app.listen(3000, () => {
    console.log('[demo] static-server is starting at port 3000');
});