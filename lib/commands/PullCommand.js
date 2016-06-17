'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var _promiseRequest = require('../lib/promiseRequest');

var _promiseRequest2 = _interopRequireDefault(_promiseRequest);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PullCommand = function () {
    function PullCommand(program, command) {
        (0, _classCallCheck3.default)(this, PullCommand);

        this.baseUrl = command.url;
        this.targetDir = './data';
    }

    (0, _createClass3.default)(PullCommand, [{
        key: 'execute',
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
                var result, entries;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return this.mkdirIfMissing(this.targetDir);

                            case 3:
                                _context.next = 5;
                                return _promiseRequest2.default.get(this.baseUrl + '/.kibana/_search?size=1000&q=*').set('Accept', 'application/json').promise();

                            case 5:
                                result = _context.sent;
                                entries = result.body.hits.hits;
                                _context.next = 9;
                                return this.createDirectories(entries);

                            case 9:
                                _context.next = 11;
                                return _promise2.default.all(entries.map(this.storeEntry.bind(this)));

                            case 11:
                                process.exit(0);
                                _context.next = 18;
                                break;

                            case 14:
                                _context.prev = 14;
                                _context.t0 = _context['catch'](0);

                                console.error(_context.t0);
                                process.exit(1);

                            case 18:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 14]]);
            }));

            function execute() {
                return ref.apply(this, arguments);
            }

            return execute;
        }()
    }, {
        key: 'storeEntry',
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(entry) {
                var name, filename, jsonContent, content;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!entry._type) {
                                    _context2.next = 8;
                                    break;
                                }

                                name = PullCommand.idToFilename(entry._id);
                                filename = this.targetDir + '/' + entry._type + '/' + name + '.json';
                                jsonContent = PullCommand.mapToLocal(entry._source);
                                content = (0, _stringify2.default)(jsonContent, null, 4);


                                console.log('Updating ' + filename);
                                _context2.next = 8;
                                return _fsPromise2.default.writeFile(filename, content, 'utf8');

                            case 8:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function storeEntry(_x) {
                return ref.apply(this, arguments);
            }

            return storeEntry;
        }()
    }, {
        key: 'createDirectories',
        value: function createDirectories(entries) {
            var _this = this;

            var distinctTypes = (0, _from2.default)(new _set2.default(entries.map(function (entry) {
                return entry._type;
            })));

            return _promise2.default.all(distinctTypes.map(function (type) {
                return _this.mkdirIfMissing(_this.targetDir + '/' + type);
            }));
        }
    }, {
        key: 'mkdirIfMissing',
        value: function mkdirIfMissing(typeDir) {
            return _fsPromise2.default.exists(typeDir).then(function (exists) {
                var promise = _promise2.default.resolve();

                if (!exists) {
                    promise = _fsPromise2.default.mkdir(typeDir);
                }
                return promise;
            });
        }
    }], [{
        key: 'register',
        value: function register(program) {
            program.command('pull').description('Pulls all config objects to a local ./data subfolder').option('--url <url>', 'Kibana server URL', null, null).action(function (command, options) {
                new PullCommand(program, command, options).execute();
            });
        }
    }, {
        key: 'idToFilename',
        value: function idToFilename(id) {
            return id.replace('_', '_').replace('*', '_').replace('(', '_').replace(')', '_');
        }
    }, {
        key: 'mapToLocal',
        value: function mapToLocal(source) {
            var target = JSON.parse((0, _stringify2.default)(source));

            if (target.panelsJSON) {
                target.panelsJSON = JSON.parse(target.panelsJSON);
            }
            if (target.kibanaSavedObjectMeta && target.kibanaSavedObjectMeta.searchSourceJSON) {
                target.kibanaSavedObjectMeta.searchSourceJSON = JSON.parse(target.kibanaSavedObjectMeta.searchSourceJSON);
            }
            return target;
        }
    }]);
    return PullCommand;
}();

exports.default = PullCommand;
module.exports = exports['default'];