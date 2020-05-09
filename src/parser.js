import Lexer from "./lexer";
import ASTNode from "./astNode";

export default class Parser{

  lexer = new Lexer();

  AST_STMT_LIST = 1;
  AST_ID = 2;
  AST_ASSIGN = 3;
  AST_INT = 4;
  AST_DECL = 5;
  AST_BOOL = 6;
  AST_STRING = 7;
  AST_FLOAT = 8;
  AST_BINOP = 9;
  AST_WHILE = 10;
  AST_IF = 11;
  AST_ELSE = 12;
  AST_PRINT = 13;

  parse(input) {
    this.tokens = this.lexer.lex(input);
    return this.program();
  }
  program() {
   let program = {
      nodetype: this.AST_STMT_LIST,
      nodes: this.stmtList(),
    };
    return program;
  }

  stmtList() {
    const stmtToks = [
      this.lexer.TOK_IF,
      this.lexer.TOK_WHILE,
      this.lexer.TOK_VAR,
      this.lexer.TOK_FOR,
      this.lexer.TOK_FUNC,
      this.lexer.TOK_ID,
      this.lexer.TOK_PRINT,
    ];
    let stmts = [];
    while (this.tokens.length) {
      if (stmtToks.indexOf(this.peek()) > -1) {stmts.push(this.stmt());} 
           else if (this.peek() === this.lexer.TOK_END || this.peek() === this.lexer.TOK_ELSE)
        break;
      else 
        throw new Error(`Unexpected Token ${this.nextToken().value}`);
    }
    return stmts;
  }

  stmt() {
    let id;
    let left;
    let right;
    let type;
    let exp;
    let stmts;
    if (this.peek() === this.lexer.TOK_ID) {
      id = this.consume(this.lexer.TOK_ID);
      this.consume(this.lexer.TOK_EQ);
      right = this.expr();
      left = new ASTNode({ nodetype: this.AST_ID, value: id.value });
      this.consume(this.lexer.TOK_SEMI);
      return new ASTNode({
        nodetype: this.AST_ASSIGN,
        left: left,
        right: right,
      });
    } else if (this.peek() === this.lexer.TOK_VAR) {
      this.consume(this.lexer.TOK_VAR);
      id = this.consume(this.lexer.TOK_ID);
      this.consume(this.lexer.TOK_COLON);
      type = this.consume(this.lexer.TOK_TYPE);
      left = new ASTNode({
        nodetype: this.AST_ID,
        type: type.value,
        value: id.value,
      });
      this.consume(this.lexer.TOK_EQ);
      right = this.expr();
      this.consume(this.lexer.TOK_SEMI);
      return new ASTNode({
        nodetype: this.AST_DECL,
        left: left,
        right: right,
      });
    } else if (this.peek() === this.lexer.TOK_WHILE) {
      this.consume(this.lexer.TOK_WHILE);
      exp = this.expr();
      this.consume(this.lexer.TOK_DO);
      stmts = this.stmtList();
      this.consume(this.lexer.TOK_END);
      return new ASTNode({
        nodetype: this.AST_WHILE,
        exp: exp,
        stmts: stmts,
      });
    } else if (this.peek() === this.lexer.TOK_IF) {
      this.consume(this.lexer.TOK_IF);
      exp = this.expr();
      this.consume(this.lexer.TOK_DO);
      stmts = this.stmtList();
      if (this.peek() === this.lexer.TOK_END) this.consume(this.lexer.TOK_END);
      else {
        this.consume(this.lexer.TOK_ELSE);
        let stmtsElse = this.stmtList();
        this.consume(this.lexer.TOK_END);
        stmts.push(
          new ASTNode({ nodetype: this.AST_ELSE, stmts: stmtsElse })
        );
      }
      return new ASTNode({ nodetype: this.AST_IF, exp: exp, stmts: stmts });
    } else if (this.peek() === this.lexer.TOK_PRINT) {
      this.consume(this.lexer.TOK_PRINT);
      exp = this.expr();
      this.consume(this.lexer.TOK_SEMI);
      return new ASTNode({ nodetype: this.AST_PRINT, exp: exp });
    }
  }
  expr() {
    let t = this.term();
    let tRight;
    let nextToken = this.peek();
    let opToks = [
      this.lexer.TOK_PLUS,
      this.lexer.TOK_MINUS,
      this.lexer.TOK_AND,
      this.lexer.TOK_OR,
      this.lexer.TOK_EQLS,
      this.lexer.TOK_NEQLS,
      this.lexer.TOK_LTHAN,
      this.lexer.GTHAN,
    ];
    while (this.tokens.length && opToks.indexOf(this.peek()) > -1) {
      if (nextToken === this.lexer.TOK_PLUS) {
        this.consume(this.lexer.TOK_PLUS);
        tRight = this.term();
        t = new ASTNode({
          nodetype: this.AST_BINOP,
          operator: "+",
          left: t,
          right: tRight,
        });
      } else if (nextToken === this.lexer.TOK_MINUS) {
        this.consume(this.lexer.TOK_MINUS);
        tRight = this.term();
        t = new ASTNode({
          nodetype: this.AST_BINOP,
          operator: "-",
          left: t,
          right: tRight,
        });
      } else if (nextToken === this.lexer.TOK_OR) {
        this.consume(this.lexer.TOK_OR);
        tRight = this.term();
        t = new ASTNode({
          nodetype: this.AST_BINOP,
          operator: "||",
          left: t,
          right: tRight,
        });
      } else if (nextToken == this.lexer.TOK_AND) {
        this.consume(this.lexer.TOK_AND);
        tRight = this.term();
        t = new ASTNode({
          nodetype: this.AST_BINOP,
          operator: "&&",
          left: t,
          right: tRight,
        });
      } else if (nextToken === this.lexer.TOK_EQLS) {
        this.consume(this.lexer.TOK_EQLS);
        tRight = this.term();
        t = new ASTNode({
          nodetype: this.AST_BINOP,
          operator: "==",
          left: t,
          right: tRight,
        });
      } else if (nextToken === this.lexer.TOK_NEQLS) {
        this.consume(this.lexer.TOK_NEQLS);
        tRight = this.term();
        t = new ASTNode({
          nodetype: this.AST_BINOP,
          operator: "!=",
          left: t,
          right: tRight,
        });
      } else if (nextToken === this.lexer.TOK_LTHAN) {
        this.consume(this.lexer.TOK_LTHAN);
        tRight = this.term();
        t = new ASTNode({
          nodetype: this.AST_BINOP,
          operator: "<",
          left: t,
          right: tRight,
        });
      } else if (nextToken === this.lexer.TOK_GTHAN) {
        this.consume(this.lexer.TOK_GTHAN);
        tRight = this.term();
        t = new ASTNode({
          nodetype: this.AST_BINOP,
          operator: ">",
          left: t,
          right: tRight,
        });
      }
      nextToken = this.peek();
    }
    return t;
  }

  term() {
    let f = this.factor();
    let fRight;
    let nextToken = this.peek();
    while (
      (this.tokens.length && nextToken === this.lexer.TOK_STAR) ||
      nextToken === this.lexer.TOK_SLASH ||
      nextToken === this.lexer.TOK_MOD
    ) {
      if (nextToken === this.lexer.TOK_STAR) {
        this.consume(this.lexer.TOK_STAR);
        fRight = this.factor();
        f = new ASTNode({
          nodetype: this.AST_BINOP,
          operator: "*",
          left: f,
          right: fRight,
        });
      } else if (nextToken === this.lexer.TOK_SLASH) {
        this.consume(this.lexer.TOK_SLASH);
        fRight = this.factor();
        f = new ASTNode({
          nodetype: this.AST_BINOP,
          operator: "/",
          left: f,
          right: fRight,
        });
      } else if (nextToken === this.lexer.TOK_MOD) {
        this.consume(this.lexer.TOK_MOD);
        fRight = this.factor();
        f = new ASTNode({
          nodetype: this.AST_BINOP,
          operator: "%",
          left: f,
          right: fRight,
        });
      }
      nextToken = this.peek();
    }
    return f;
  }

  factor() {
    let f;
    if (this.peek() === this.lexer.TOK_INT) {
      f = this.consume(this.lexer.TOK_INT);
      return new ASTNode({ nodetype: this.AST_INT, value: f.value });
    } else if (this.peek() === this.lexer.TOK_BOOL) {
      f = this.consume(this.lexer.TOK_BOOL);
      return new ASTNode({ nodetype: this.AST_BOOL, value: f.value });
    } else if (this.peek() === this.lexer.TOK_STRING) {
      f = this.consume(this.lexer.TOK_STRING);
      return new ASTNode({ nodetype: this.AST_STRING, value: f.value });
    } else if (this.peek() === this.lexer.TOK_FLOAT) {
      f = this.consume(this.lexer.TOK_FLOAT);
      return new ASTNode({ nodetype: this.AST_FLOAT, value: f.value });
    } else if (this.peek() === this.lexer.TOK_ID) {
      f = this.consume(this.lexer.TOK_ID);
      return new ASTNode({ nodetype: this.AST_ID, value: f.value });
    } else if (this.peek() === this.lexer.TOK_LPAREN) {
      this.consume(this.lexer.TOK_LPAREN);
      let e = this.expr();
      this.consume(this.lexer.TOK_RPAREN);
      return e;
    }
  }

  nextToken() {
    return this.tokens.shift();
  }

  peek() {
    return this.tokens.length ? this.tokens[0].type : null;
  }

  consume(tokType, value) {
    if (!this.tokens.length) {
      throw new Error("Expecting a token but EOF found");
    }
    if (tokType === this.peek()) {
      return this.nextToken();
    } else {
      throw new Error(`Unexpected Token ${this.tokens[0].value}`);
    }
  }
}
