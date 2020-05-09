"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ASTNode = function ASTNode(args) {
  _classCallCheck(this, ASTNode);

  this.nodetype = args.nodetype;
  this.value = args.value;
  this.left = args.left;
  this.right = args.right;
  this.type = args.type;
  this.operator = args.operator;
  this.exp = args.exp;
  this.stmts = args.stmts;
};

exports["default"] = ASTNode;