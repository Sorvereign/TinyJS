export default class ASTNode {
  constructor(args) {
    this.nodetype = args.nodetype;
    this.value = args.value;
    this.left = args.left;
    this.right = args.right;
    this.type = args.type;
    this.operator = args.operator;
    this.exp = args.exp;
    this.stmts = args.stmts;
  }
}