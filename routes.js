/*
 * @Author: dmyang
 * @Date:   2015-07-31 11:41:38
 * @Last Modified by:   dmyang
 * @Last Modified time: 2015-08-03 20:05:39
 */

'use strict';

var proxy = require('koa-proxy');

var countryList = require('./mock/countryList');

var jsonp = function(json) {
    var callback = this.query.callback || 'jsonp';
    if (Object.getPrototypeOf(json) === Object.prototype) {
        json = JSON.stringify(json);
    }
    return callback + '(' + json + ')';
};

module.exports = function(router, bodyParser, app) {
    // 推荐有奖 - 信息汇总接口
    router.get('/api/paySuccess/fund/getWay/', function*() {
        this.body = getFundWay
    })

    router.get('/prize/privilege', function*() {
        this.body = jsonp.call(this, iclubPower);
    });

    router.post('/api/discoveryActivity/upload/uploadImage', bodyParser, function*() {
        this.body = {
            "code": 0,
            "msg": "OK",
            "data": [
                "http://b.appsimg.com/2016/08/11/788/fxact/14708926832232.jpg"
            ]
        }
    });
};
