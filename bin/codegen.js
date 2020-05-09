"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _parser = _interopRequireDefault(require("./parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CodeGenerator = /*#__PURE__*/function () {
  function CodeGenerator() {
    _classCallCheck(this, CodeGenerator);

    _defineProperty(this, "parser", new _parser["default"]());
  }

  _createClass(CodeGenerator, [{
    key: "generate",
    value: function generate(nodes) {
      var program = "";
      var self = this;
      nodes.forEach(function (node) {
        program += self.generateNode(node);
      });
      return program;
    }
  }, {
    key: "generateNode",
    value: function generateNode(node) {
      var result = "";

      switch (node.nodetype) {
        case this.parser.AST_DECL:
          result += "var ".concat(node.left.value, " = ").concat(this.generateNode(node.right), " \n");
          break;

        case this.parser.AST_BINOP:
          result += "( ".concat(this.generateNode(node.left), " ").concat(node.operator, " ").concat(this.generateNode(node.right), " )");
          break;

        case this.parser.AST_ASSIGN:
          result += "".concat(node.left.value, " = ").concat(this.generateNode(node.right), " \n");
          break;

        case this.parser.AST_WHILE:
          result += "while ".concat(this.generateNode(node.exp), " {\n ").concat(this.generate(node.stmts), " } \n");
          break;

        case this.parser.AST_IF:
          var hasElse = !!(node.stmts[node.stmts.length - 1].nodetype === this.parser.AST_ELSE);

          if (hasElse) {
            var elseNode = node.stmts.pop();
            result += "if ".concat(this.generateNode(node.exp), " {\n this.generate(node.stmts)} \n}");
          } else result += "".concat(this.generateNode(node.exp), " {\n ").concat(this.generate(node.stmts), " }\n");

          break;

        case this.parser.AST_PRINT:
          result += "if ".concat(this.generateNode(node.exp), " {\n ").concat(this.generate(node.stmts), "\n }");
          break;

        case this.parser.AST_PRINT:
          result += "console.log(".concat(this.generateNode(node.exp), " ); \n");
          break;

        case this.parser.AST_ID:
        case this.parser.AST_INT:
        case this.parser.AST_FLOAT:
        case this.parser.AST_BOOL:
        case this.parser.AST_STRING:
          result += node.value;
          break;
      }

      return result;
    }
  }]);

  return CodeGenerator;
}();

exports["default"] = CodeGenerator;