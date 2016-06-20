'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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
    function PullCommand(program) {
        (0, _classCallCheck3.default)(this, PullCommand);

        this.baseUrl = program.url;
        this.query = program.query || '*';
        this.dataDir = program.datadir || './data';
    }

    (0, _createClass3.default)(PullCommand, [{
        key: 'execute',
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
                var url, result, entries;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return this.mkdirIfMissing(this.dataDir);

                            case 3:
                                url = this.baseUrl + '/.kibana/_search?size=1000&q=' + this.query;

                                console.log('Querying via ' + url);

                                _context.next = 7;
                                return _promiseRequest2.default.get(url).set('Accept', 'application/json').promise();

                            case 7:
                                result = _context.sent;
                                entries = result.body.hits.hits;
                                _context.next = 11;
                                return this.createDirectories(entries);

                            case 11:
                                _context.next = 13;
                                return _promise2.default.all(entries.map(this.storeEntry.bind(this)));

                            case 13:
                                process.exit(0);
                                _context.next = 20;
                                break;

                            case 16:
                                _context.prev = 16;
                                _context.t0 = _context['catch'](0);

                                console.error(_context.t0);
                                process.exit(1);

                            case 20:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 16]]);
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
                                filename = this.dataDir + '/' + entry._type + '/' + name + '.json';
                                jsonContent = PullCommand.mapToLocal(entry);
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
                return _this.mkdirIfMissing(_this.dataDir + '/' + type);
            }));
        }
    }, {
        key: 'mkdirIfMissing',
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(typeDir) {
                var exists;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return _fsPromise2.default.exists(typeDir);

                            case 2:
                                exists = _context3.sent;

                                if (exists) {
                                    _context3.next = 6;
                                    break;
                                }

                                _context3.next = 6;
                                return _fsPromise2.default.mkdir(typeDir);

                            case 6:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function mkdirIfMissing(_x2) {
                return ref.apply(this, arguments);
            }

            return mkdirIfMissing;
        }()
    }], [{
        key: 'register',
        value: function register(program) {
            program.command('pull').description('Pulls all config objects to the local <datadir>').action(function (command, options) {
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
        value: function mapToLocal(entry) {
            var source = entry._source;
            var target = (0, _assign2.default)({ id: entry._id }, JSON.parse((0, _stringify2.default)(source)));

            if (target.visState) {
                target.visState = PullCommand.sortByKey(JSON.parse(target.visState));
            }
            PullCommand.replaceJsonWithJs(target);
            if (target.kibanaSavedObjectMeta) {
                PullCommand.replaceJsonWithJs(target.kibanaSavedObjectMeta);
            }
            return target;
        }
    }, {
        key: 'replaceJsonWithJs',
        value: function replaceJsonWithJs(target) {
            (0, _keys2.default)(target).forEach(function (key) {
                if (key.endsWith('JSON')) {
                    target[key] = PullCommand.sortByKey(JSON.parse(target[key])); // eslint-disable-line no-param-reassign
                }
            });
        }
    }, {
        key: 'sortByKey',
        value: function sortByKey(unordered) {
            if (unordered instanceof Array) {
                return unordered.map(function (entry) {
                    return PullCommand.sortByKey(entry);
                });
            } else if ((typeof unordered === 'undefined' ? 'undefined' : (0, _typeof3.default)(unordered)) === 'object') {
                var _ret = function () {
                    var ordered = {};

                    (0, _keys2.default)(unordered).sort().forEach(function (key) {
                        ordered[key] = PullCommand.sortByKey(unordered[key]);
                    });
                    return {
                        v: ordered
                    };
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
            }
            return unordered;
        }
    }]);
    return PullCommand;
}();

exports.default = PullCommand;
module.exports = exports['default'];