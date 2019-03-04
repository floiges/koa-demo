const inspect = require('util').inspect;
const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy'); // 用来解析出请求中的文件流

/**
 * 同步创建文件目录
 *
 * @param {string} dirname 目录绝对地址
 * @return {boolean} 创建结果
 */
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    }

    if (mkdirsSync(path.dirname(dirname))) { // 先创建父目录
        fs.mkdirSync(dirname); // 创建当前目录
        return true;
    }
}

/**
 * 获取文件后缀名
 *
 * @param {*} fileName
 * @returns
 */
function getSuffixName(fileName) {
    let nameList = fileName.split('.');
    return nameList[nameList.length - 1];
}

function uploadFile(ctx, options) {
    let req = ctx.req, 
        busboy = new Busboy({headers: req.headers});
    
    let fileType = options.fileType || 'common',
        filePath = path.join(options.path, fileType);

    mkdirsSync(filePath);
    
    return new Promise((resolve, reject) => {
        console.log('文件上传中...');
        let result = {
            success: false,
            formData: {}
        };

        // 解析请求文件事件
        busboy.on('file', function(fieldname, file, filename, encoding, mimeType) {
            let fileName = Math.random().toString(16).substr(2) + '.' + getSuffixName(filename);
            let _uploadFilePath = path.join(filePath, fileName);
            let saveTo = path.join(_uploadFilePath);

            // 文件保存到指定的路径
            file.pipe(fs.createWriteStream(saveTo));

            // 文件写入事件结束
            file.on('end', function() {
                result.success = true;
                result.message = '文件上传成功';
                console.log('文件上传成功');
                resolve(result);
            });
        });

        // 解析表单中其他字段信息
        busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            console.log('表单字段数据 [' + fieldname + ']: value: ' + inspect(val));
            result.formData[fieldname] = inspect(val);
        });

        // 解析事件结束
        busboy.on('finish', function() {
            console.log('文件上结束')
            resolve(result)
        });
        
        // 解析错误事件
        busboy.on('error', function(err) {
            console.log('文件上出错')
            reject(result)
        });

        req.pipe(busboy);
    });
}

module.exports = {
    uploadFile
};