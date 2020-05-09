"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Scope = /*#__PURE__*/function () {
  function Scope(parent) {
    _classCallCheck(this, Scope);

    this.table = {};
    this.parent = parent;
  }

  _createClass(Scope, [{
    key: "putSymbol",
    value: function putSymbol(symbol, type) {
      if (this.getSymbol(symbol) !== undefined) throw new Error("Can't redeclare variable " + symbol);
      this.table[symbol] = type;
    }
  }, {
    key: "getSymbol",
    value: function getSymbol(symbol) {
      if (this.table[symbol] === undefined && this.parent) return this.parent.getSymbol(symbol);
      return this.table[symbol];
    }
  }]);

  return Scope;
}();

exports["default"] = Scope;