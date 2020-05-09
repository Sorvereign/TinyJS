"use strict";

var _parser = _interopRequireDefault(require("./parser"));

var _typecheck = _interopRequireDefault(require("./typecheck"));

var _symtab = _interopRequireDefault(require("./symtab"));

var _codegen = _interopRequireDefault(require("./codegen"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var compile = function compile(debug) {
  if (process.argv.length <= 2) {
    console.log("Usage ".concat(__filename, " <path to file >"));
    process.exit(-1);
  }

  var path = process.argv[2];

  var program = _fs["default"].readFileSync(path).toString();

  var parser = new _parser["default"]();
  var typeChecker = new _typecheck["default"]();
  var symtab = new _symtab["default"]();
  var codeGenerator = new _codegen["default"]();
  var ast = parser.parse(program);
  symtab = symtab.build(ast.nodes);
  typeChecker.check(ast.nodes);
  var targetCode = codeGenerator.generate(ast.nodes);
  console.log(parser);
  return new new Function(targetCode)();
};

compile()();