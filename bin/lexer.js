"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Lexer = /*#__PURE__*/function () {
  function Lexer() {
    _classCallCheck(this, Lexer);

    _defineProperty(this, "TOK_ID", 1);

    _defineProperty(this, "TOK_VAR", 2);

    _defineProperty(this, "TOK_INT", 3);

    _defineProperty(this, "TOK_FLOAT", 4);

    _defineProperty(this, "TOK_TYPE", 5);

    _defineProperty(this, "TOK_EQ", 6);

    _defineProperty(this, "TOK_PLUS", 7);

    _defineProperty(this, "TOK_MINUS", 8);

    _defineProperty(this, "TOK_STAR", 9);

    _defineProperty(this, "TOK_SLASH", 10);

    _defineProperty(this, "TOK_LPAREN", 11);

    _defineProperty(this, "TOK_RPAREN", 12);

    _defineProperty(this, "TOK_COLON", 13);

    _defineProperty(this, "TOK_WHILE", 14);

    _defineProperty(this, "TOK_DO", 15);

    _defineProperty(this, "TOK_DONE", 16);

    _defineProperty(this, "TOK_SEMI", 17);

    _defineProperty(this, "TOK_FALSE", 19);

    _defineProperty(this, "TOK_TRUE", 20);

    _defineProperty(this, "TOK_EQLS", 21);

    _defineProperty(this, "TOK_FOR", 22);

    _defineProperty(this, "TOK_IF", 23);

    _defineProperty(this, "TOK_ELSE", 24);

    _defineProperty(this, "TOK_COMMA", 25);

    _defineProperty(this, "TOK_STRING", 26);

    _defineProperty(this, "TOK_GTHAN", 27);

    _defineProperty(this, "TOK_LTHAN", 28);

    _defineProperty(this, "TOK_LTHANEQ", 29);

    _defineProperty(this, "TOK_GTHANEQ", 30);

    _defineProperty(this, "TOK_COMMA", 31);

    _defineProperty(this, "TOK_RBRACKET", 32);

    _defineProperty(this, "TOK_LBRACKET", 33);

    _defineProperty(this, "TOK_FUNC", 34);

    _defineProperty(this, "TOK_OR", 35);

    _defineProperty(this, "TOK_AND", 36);

    _defineProperty(this, "TOK_BITWISE_OR", 37);

    _defineProperty(this, "TOK_BITWISE_AND", 38);

    _defineProperty(this, "TOK_MOD", 39);

    _defineProperty(this, "TOK_NEQLS", 40);

    _defineProperty(this, "TOK_NEGATE", 41);

    _defineProperty(this, "TOK_PRINT", 42);

    _defineProperty(this, "KEYWORDS", {
      'while': {
        type: this.TOK_WHILE,
        value: "while"
      },
      'for': {
        type: this.TOK_FOR,
        value: "for"
      },
      'end': {
        type: this.TOK_END,
        value: "end"
      },
      'do': {
        type: this.TOK_DO,
        value: "do"
      },
      'int': {
        type: this.TOK_TYPE,
        value: "int"
      },
      'float': {
        type: this.TOK_TYPE,
        value: "float"
      },
      'string': {
        type: this.TOK_TYPE,
        value: "string"
      },
      'bool': {
        type: this.TOK_TYPE,
        value: "bool"
      },
      'if': {
        type: this.TOK_IF,
        value: "if"
      },
      'else': {
        type: this.TOK_ELSE,
        value: "else"
      },
      'true': {
        type: this.TOK_BOOL,
        value: "true"
      },
      'false': {
        type: this.TOK_BOOL,
        value: "false"
      },
      'var': {
        type: this.TOK_VAR,
        value: "var"
      },
      'func': {
        type: this.TOK_FUNC,
        value: "func"
      },
      'print': {
        type: this.TOK_PRINT,
        value: "print"
      }
    });
  }

  _createClass(Lexer, [{
    key: "lex",
    value: function lex(input) {
      var tokens = [];
      var id;
      var has = Object.prototype.hasOwnProperty;
      this.index = 0;

      while (this.index < input.length) {
        var ch = input.charAt(this.index);

        if (/\s/.test(ch)) {} else if (ch === "(") tokens.push({
          type: this.TOK_LPAREN,
          value: "("
        });else if (ch === ")") tokens.push({
          type: this.TOK_RPAREN,
          value: ")"
        });else if (ch === "+") tokens.push({
          type: this.TOK_PLUS,
          value: "+"
        });else if (ch === "-") tokens.push({
          type: this.TOK_MINUS,
          value: "-"
        });else if (ch === "*") tokens.push({
          type: this.TOK_STAR,
          value: "*"
        });else if (ch === "/") tokens.push({
          type: this.TOK_SLASH,
          value: "/"
        });else if (ch === "%") tokens.push({
          type: this.TOK_MOD,
          value: "%"
        });else if (ch === ":") tokens.push({
          type: this.TOK_COLON,
          value: ":"
        });else if (ch === ";") tokens.push({
          type: this.TOK_SEMI,
          value: ";"
        });else if (ch === "]") tokens.push({
          type: this.TOK_RBRACKET,
          value: "]"
        });else if (ch === "[") tokens.push({
          type: this.TOK_LBRACKET,
          value: "["
        });else if (ch === ",") tokens.push({
          type: this.TOK_COMMA,
          value: ","
        });else if (ch === "=") {
          if (this.peek(input) === "=") {
            this.index++;
            tokens.push({
              type: this.TOK_EQLS,
              value: "=="
            });
          } else tokens.push({
            type: this.TOK_EQ,
            value: "="
          });
        } else if (ch === ">") {
          if (this.peek(input) === "=") {
            this.index++;
            tokens.push({
              type: this.TOK_GTHANEQ,
              value: ">="
            });
          } else tokens.push({
            type: this.TOK_GTHAN,
            value: ">"
          });
        } else if (ch === "<") {
          if (this.peek(input) === "=") {
            this.index++;
            tokens.push({
              type: this.TOK_LTHANEQ,
              value: "<="
            });
          } else tokens.push({
            type: this.TOK_LTHAN,
            value: "<"
          });
        } else if (ch === "|") {
          if (this.peek(input) === "|") {
            this.index++;
            tokens.push({
              type: this.TOK_OR,
              value: "||"
            });
          } else tokens.push({
            type: this.TOK_BITWISE_OR,
            value: "|"
          });
        } else if (ch === "&") {
          if (this.peek(input) === "&") {
            this.index++;
            tokens.push({
              type: this.TOK_AND,
              value: "&&"
            });
          } else tokens.push({
            type: this.TOK_BITWISE_AND,
            value: "&"
          });
        } else if (ch === "!") {
          if (this.peek(input) === "=") {
            this.index++;
            tokens.push({
              type: this.TOK_NEQLS,
              value: "!="
            });
          } else tokens.push({
            type: this.TOK_NEGATE,
            value: "!"
          });
        } else if (this.isNumber(ch)) {
          var num = this.readNumber(input);

          if (input[this.index] === ".") {
            num += ".";
            this.index++;
            num += this.readNumber(input);
            tokens.push({
              type: this.TOK_FLOAT,
              value: num
            });
          } else tokens.push({
            type: this.TOK_INT,
            value: num
          });

          this.index--;
        } else if (this.isIdent(ch)) {
          id = this.readIdent(input);
          if (has.call(this.KEYWORDS, id)) tokens.push({
            type: this.KEYWORDS[id].type,
            value: this.KEYWORDS[id].value
          });else tokens.push({
            type: this.TOK_ID,
            value: id
          });
          this.index--;
        } else if (ch === '"') {
          this.index++;
          id = this.readString(input, '"');
          if (input.charAt(this.index) === '"') tokens.push({
            type: this.TOK_STRING,
            value: "'".concat(id, "'")
          });else throw new Error("Unmatched quote");
        } else {
          throw new Error("Unexpected Character ".concat(ch));
        }

        this.index++;
      }

      return tokens;
    }
  }, {
    key: "isNumber",
    value: function isNumber(n) {
      return !isNaN(parseFloat(n) && isFinite(n));
    }
  }, {
    key: "isIdent",
    value: function isIdent(ch) {
      return /[a-z0-9_]/i.test(ch);
    }
  }, {
    key: "readNumber",
    value: function readNumber(input) {
      var num = "";

      while (this.isNumber(input.charAt(this.index))) {
        num += input.charAt(this.index);
        this.index++;
      }

      return num;
    }
  }, {
    key: "readIdent",
    value: function readIdent(input) {
      var id = "";

      while (this.isNumber(input.charAt(this.index)) || this.isIdent(input.charAt(this.index))) {
        id += input.charAt(this.index);
        this.index++;
      }

      return id;
    }
  }, {
    key: "readString",
    value: function readString(input, quote) {
      var string = "";

      while (input.charAt(this.index) !== quote && this.index < input.length) {
        string += input.charAt(this.index);
        this.index++;
      }

      return string;
    }
  }, {
    key: "peek",
    value: function peek(input) {
      return input.charAt(this.index + 1);
    }
  }]);

  return Lexer;
}();

exports["default"] = Lexer;