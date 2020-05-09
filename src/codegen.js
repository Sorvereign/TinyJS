import Parser from "./parser";

export default class CodeGenerator {
  parser  = new Parser();
  generate(nodes) {
    let program = "";
    let self = this;
    nodes.forEach((node) => {
      program += self.generateNode(node);
    });
    return program;
  }

  generateNode(node) {
    let result = "";
    switch (node.nodetype) {
      case this.parser.AST_DECL:
        result += `var ${node.left.value} = ${this.generateNode(
          node.right
        )} \n`;
        break;
      case this.parser.AST_BINOP:
        result += `( ${this.generateNode(node.left)} ${
          node.operator
        } ${this.generateNode(node.right)} )`;
        break;
      case this.parser.AST_ASSIGN:
        result += `${node.left.value} = ${this.generateNode(node.right)} \n`;
        break;
      case this.parser.AST_WHILE:
        result += `while ${this.generateNode(node.exp)} {\n ${this.generate(
          node.stmts
        )} } \n`;
        break;
      case this.parser.AST_IF:
        let hasElse = !!(
          node.stmts[node.stmts.length - 1].nodetype === this.parser.AST_ELSE
        );
        if (hasElse) {
          let elseNode = node.stmts.pop();
          result += `if ${this.generateNode(
            node.exp
          )} {\n this.generate(node.stmts)} \n}`;
        } else
          result += `${this.generateNode(node.exp)} {\n ${this.generate(
            node.stmts
          )} }\n`;
        break;
      case this.parser.AST_PRINT:
        result += `if ${this.generateNode(node.exp)} {\n ${this.generate(
          node.stmts
        )}\n }`;
        break;
      case this.parser.AST_PRINT:
        result += `console.log(${this.generateNode(node.exp)} ); \n`;
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
}
