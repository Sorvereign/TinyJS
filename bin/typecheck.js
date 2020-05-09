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

var TypeChecker = /*#__PURE__*/function () {
  function TypeChecker() {
    _classCallCheck(this, TypeChecker);

    _defineProperty(this, "parser", new _parser["default"]());
  }

  _createClass(TypeChecker, [{
    key: "check",
    value: function check(nodes) {
      var self = this;
      nodes.forEach(function (node) {
        self.checkNode(node);
      });
    }
  }, {
    key: "checkNode",
    value: function checkNode(node) {
      var lType, rType, type, left, right;

      switch (node.nodetype) {
        case this.parser.AST_DECL:
          this.checkNode(node.right);
          lType = node.left.type;
          rType = node.right.type;
          if (lType !== rType) throw new Error("Can't declare a ".concat(lType, " and assign it a ").concat(rType));
          break;

        case this.parser.AST_ASSIGN:
          lType = node.left.scope.getSymbol(node.left.value);
          if (lType === undefined) throw new Error("Can't use undeclared identifier ".concat(node.left.value));
          this.checkNode(node.right);
          rType = node.right.type;
          if (lType !== rType) throw new Error("Can't assign a ".concat(lType, " to ").concat(rType));
          break;

        case this.parser.BINOP:
          this.checkNode(node.left);
          this.checkNode(node.right);
          lType = node.left.type;
          rType = node.right.type;
          if (lType === "string" || rType === "string") node.type = this.checkStringRules(lType, rType, node.operator);else if (lType === "bool" || rType === "bool") {
            node.type = this.checkBoolRules(rType, lType, node.operator);
          } else if (lType === "int" || rType === "int" || lType === "float" || rType === "float") node.type = this.checkNumRules(rType, lType, node.operator);
          break;

        case this.parser.AST_IF:
        case this.parser.AST_ELSE:
          if (node.exp !== undefined) this.checkNode(node.exp);
          this.check(node.stmts);
          break;

        case this.parser.AST_PRINT:
          this.checkNode(node.exp);
          break;

        case this.parser.AST_FLOAT:
          node.type = "float";
          break;

        case this.parser.AST_INT:
          node.type = "int";
          break;

        case this.parser.AST_BOOL:
          node.type = "bool";
          break;

        case this.parser.AST_STRING:
          node.type = "string";
          break;

        case this.parser.AST_ID:
          console.log("node.scope is ", node.scope);
          type = node.scope.getSymbol(node.value);
          if (type === undefined) throw new Error("Can't use undeclared identifier ".concat(node.value));
          node.type = type;
      }
    }
  }, {
    key: "checkBoolRules",
    value: function checkBoolRules(rType, lType, operator) {
      var boolOps = ['&&', '||', '=='];
      if (rType !== lType) throw new Error("Both side of the expression have to be boolean");else if (boolOps.indexOf(operator) < 0) {
        throw new Error("Undefined operator ".concat(operator, " for bool"));
      }
      return 'bool';
    }
  }, {
    key: "checkNumRules",
    value: function checkNumRules(rType, lType, operator) {
      var initOps = ["*", "/", "+", "%", "<", "-", ">", "!=", "=="];
      var bothInt = lType === "int" && rType === "int";
      if (initOps.indexOf(operator) < 0) throw new Error("Undefined operator ".concat(operator, " for int"));
      if (lType === "float" || rType === "float") return "float";else if ((lType === "string" || rType === "string") && operator === "+") return "string";else if (bothInt && operator === "<") return "bool";else if (bothInt && operator === ">") return "bool";else if (bothInt && operator === "==") return "bool";else if (bothInt && operator === "!=") return "bool";else if (bothInt) return "int";else if (lType === "float" && rType === "float") return "float";
    }
  }, {
    key: "checkStringRules",
    value: function checkStringRules(rType, lType, operator) {
      if (operator != "+") throw new Error("Undefined operator ".concat(operator, " for string"));
      return "string";
    }
  }]);

  return TypeChecker;
}();

exports["default"] = TypeChecker;