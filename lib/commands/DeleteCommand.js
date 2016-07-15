"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DeleteCommand = function () {
    function DeleteCommand(config, client) {
        (0, _classCallCheck3.default)(this, DeleteCommand);

        this.config = config;
        this.client = client;
    }

    (0, _createClass3.default)(DeleteCommand, [{
        key: "execute",
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
                var entries;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.client.findAll();

                            case 2:
                                entries = _context.sent;
                                _context.next = 5;
                                return _promise2.default.all(entries.map(this.deleteEntry.bind(this)));

                            case 5:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function execute() {
                return ref.apply(this, arguments);
            }

            return execute;
        }()
    }, {
        key: "deleteEntry",
        value: function () {
            var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(entry) {
                var type, id;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                type = entry._type;
                                id = entry._id;

                                if (!(type && id)) {
                                    _context2.next = 5;
                                    break;
                                }

                                _context2.next = 5;
                                return this.client.delete(type, id);

                            case 5:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function deleteEntry(_x) {
                return ref.apply(this, arguments);
            }

            return deleteEntry;
        }()
    }]);
    return DeleteCommand;
}();

exports.default = DeleteCommand;
module.exports = exports["default"];