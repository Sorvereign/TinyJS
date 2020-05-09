"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _parser = _interopRequireDefault(require("./parser"));

var _scope = _interopRequireDefault(require("./scope"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SymbolTable = /*#__PURE__*/function () {
  function SymbolTable() {
    _classCallCheck(this, SymbolTable);

    this.stack = [new _scope["default"]()];
    this.scope;
  }

  _createClass(SymbolTable, [{
    key: "build",
    value: function build(nodes) {
      var self = this;
      nodes.forEach(function (node) {
        self.analyzeNode(node);
      });
    }
  }, {
    key: "analyzeNode",
    value: function analyzeNode(node) {
      console.log(this.scopeSymbolTable());
      console.log(this.peek());

      switch (node.nodetype) {
        case _parser["default"].AST_DECL:
          this.putSymbol(node.left.value, node.left.type);
          this.analyzeNode(node.right);
          node.scope = this.peek();
          break;

        case _parser["default"].AST_WHILE:
        case _parser["default"].AST_IF:
        case _parser["default"].AST_ELSE:
          if (node.exp !== undefined) this.analyzeNode(node.exp);
          this.scopeSymbolTable();
          node.scope = this.peek();
          this.build(node.stmts);
          this.pop();
          break;

        case _parser["default"].AST_PRINT:
          this.analyzeNode(node.exp);
          break;

        case _parser["default"].AST_BINOP:
          this.analyzeNode(node.left);
          this.analyzeNode(node.right);
          break;

        case _parser["default"].AST_ASSIGN:
          this.analyzeNode(node.left);
          this.analyzeNode(node.right);
          break;

        case _parser["default"].AST_ID:
          node.scope = this.peek();
          break;
      }
    }
  }, {
    key: "scopeSymbolTable",
    value: function scopeSymbolTable() {
      this.scope = new _scope["default"](this.peek());
      this.stack.push(this.scope);
    }
  }, {
    key: "putSymbol",
    value: function putSymbol(symbol, type) {
      this.peek().putSymbol(symbol, type);
    }
  }, {
    key: "getSymbol",
    value: function getSymbol(symbol) {
      return this.peek().getSymbol(symbol);
    }
  }, {
    key: "peek",
    value: function peek() {
      return this.stack[this.stack.length - 1];
    }
  }, {
    key: "pop",
    value: function pop() {
      return this.stack.pop();
    }
  }]);

  return SymbolTable;
}();

exports["default"] = SymbolTable;