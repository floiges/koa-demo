/** 
 * generator 中间件开发
*/
function log(ctx) {
    console.log(ctx.method, ctx.header.host + ctx.url);
}

module.exports = function() {
    return function *(next) {
        // 执行中间件操作
        log(this);

        if (next) {
            yield next;
        }
    }
}