const supertest = require('supertest'); // http 请求测试库
const chai = require('chai'); // 断言库
const app = require('../app');

const expect = chai.expect;
const request = supertest(app.listen()); // 加载服务的入口文件

describe('开始测试GET请求', () => {
    // 测试用例
    it('测试/getString.json请求', (done) => {
        request
            .get('/getString.json')
            .expect(200)
            .end((err, res) => {
                // 断言判断结果是否为object类型
                expect(res.body).to.be.an('object');
                expect(res.body.success).to.be.an('boolean');
                expect(res.body.data).to.be.an('string');
                done();
            });
    });
});