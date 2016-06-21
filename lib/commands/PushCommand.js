'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _Mapper = require('../lib/Mapper');

var _Mapper2 = _interopRequireDefault(_Mapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PushCommand = function () {
    function PushCommand(config, client, dataDirectory) {
        (0, _classCallCheck3.default)(this, PushCommand);

        this.config = config;
        this.client = client;
        this.dataDirectory = dataDirectory;
    }

    (0, _createClass3.default)(PushCommand, [{
        key: 'execute',
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return this.upload();

                            case 3:
                                _context.next = 8;
                                break;

                            case 5:
                                _context.prev = 5;
                                _context.t0 = _context['catch'](0);

                                console.error(_context.t0);

                            case 8:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 5]]);
            }));

            function execute() {
                return ref.apply(this, arguments);
            }

            return execute;
        }()
    }, {
        key: 'upload',
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
                var files;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.dataDirectory.findAll();

                            case 2:
                                files = _context2.sent;
                                _context2.next = 5;
                                return _promise2.default.all(files.map(this.uploadElement.bind(this)));

                            case 5:
                                return _context2.abrupt('return', files);

                            case 6:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
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