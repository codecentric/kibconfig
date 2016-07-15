'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Mapper = require('../lib/Mapper');

var _Mapper2 = _interopRequireDefault(_Mapper);

var _promiseLimit = require('promise-limit');

var _promiseLimit2 = _interopRequireDefault(_promiseLimit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MAX_CONCURRENT_CONNECTIONS = 20;

var PushCommand = function () {
    function PushCommand(config, client, dataDirectory) {
        (0, _classCallCheck3.default)(this, PushCommand);

        this.config = config;
        this.client = client;
        this.dataDirectory = dataDirectory;
    }

    (0, _createClass3.default)(PushCommand, [{
        key: 'execute',
        value: function execute() {
            return this.upload();
        }
    }, {
        key: 'upload',
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
                var _this = this;

                var files, limit;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.dataDirectory.findAll();

                            case 2:
                                files = _context.sent;
                                limit = (0, _promiseLimit2.default)(MAX_CONCURRENT_CONNECTIONS);
                                _context.next = 6;
                                return _promise2.default.all(files.map(function (file) {
                                    return limit(function () {
                                        return _this.uploadElement(file);
                                    });
                                }));

                            case 6:
                                return _context.abrupt('return', files);

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function upload() {
                return ref.apply(this, arguments);
            }

            return upload;
        }()
    }, {
        key: 'uploadElement',
        value: function uploadElement(fileEntry) {
            var id = fileEntry.id;
            var type = fileEntry.type;
            var content = fileEntry.content;

            var body = _Mapper2.default.mapToRemote(content);

            return this.client.upload(type, id, body);
        }
    }]);
    return PushCommand;
}();

exports.default = PushCommand;
module.exports = exports['default'];