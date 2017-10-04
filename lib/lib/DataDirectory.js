'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _jsonStableStringify = require('json-stable-stringify');

var _jsonStableStringify2 = _interopRequireDefault(_jsonStableStringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PROPERTY_ORDER = ['id', 'title', 'type'];

var DataDirectory = function () {
    function DataDirectory(config) {
        (0, _classCallCheck3.default)(this, DataDirectory);

        this.datadir = config.datadir;
        this.verbose = config.verbose;
    }

    (0, _createClass3.default)(DataDirectory, [{
        key: 'findAll',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var updatedSearches, updatedVisualizations, updatedDashboards;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.findElementsOfType('search');

                            case 2:
                                updatedSearches = _context.sent;
                                _context.next = 5;
                                return this.findElementsOfType('visualization');

                            case 5:
                                updatedVisualizations = _context.sent;
                                _context.next = 8;
                                return this.findElementsOfType('dashboard');

                            case 8:
                                updatedDashboards = _context.sent;
                                return _context.abrupt('return', [].concat((0, _toConsumableArray3.default)(updatedSearches), (0, _toConsumableArray3.default)(updatedVisualizations), (0, _toConsumableArray3.default)(updatedDashboards)));

                            case 10:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function findAll() {
                return _ref.apply(this, arguments);
            }

            return findAll;
        }()
    }, {
        key: 'store',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(type, id, jsonContent) {
                var _this = this;

                var content, typedir, name, filename;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                content = (0, _jsonStableStringify2.default)(jsonContent, {
                                    cmp: function cmp(a, b) {
                                        return _this.compare(a, b);
                                    },
                                    space: 4
                                });
                                typedir = this.datadir + '/' + type;
                                name = DataDirectory.idToFilename(id);
                                filename = typedir + '/' + name + '.json';


                                if (this.verbose) {
                                    console.log('Updating ' + filename);
                                }

                                this.mkdirIfMissing(this.datadir);
                                this.mkdirIfMissing(typedir);
                                _context2.next = 9;
                                return _fsPromise2.default.writeFile(filename, content, 'utf8');

                            case 9:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function store(_x, _x2, _x3) {
                return _ref2.apply(this, arguments);
            }

            return store;
        }()
    }, {
        key: 'mkdirIfMissing',
        value: function mkdirIfMissing(path) {
            var exists = _fs2.default.existsSync(path);

            if (!exists) {
                _fs2.default.mkdirSync(path);
            }
        }
    }, {
        key: 'findElementsOfType',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(type) {
                var directory, exists, files;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                directory = this.datadir + '/' + type;
                                _context3.next = 3;
                                return _fsPromise2.default.exists(directory);

                            case 3:
                                exists = _context3.sent;

                                if (!exists) {
                                    _context3.next = 12;
                                    break;
                                }

                                _context3.next = 7;
                                return _fsPromise2.default.readdir(directory);

                            case 7:
                                _context3.t0 = function (name) {
                                    return name.endsWith('.json');
                                };

                                files = _context3.sent.filter(_context3.t0);
                                _context3.next = 11;
                                return _promise2.default.all(files.map(this.loadFile.bind(this, type)));

                            case 11:
                                return _context3.abrupt('return', _context3.sent);

                            case 12:
                                return _context3.abrupt('return', []);

                            case 13:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function findElementsOfType(_x4) {
                return _ref3.apply(this, arguments);
            }

            return findElementsOfType;
        }()
    }, {
        key: 'loadFile',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(type, name) {
                var path, text, content, id;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                path = this.datadir + '/' + type + '/' + name;

                                if (this.verbose) {
                                    console.log('Loading ' + path);
                                }

                                _context4.next = 4;
                                return _fsPromise2.default.readFile(path, 'utf8');

                            case 4:
                                text = _context4.sent;
                                content = JSON.parse(text);
                                id = content.id;
                                return _context4.abrupt('return', { id: id, type: type, content: content });

                            case 8:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function loadFile(_x5, _x6) {
                return _ref4.apply(this, arguments);
            }

            return loadFile;
        }()
    }, {
        key: 'clone',
        value: function clone(entry) {
            return (0, _extends3.default)({}, entry, {
                content: JSON.parse((0, _stringify2.default)(entry.content))
            });
        }
    }, {
        key: 'compare',
        value: function compare(a, b) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(PROPERTY_ORDER), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var name = _step.value;

                    if (a.key === name) {
                        return -1;
                    }
                    if (b.key === name) {
                        return 1;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if ((0, _typeof3.default)(a.value) === 'object' && (0, _typeof3.default)(b.value) !== 'object') {
                return 1;
            }
            if ((0, _typeof3.default)(b.value) === 'object' && (0, _typeof3.default)(a.value) !== 'object') {
                return -1;
            }
            return a.key < b.key ? -1 : 1;
        }
    }], [{
        key: 'idToFilename',
        value: function idToFilename(id) {
            return id.replace('_', '_').replace('*', '_').replace('(', '_').replace(')', '_');
        }
    }]);
    return DataDirectory;
}();

exports.default = DataDirectory;
module.exports = exports['default'];