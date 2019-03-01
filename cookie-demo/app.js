const Koa = require('koa');
const app = new Koa();

app.use(async (ctx) => {
    if (ctx.url === '/index') {
        ctx.cookies.set(
            'cid',
            'hello world',
            {
                domain: 'localhost', // cookie 所在的域名
                path: '/index', // cookie 所在的路径
                maxAge: 10 * 60 * 1000, // cookie有效时长
                expires: new Date('2017-02-15'), // cookie实现时间
                httpOnly: false, // 是否只用于http请求中获取
                overwrite: false, // 是否运行重写
            }
        );
        ctx.body = 'cookie is ok';
    } else {
        ctx.body = 'hello world';
    }
});

app.listen(3000, () => {
    console.log('[demo] cookie is starting at port 3000')
});