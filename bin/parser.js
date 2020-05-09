"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lexer = _interopRequireDefault(require("./lexer"));

var _astNode = _interopRequireDefault(require("./astNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Parser = /*#__PURE__*/function () {
  function Parser() {
    _classCallCheck(this, Parser);

    _defineProperty(this, "lexer", new _lexer["default"]());

    _defineProperty(this, "AST_STMT_LIST", 1);

    _defineProperty(this, "AST_ID", 2);

    _defineProperty(this, "AST_ASSIGN", 3);

    _defineProperty(this, "AST_INT", 4);

    _defineProperty(this, "AST_DECL", 5);

    _defineProperty(this, "AST_BOOL", 6);

    _defineProperty(this, "AST_STRING", 7);

    _defineProperty(this, "AST_FLOAT", 8);

    _defineProperty(this, "AST_BINOP", 9);

    _defineProperty(this, "AST_WHILE", 10);

    _defineProperty(this, "AST_IF", 11);

    _defineProperty(this, "AST_ELSE", 12);

    _defineProperty(this, "AST_PRINT", 13);
  }

  _createClass(Parser, [{
    key: "parse",
    value: function parse(input) {
      this.tokens = this.lexer.lex(input);
      return this.program();
    }
  }, {
    key: "program",
    value: function program() {
      var program = {
        nodetype: this.AST_STMT_LIST,
        nodes: this.stmtList()
      };
      return program;
    }
  }, {
    key: "stmtList",
    value: function stmtList() {
      var stmtToks = [this.lexer.TOK_IF, this.lexer.TOK_WHILE, this.lexer.TOK_VAR, this.lexer.TOK_FOR, this.lexer.TOK_FUNC, this.lexer.TOK_ID, this.lexer.TOK_PRINT];
      var stmts = [];

      while (this.tokens.length) {
        if (stmtToks.indexOf(this.peek()) > -1) {
          stmts.push(this.stmt());
        } else if (this.peek() === this.lexer.TOK_END || this.peek() === this.lexer.TOK_ELSE) break;else throw new Error("Unexpected Token ".concat(this.nextToken().value));
      }

      return stmts;
    }
  }, {
    key: "stmt",
    value: function stmt() {
      var id;
      var left;
      var right;
      var type;
      var exp;
      var stmts;

      if (this.peek() === this.lexer.TOK_ID) {
        id = this.consume(this.lexer.TOK_ID);
        this.consume(this.lexer.TOK_EQ);
        right = this.expr();
        left = new _astNode["default"]({
          nodetype: this.AST_ID,
          value: id.value
        });
        this.consume(this.lexer.TOK_SEMI);
        return new _astNode["default"]({
          nodetype: this.AST_ASSIGN,
          left: left,
          right: right
        });
      } else if (this.peek() === this.lexer.TOK_VAR) {
        this.consume(this.lexer.TOK_VAR);
        id = this.consume(this.lexer.TOK_ID);
        this.consume(this.lexer.TOK_COLON);
        type = this.consume(this.lexer.TOK_TYPE);
        left = new _astNode["default"]({
          nodetype: this.AST_ID,
          type: type.value,
          value: id.value
        });
        this.consume(this.lexer.TOK_EQ);
        right = this.expr();
        this.consume(this.lexer.TOK_SEMI);
        return new _astNode["default"]({
          nodetype: this.AST_DECL,
          left: left,
          right: right
        });
      } else if (this.peek() === this.lexer.TOK_WHILE) {
        this.consume(this.lexer.TOK_WHILE);
        exp = this.expr();
        this.consume(this.lexer.TOK_DO);
        stmts = this.stmtList();
        this.consume(this.lexer.TOK_END);
        return new _astNode["default"]({
          nodetype: this.AST_WHILE,
          exp: exp,
          stmts: stmts
        });
      } else if (this.peek() === this.lexer.TOK_IF) {
        this.consume(this.lexer.TOK_IF);
        exp = this.expr();
        this.consume(this.lexer.TOK_DO);
        stmts = this.stmtList();
        if (this.peek() === this.lexer.TOK_END) this.consume(this.lexer.TOK_END);else {
          this.consume(this.lexer.TOK_ELSE);
          var stmtsElse = this.stmtList();
          this.consume(this.lexer.TOK_END);
          stmts.push(new _astNode["default"]({
            nodetype: this.AST_ELSE,
            stmts: stmtsElse
          }));
        }
        return new _astNode["default"]({
          nodetype: this.AST_IF,
          exp: exp,
          stmts: stmts
        });
      } else if (this.peek() === this.lexer.TOK_PRINT) {
        this.consume(this.lexer.TOK_PRINT);
        exp = this.expr();
        this.consume(this.lexer.TOK_SEMI);
        return new _astNode["default"]({
          nodetype: this.AST_PRINT,
          exp: exp
        });
      }
    }
  }, {
    key: "expr",
    value: function expr() {
      var t = this.term();
      var tRight;
      var nextToken = this.peek();
      var opToks = [this.lexer.TOK_PLUS, this.lexer.TOK_MINUS, this.lexer.TOK_AND, this.lexer.TOK_OR, this.lexer.TOK_EQLS, this.lexer.TOK_NEQLS, this.lexer.TOK_LTHAN, this.lexer.GTHAN];

      while (this.tokens.length && opToks.indexOf(this.peek()) > -1) {
        if (nextToken === this.lexer.TOK_PLUS) {
          this.consume(this.lexer.TOK_PLUS);
          tRight = this.term();
          t = new _astNode["default"]({
            nodetype: this.AST_BINOP,
            operator: "+",
            left: t,
            right: tRight
          });
        } else if (nextToken === this.lexer.TOK_MINUS) {
          this.consume(this.lexer.TOK_MINUS);
          tRight = this.term();
          t = new _astNode["default"]({
            nodetype: this.AST_BINOP,
            operator: "-",
            left: t,
            right: tRight
          });
        } else if (nextToken === this.lexer.TOK_OR) {
          this.consume(this.lexer.TOK_OR);
          tRight = this.term();
          t = new _astNode["default"]({
            nodetype: this.AST_BINOP,
            operator: "||",
            left: t,
            right: tRight
          });
        } else if (nextToken == this.lexer.TOK_AND) {
          this.consume(this.lexer.TOK_AND);
          tRight = this.term();
          t = new _astNode["default"]({
            nodetype: this.AST_BINOP,
            operator: "&&",
            left: t,
            right: tRight
          });
        } else if (nextToken === this.lexer.TOK_EQLS) {
          this.consume(this.lexer.TOK_EQLS);
          tRight = this.term();
          t = new _astNode["default"]({
            nodetype: this.AST_BINOP,
            operator: "==",
            left: t,
            right: tRight
          });
        } else if (nextToken === this.lexer.TOK_NEQLS) {
          this.consume(this.lexer.TOK_NEQLS);
          tRight = this.term();
          t = new _astNode["default"]({
            nodetype: this.AST_BINOP,
            operator: "!=",
            left: t,
            right: tRight
          });
        } else if (nextToken === this.lexer.TOK_LTHAN) {
          this.consume(this.lexer.TOK_LTHAN);
          tRight = this.term();
          t = new _astNode["default"]({
            nodetype: this.AST_BINOP,
            operator: "<",
            left: t,
            right: tRight
          });
        } else if (nextToken === this.lexer.TOK_GTHAN) {
          this.consume(this.lexer.TOK_GTHAN);
          tRight = this.term();
          t = new _astNode["default"]({
            nodetype: this.AST_BINOP,
            operator: ">",
            left: t,
            right: tRight
          });
        }

        nextToken = this.peek();
      }

      return t;
    }
  }, {
    key: "term",
    value: function term() {
      var f = this.factor();
      var fRight;
      var nextToken = this.peek();

      while (this.tokens.length && nextToken === this.lexer.TOK_STAR || nextToken === this.lexer.TOK_SLASH || nextToken === this.lexer.TOK_MOD) {
        if (nextToken === this.lexer.TOK_STAR) {
          this.consume(this.lexer.TOK_STAR);
          fRight = this.factor();
          f = new _astNode["default"]({
            nodetype: this.AST_BINOP,
            operator: "*",
            left: f,
            right: fRight
          });
        } else if (nextToken === this.lexer.TOK_SLASH) {
          this.consume(this.lexer.TOK_SLASH);
          fRight = this.factor();
          f = new _astNode["default"]({
            nodetype: this.AST_BINOP,
            operator: "/",
            left: f,
            right: fRight
          });
        } else if (nextToken === this.lexer.TOK_MOD) {
          this.consume(this.lexer.TOK_MOD);
          fRight = this.factor();
          f = new _astNode["default"]({
            nodetype: this.AST_BINOP,
            operator: "%",
            left: f,
            right: fRight
          });
        }

        nextToken = this.peek();
      }

      return f;
    }
  }, {
    key: "factor",
    value: function factor() {
      var f;

      if (this.peek() === this.lexer.TOK_INT) {
        f = this.consume(this.lexer.TOK_INT);
        return new _astNode["default"]({
          nodetype: this.AST_INT,
          value: f.value
        });
      } else if (this.peek() === this.lexer.TOK_BOOL) {
        f = this.consume(this.lexer.TOK_BOOL);
        return new _astNode["default"]({
          nodetype: this.AST_BOOL,
          value: f.value
        });
      } else if (this.peek() === this.lexer.TOK_STRING) {
        f = this.consume(this.lexer.TOK_STRING);
        return new _astNode["default"]({
          nodetype: this.AST_STRING,
          value: f.value
        });
      } else if (this.peek() === this.lexer.TOK_FLOAT) {
        f = this.consume(this.lexer.TOK_FLOAT);
        return new _astNode["default"]({
          nodetype: this.AST_FLOAT,
          value: f.value
        });
      } else if (this.peek() === this.lexer.TOK_ID) {
        f = this.consume(this.lexer.TOK_ID);
        return new _astNode["default"]({
          nodetype: this.AST_ID,
          value: f.value
        });
      } else if (this.peek() === this.lexer.TOK_LPAREN) {
        this.consume(this.lexer.TOK_LPAREN);
        var e = this.expr();
        this.consume(this.lexer.TOK_RPAREN);
        return e;
      }
    }
  }, {
    key: "nextToken",
    value: function nextToken() {
      return this.tokens.shift();
    }
  }, {
    key: "peek",
    value: function peek() {
      return this.tokens.length ? this.tokens[0].type : null;
    }
  }, {
    key: "consume",
    value: function consume(tokType, value) {
      if (!this.tokens.length) {
        throw new Error("Expecting a token but EOF found");
      }

      if (tokType === this.peek()) {
        return this.nextToken();
      } else {
        throw new Error("Unexpected Token ".concat(this.tokens[0].value));
      }
    }
  }]);

  return Parser;
}();

exports["default"] = Parser;