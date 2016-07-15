'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _promiseRequest = require('../lib/promiseRequest');

var _promiseRequest2 = _interopRequireDefault(_promiseRequest);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var KibanaClient = function () {
    function KibanaClient(config) {
        (0, _classCallCheck3.default)(this, KibanaClient);

        this.url = config.url;
        this.query = config.query;
        this.verbose = config.verbose;
        this.checkConfig();
    }

    (0, _createClass3.default)(KibanaClient, [{
        key: 'checkConfig',
        value: function checkConfig() {
            (0, _assert2.default)(this.url, '<url> is required');
        }
    }, {
        key: 'findAll',
        value: function findAll() {
            var url = this.url + '/.kibana/_search?size=1000&q=' + encodeURIComponent(this.query);

            if (this.verbose) {
                console.log('Querying via ' + url);
            }

            return _promiseRequest2.default.get(url).set('Accept', 'application/json').promise().then(function (result) {
                return result.body.hits.hits;
            });
        }
    }, {
        key: 'delete',
        value: function _delete(type, id) {
            var url = this.url + '/.kibana/' + type + '/' + id;

            if (this.verbose) {
                console.log('Deleting ' + url);
            }

            return _promiseRequest2.default.delete(url).promise().then(function () {
                return { type: type, id: id };
            });
        }
    }, {
        key: 'upload',
        value: function upload(type, id, body) {
            var url = this.url + '/.kibana/' + type + '/' + encodeURIComponent(id);

            if (this.verbose) {
                console.log('Uploading to ' + url);
            }

            return _promiseRequest2.default.put(url).send(body).promise().then(function () {
                return { id: id, body: body };
            }).catch(function (err) {
                console.error('Error uploading ' + url + ': ' + err.message);
                throw err;
            });
        }
    }]);
    return KibanaClient;
}();

exports.default = KibanaClient;
module.exports = exports['default'];