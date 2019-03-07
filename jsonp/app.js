/** 
 * JSONP跨域输出的数据是可执行的JavaScript代码
 * ctx输出的类型应该是'text/javascript'
 * ctx输出的内容为可执行的返回数据JavaScript代码字符串
 * 需要有回调函数名callbackName，前端获取后会通过动态执行JavaScript代码字符，获取里面的数据
*/

const Koa = require('koa');
const jsonp = require('koa-jsonp');
const app = new Koa();

app.use(jsonp());
app.use(async (ctx) => {
    let returnData = {
        success: true,
        data: {
            text: 'this is a jsonp api',
            time: new Date().getTime(),
        }
    };

    // 直接输出 json
    ctx.body = returnData;
    // if (ctx.method === 'GET' && ctx.url.split('?')[0] === '/getData.jsonp') {
    //     // 读取 jsonp 的 callback
    //     let callbackName = ctx.query.callback || 'callback';
    //     let returnData = {
    //         success: true,
    //         data: {
    //             text: 'This is a jsonp API',
    //             time: new Date().getTime()
    //         }
    //     }

    //     // jsonp的 script 字符串
    //     let jsonpStr = `;${callbackName}(${JSON.stringify(returnData)})`;

    //     // 用 text/javascript 让请求支持跨域获取
    //     ctx.type = 'text/javascript';
    //     // 输出 jsonp 字符串
    //     ctx.body = jsonpStr;
    // } else {
    //     ctx.body = 'Hello jsonp';
    // }
}); 

app.listen(3000, () => {
    console.log('[demo] jsonp is starting at port 3000');
});