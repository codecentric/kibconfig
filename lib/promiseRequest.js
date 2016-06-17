'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _arguments = arguments;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var superagent = module.exports = require('superagent');
var Request = superagent.Request;

Request.prototype.promise = function promise() {
    var _this = this;

    return new _promise2.default(function (resolve, reject) {
        _this.end(function (err, result) {
            if (err && result && !result.ok) {
                var msg = 'Cannot ' + _this.method + ' ' + _this.url + ' (' + result.status + ')';
                var error = new Error(msg, err);

                error.result = result;
                error.status = result.status;
                error.body = result.body;
                reject(error);
            } else if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

Request.prototype.then = function () {
    var promise = undefined.promise();

    return promise.then.apply(promise, _arguments);
};