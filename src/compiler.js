import Parser from './parser';
import TypeChecker from './typecheck';
import SymbolTable from './symtab';
import CodeGenerator from './codegen';

import fs from 'fs';

const compile = function (debug) {
    if (process.argv.length <= 2) {
        console.log(`Usage ${__filename} <path to file >`);
        process.exit(-1);
    }

    let path = process.argv[2];

    let program = fs.readFileSync(path).toString();

    let parser = new Parser();
    let typeChecker = new TypeChecker();
    let symtab = new SymbolTable();
    let codeGenerator = new CodeGenerator();
    let ast = parser.parse(program);
    symtab = symtab.build(ast.nodes);
    typeChecker.check(ast.nodes);
    let targetCode = codeGenerator.generate(ast.nodes);

    console.log(parser);
    return new new Function(targetCode);
}

compile()();