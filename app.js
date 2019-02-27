const Koa = require('koa');
const convert = require('koa-convert');
// const loggerGeneraor = require('./middleware/logger-generator');
const loggerAsync = require('./middleware/logger-async');
const fs = require('fs');
const app = new Koa();

const Router = require('koa-router');

// generator 中间件在 koa2 中使用需要用 koa-convert 封装一下
// app.use(convert(loggerGeneraor()));

app.use(loggerAsync());

// app.use(async ctx => {
//     ctx.body = 'hello koa2';
// });
// 原生路由处理
// app.use(async ctx => {
//     let url = ctx.request.url;
//     let html = await route(url);
//     ctx.body = html;
// })

let home = new Router();
// 子路由1
home.get('/', async (ctx) => {
    let html =  `
        <ul>
            <li><a href="/page/helloworld">/page/helloworld</a></li>
            <li><a href="/page/404">/page/404</a></li>
        </ul>
    `;
    ctx.body = html;
});

let page = new Router();
// 子路由2
page.get('/404', async (ctx) => {
    ctx.body = '404 page';
}).get('/helloworld', async (ctx) => {
    ctx.body = 'helloworld page!';
});

// 装在子路由
let router = new Router();
// allowedMethods，顾名思义：就是当前接口运行的method。 
// 比如，一个提供数据的接口，就可以设置为GET， 
// 当客户端发送POST请求时，就会直接返回失败, koa 会自动设置一些 Header 并返回访问该路由的方法不被允许
router.use('/', home.routes(), home.allowedMethods());
router.use('/page', page.routes(), page.allowedMethods());

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
console.log('[koa-demo] is starting at port 3000');

/** 
 * 异步读取文件
*/
function render(page) {
    return new Promise((resolve, reject) => {
        let viewUrl = `./view/${page}`;
        fs.readFile(viewUrl, "binary", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

/** 
 * 原生路由实现
*/
async function route(url) {
    let view = '404.html';
    switch ( url ) {
        case '/':
            view = 'index.html'
            break
        case '/index':
            view = 'index.html'
            break
        case '/todo':
            view = 'todo.html'
            break
        case '/404':
            view = '404.html'
            break
        default:
            break
    }

    let html = await render(view);
    return html;
}