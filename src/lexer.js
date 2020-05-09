export default class Lexer {
  // CONSTANTS:
  TOK_ID = 1;
  TOK_VAR = 2;
  TOK_INT = 3;
  TOK_FLOAT = 4;
  TOK_TYPE = 5;
  TOK_EQ = 6;
  TOK_PLUS = 7;
  TOK_MINUS = 8;
  TOK_STAR = 9;
  TOK_SLASH = 10;
  TOK_LPAREN = 11;
  TOK_RPAREN = 12;
  TOK_COLON = 13;
  TOK_WHILE = 14;
  TOK_DO = 15;
  TOK_DONE = 16;
  TOK_SEMI = 17;
  TOK_FALSE = 19;
  TOK_TRUE = 20;
  TOK_EQLS = 21;
  TOK_FOR = 22;
  TOK_IF = 23;
  TOK_ELSE = 24;
  TOK_COMMA = 25;
  TOK_STRING = 26;
  TOK_GTHAN = 27;
  TOK_LTHAN = 28;
  TOK_LTHANEQ = 29;
  TOK_GTHANEQ = 30;
  TOK_COMMA = 31;
  TOK_RBRACKET = 32;
  TOK_LBRACKET = 33;
  TOK_FUNC = 34;
  TOK_OR = 35;
  TOK_AND = 36;
  TOK_BITWISE_OR = 37;
  TOK_BITWISE_AND = 38;
  TOK_MOD = 39;
  TOK_NEQLS = 40;
  TOK_NEGATE = 41;
  TOK_PRINT = 42;

  KEYWORDS = {
    'while': { type: this.TOK_WHILE, value: "while" },
    'for': { type: this.TOK_FOR, value: "for" },
    'end': { type: this.TOK_END, value: "end" },
    'do': { type: this.TOK_DO, value: "do" },
    'int': { type: this.TOK_TYPE, value: "int" },
    'float': { type: this.TOK_TYPE, value: "float" },
    'string': { type: this.TOK_TYPE, value: "string" },
    'bool': { type: this.TOK_TYPE, value: "bool" },
    'if': { type: this.TOK_IF, value: "if" },
    'else': { type: this.TOK_ELSE, value: "else" },
    'true': { type: this.TOK_BOOL, value: "true" },
    'false': { type: this.TOK_BOOL, value: "false" },
    'var': { type: this.TOK_VAR, value: "var" },
    'func': { type: this.TOK_FUNC, value: "func" },
    'print': { type: this.TOK_PRINT, value: "print" },
  };

  lex(input) {
    let tokens = [];
    let id;
    let has = Object.prototype.hasOwnProperty;
    this.index = 0;
    while (this.index < input.length) {
      let ch = input.charAt(this.index);
      if (/\s/.test(ch)) {
      } else if (ch === "(") tokens.push({ type: this.TOK_LPAREN, value: "(" });
      else if (ch === ")") tokens.push({ type: this.TOK_RPAREN, value: ")" });
      else if (ch === "+") tokens.push({ type: this.TOK_PLUS, value: "+" });
      else if (ch === "-") tokens.push({ type: this.TOK_MINUS, value: "-" });
      else if (ch === "*") tokens.push({ type: this.TOK_STAR, value: "*" });
      else if (ch === "/") tokens.push({ type: this.TOK_SLASH, value: "/" });
      else if (ch === "%") tokens.push({ type: this.TOK_MOD, value: "%" });
      else if (ch === ":") tokens.push({ type: this.TOK_COLON, value: ":" });
      else if (ch === ";") tokens.push({ type: this.TOK_SEMI, value: ";" });
      else if (ch === "]") tokens.push({ type: this.TOK_RBRACKET, value: "]" });
      else if (ch === "[") tokens.push({ type: this.TOK_LBRACKET, value: "[" });
      else if (ch === ",") tokens.push({ type: this.TOK_COMMA, value: "," });
      else if (ch === "=") {
        if (this.peek(input) === "=") {
          this.index++;
          tokens.push({ type: this.TOK_EQLS, value: "==" });
        } else tokens.push({ type: this.TOK_EQ, value: "=" });
      } else if (ch === ">") {
        if (this.peek(input) === "=") {
          this.index++;
          tokens.push({ type: this.TOK_GTHANEQ, value: ">=" });
        } else tokens.push({ type: this.TOK_GTHAN, value: ">" });
      } else if (ch === "<") {
        if (this.peek(input) === "=") {
          this.index++;
          tokens.push({ type: this.TOK_LTHANEQ, value: "<=" });
        } else tokens.push({ type: this.TOK_LTHAN, value: "<" });
      } else if (ch === "|") {
        if (this.peek(input) === "|") {
          this.index++;
          tokens.push({ type: this.TOK_OR, value: "||" });
        } else tokens.push({ type: this.TOK_BITWISE_OR, value: "|" });
      } else if (ch === "&") {
        if (this.peek(input) === "&") {
          this.index++;
          tokens.push({ type: this.TOK_AND, value: "&&" });
        } else tokens.push({ type: this.TOK_BITWISE_AND, value: "&" });
      } else if (ch === "!") {
        if (this.peek(input) === "=") {
          this.index++;
          tokens.push({ type: this.TOK_NEQLS, value: "!=" });
        } else tokens.push({ type: this.TOK_NEGATE, value: "!" });
      } else if (this.isNumber(ch)) {
        let num = this.readNumber(input);
        if (input[this.index] === ".") {
          num += ".";
          this.index++;
          num += this.readNumber(input);
          tokens.push({ type: this.TOK_FLOAT, value: num });
        } else tokens.push({ type: this.TOK_INT, value: num });
        this.index--;
      } else if (this.isIdent(ch)) {
        id = this.readIdent(input);
        if (has.call(this.KEYWORDS, id))
          tokens.push({ type: this.KEYWORDS[id].type, value: this.KEYWORDS[id].value });
        else tokens.push({ type: this.TOK_ID, value: id });
        this.index--;
      } else if (ch === '"') {
        this.index++;
        id = this.readString(input, '"');
        if (input.charAt(this.index) === '"')
          tokens.push({ type: this.TOK_STRING, value: `'${id}'` });
        else throw new Error("Unmatched quote");
      } else {
        throw new Error(`Unexpected Character ${ch}`);
      }
      this.index++;
    }
    return tokens;
  }
  isNumber(n) {
    return !isNaN(parseFloat(n) && isFinite(n));
  }

  isIdent(ch) {
    return /[a-z0-9_]/i.test(ch);
  }

  readNumber(input) {
    let num = "";
    while (this.isNumber(input.charAt(this.index))) {
      num += input.charAt(this.index);
      this.index++;
    }
    return num;
  }

  readIdent(input) {
    let id = "";
    while (
      this.isNumber(input.charAt(this.index)) ||
      this.isIdent(input.charAt(this.index))
    ) {
      id += input.charAt(this.index);
      this.index++;
    }
    return id;
  }

  readString(input, quote) {
    let string = "";
    while (input.charAt(this.index) !== quote && this.index < input.length) {
      string += input.charAt(this.index);
      this.index++;
    }

    return string;
  }

  peek(input) {
    return input.charAt(this.index + 1);
  }
}
