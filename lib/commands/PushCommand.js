'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var _promiseRequest = require('../lib/promiseRequest');

var _promiseRequest2 = _interopRequireDefault(_promiseRequest);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PushCommand = function () {
    function PushCommand(program) {
        (0, _classCallCheck3.default)(this, PushCommand);

        this.baseUrl = program.url;
        this.dataDir = program.datadir || './data';
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
                                return this.uploadElementsOfType('search');

                            case 3:
                                _context.next = 5;
                                return this.uploadElementsOfType('visualization');

                            case 5:
                                _context.next = 7;
                                return this.uploadElementsOfType('dashboard');

                            case 7:
                                _context.next = 12;
                                break;

                            case 9:
                                _context.prev = 9;
                                _context.t0 = _context['catch'](0);

                                console.error(_context.t0);

                            case 12:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 9]]);
            }));

            function execute() {
                return ref.apply(this, arguments);
            }

            return execute;
        }()
    }, {
        key: 'uploadElementsOfType',
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(type) {
                var _this = this;

                var directory, exists, files;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                directory = this.dataDir + '/' + type;
                                _context2.next = 3;
                                return _fsPromise2.default.exists(directory);

                            case 3:
                                exists = _context2.sent;


                                console.log('Uploading ' + type + ' directory');

                                if (!exists) {
                                    _context2.next = 12;
                                    break;
                                }

                                _context2.next = 8;
                                return _fsPromise2.default.readdir(directory);

                            case 8:
                                _context2.t0 = function (name) {
                                    return name.endsWith('.json');
                                };

                                files = _context2.sent.filter(_context2.t0);
                                _context2.next = 12;
                                return _promise2.default.all(files.map(function (name) {
                                    return _this.uploadElement(type, name);
                                }));

                            case 12:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function uploadElementsOfType(_x) {
                return ref.apply(this, arguments);
            }

            return uploadElementsOfType;
        }()
    }, {
        key: 'uploadElement',
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(type, name) {
                var text, content, id, body, url;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return _fsPromise2.default.readFile(this.dataDir + '/' + type + '/' + name, 'utf8');

                            case 2:
                                text = _context3.sent;
                                content = JSON.parse(text);
                                id = content.id;
                                body = PushCommand.mapToRemote(content);
                                url = this.baseUrl + '/.kibana/' + type + '/' + id;


                                console.log('Uploading \'' + id + '\' to ' + url);
                                _context3.next = 10;
                                return _promiseRequest2.default.put(url).send(body).promise();

                            case 10:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function uploadElement(_x2, _x3) {
                return ref.apply(this, arguments);
            }

            return uploadElement;
        }()
    }], [{
        key: 'register',
        value: function register(program) {
            program.command('push').description('Pushes all local config objects to the remote server').action(function (command, options) {
                new PushCommand(program, command, options).execute();
            });
        }
    }, {
        key: 'mapToRemote',
        value: function mapToRemote(content) {
            var target = JSON.parse((0, _stringify2.default)(content));

            delete target.id;
            if (target.visState) {
                target.visState = (0, _stringify2.default)(target.visState);
            }
            PushCommand.replaceJsWithJson(target);
            if (target.kibanaSavedObjectMeta) {
                PushCommand.replaceJsWithJson(target.kibanaSavedObjectMeta);
            }
            return target;
        }
    }, {
        key: 'replaceJsWithJson',
        value: function replaceJsWithJson(target) {
            (0, _keys2.default)(target).forEach(function (key) {
                if (key.endsWith('JSON')) {
                    target[key] = (0, _stringify2.default)(target[key]); // eslint-disable-line no-param-reassign
                }
            });
        }
    }]);
    return PushCommand;
}();

exports.default = PushCommand;
module.exports = exports['default'];