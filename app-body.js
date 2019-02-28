const Koa = require('koa');
const convert = require('koa-convert');
const bodyParser = require('koa-bodyparser');
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

// let home = new Router();
// 子路由1
// home.get('/', async (ctx) => {
//     let html =  `
//         <ul>
//             <li><a href="/page/helloworld">/page/helloworld</a></li>
//             <li><a href="/page/404">/page/404</a></li>
//         </ul>
//     `;
//     ctx.body = html;
// });

// let page = new Router();
// 子路由2
// page.get('/404', async (ctx) => {
//     ctx.body = '404 page';
// }).get('/helloworld', async (ctx) => {
//     ctx.body = 'helloworld page!';
// });

// 装在子路由
// let router = new Router();
// allowedMethods，顾名思义：就是当前接口运行的method。 
// 比如，一个提供数据的接口，就可以设置为GET， 
// 当客户端发送POST请求时，就会直接返回失败, koa 会自动设置一些 Header 并返回访问该路由的方法不被允许
// router.use('/', home.routes(), home.allowedMethods());
// router.use('/page', page.routes(), page.allowedMethods());

// // 加载路由中间件
// app.use(router.routes()).use(router.allowedMethods());

// 使用 body-parser 中间件
app.use(bodyParser());
app.use( async ( ctx ) => {

    if ( ctx.url === '/' && ctx.method === 'GET' ) {
        // 当GET请求时候返回表单页面
        let html = `
            <h1>koa2 request post demo</h1>
            <form method="POST" action="/">
            <p>userName</p>
            <input name="userName" /><br/>
            <p>nickName</p>
            <input name="nickName" /><br/>
            <p>email</p>
            <input name="email" /><br/>
            <button type="submit">submit</button>
            </form>
        `
        ctx.body = html
    } else if ( ctx.url === '/' && ctx.method === 'POST' ) {
        // 当POST请求的时候，解析POST表单里的数据，并显示出来
        // let postData = await parsePostData( ctx )
        let postData = ctx.request.body;
        ctx.body = postData
    } else {
        // 其他请求显示404
        ctx.body = '<h1>404！！！ o(╯□╰)o</h1>'
    }
})

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

/** 
 * ctx.request是context经过封装的请求对象，ctx.req是context提供的node.js原生HTTP请求对象，
 * 同理ctx.response是context经过封装的响应对象，ctx.res是context提供的node.js原生HTTP请求对象。
 * 对于POST请求的处理，koa2没有封装获取参数的方法，需要通过解析上下文context中的原生node.js请求对象req
*/

function parsePostData(ctx) {
    return new Promise((resolve, reject) => {
        try {
            let postData = '';
            ctx.req.addListener('data', (data) => {
                postData += data;
            });
            ctx.req.addListener('end', function() {
                let parseData = parseQueryStr(postData);
                resolve(parseData);
            });
        } catch (err) {
            reject(err);
        }
    });
}

/** 
 * 将 POST 请求参数字符串解析成 json
*/
function parseQueryStr(queryStr) {
    let queryData = {};
    let queryStrList = queryStr.split('&');
    console.log(queryStrList);

    for (let [index, queryStr] of queryStrList.entries()) {
        let itemList = queryStr.split('=');
        queryData[itemList[0]] = decodeURIComponent(itemList[1]);
    }
    return queryData;
}