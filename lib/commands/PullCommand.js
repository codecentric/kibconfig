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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PullCommand = function () {
    function PullCommand(config, client, dataDirectory) {
        (0, _classCallCheck3.default)(this, PullCommand);

        this.config = config;
        this.client = client;
        this.dataDirectory = dataDirectory;
    }

    (0, _createClass3.default)(PullCommand, [{
        key: 'execute',
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
                var entries;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return this.client.findAll();

                            case 3:
                                entries = _context.sent;
                                _context.next = 6;
                                return _promise2.default.all(entries.map(this.storeEntry.bind(this)));

                            case 6:
                                process.exit(0);
                                _context.next = 13;
                                break;

                            case 9:
                                _context.prev = 9;
                                _context.t0 = _context['catch'](0);

                                console.error(_context.t0);
                                process.exit(1);

                            case 13:
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
        key: 'storeEntry',
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(entry) {
                var jsonContent;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!entry._type) {
                                    _context2.next = 4;
                                    break;
                                }

                                jsonContent = _Mapper2.default.mapToLocal(entry);
                                _context2.next = 4;
                                return this.dataDirectory.store(entry._type, entry._id, jsonContent);

                            case 4:
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
    }]);
    return PullCommand;
}();

exports.default = PullCommand;
module.exports = exports['default'];