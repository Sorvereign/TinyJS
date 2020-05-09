import Parser from "./parser";
import Scope from "./scope";

export default class SymbolTable {
    
    constructor() {
    this.stack = [new Scope()];
    this.scope;
  }
   
  build(nodes) {
    let self = this;
    nodes.forEach((node) => {
      self.analyzeNode(node);
    });
  }

  analyzeNode(node) {
    console.log(this.scopeSymbolTable());
    console.log(this.peek());
    switch (node.nodetype) {
      case Parser.AST_DECL:
        this.putSymbol(node.left.value, node.left.type);
        this.analyzeNode(node.right);
        node.scope = this.peek();
        break;
      case Parser.AST_WHILE:
      case Parser.AST_IF:
      case Parser.AST_ELSE:
        if (node.exp !== undefined) this.analyzeNode(node.exp);
        this.scopeSymbolTable();
        node.scope = this.peek();
        this.build(node.stmts);
        this.pop();
        break;
      case Parser.AST_PRINT:
        this.analyzeNode(node.exp);
        break;
      case Parser.AST_BINOP:
        this.analyzeNode(node.left);
        this.analyzeNode(node.right);
        break;
      case Parser.AST_ASSIGN:
        this.analyzeNode(node.left);
        this.analyzeNode(node.right);
        break;
      case Parser.AST_ID:
        node.scope = this.peek();
        break;
    }
  }

  scopeSymbolTable() {
    this.scope = new Scope(this.peek());
    this.stack.push(this.scope);
  }

  putSymbol(symbol, type) {
    this.peek().putSymbol(symbol, type);
  }

  getSymbol(symbol) {
    return this.peek().getSymbol(symbol);
  }

  peek() {
    return this.stack[this.stack.length - 1];
  }

  pop() {
    return this.stack.pop();
  }
}
