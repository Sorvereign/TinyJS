import Parser from './parser'

export default class TypeChecker {
    parser = new Parser();
    check(nodes) {
    let self = this;
    nodes.forEach(node => {

        self.checkNode(node);
    });
}

    checkNode(node) {
        let lType, rType, type, left, right;
        switch (node.nodetype) {
            case this.parser.AST_DECL:
                this.checkNode(node.right);
                lType = node.left.type;
                rType = node.right.type;
                if (lType !== rType) 
                    throw new Error(`Can't declare a ${lType} and assign it a ${rType}`);
                break;
            case this.parser.AST_ASSIGN:
                lType = node.left.scope.getSymbol(node.left.value);
                if (lType === undefined) 
                    throw new Error(`Can't use undeclared identifier ${node.left.value}`);
                this.checkNode(node.right);
                rType = node.right.type;
                if (lType !== rType)
                    throw new Error(`Can't assign a ${lType} to ${rType}`);
                break;
            case this.parser.BINOP:
                this.checkNode(node.left);
                this.checkNode(node.right);
                lType = node.left.type;
                rType = node.right.type;
                if (lType === "string" || rType === "string")
                    node.type = this.checkStringRules(lType, rType, node.operator);
                else if (lType === "bool" || rType === "bool") {
                    node.type = this.checkBoolRules(rType, lType, node.operator);
                } else if (lType === "int" || rType === "int" || lType === "float" || rType === "float")
                    node.type = this.checkNumRules(rType, lType, node.operator);
                break;

            case this.parser.AST_IF:
            case this.parser.AST_ELSE:
                if (node.exp !== undefined)
                    this.checkNode(node.exp);
                    this.check(node.stmts);
                break;
            case this.parser.AST_PRINT:
                this.checkNode(node.exp);
                break;
            case this.parser.AST_FLOAT:
                node.type = "float";
                break;
            case this.parser.AST_INT:
                node.type = "int";
                break;
            case this.parser.AST_BOOL:
                node.type = "bool";
                break;
            case this.parser.AST_STRING:
                node.type = "string";
                break;
            case this.parser.AST_ID:
            console.log("node.scope is ", node.scope);
                type = node.scope.getSymbol(node.value);
                if (type === undefined) 
                    throw new Error(`Can't use undeclared identifier ${node.value}`);
                node.type = type;
        }
    }

    checkBoolRules(rType, lType, operator) {
        let boolOps = ['&&', '||', '=='];
        if (rType !== lType)
            throw new Error(`Both side of the expression have to be boolean`);
        else if (boolOps.indexOf(operator) < 0) {
            throw new Error(`Undefined operator ${operator} for bool`);
        }
        return 'bool';
    }

    checkNumRules(rType, lType, operator) {
        let initOps = ["*", "/", "+", "%", "<", "-", ">", "!=", "=="];
        let bothInt = lType === "int" && rType === "int";
        if (initOps.indexOf(operator) < 0)
            throw new Error(`Undefined operator ${operator} for int`);

        if (lType === "float" || rType === "float")
            return "float";
        else if ((lType === "string" || rType === "string") && operator === "+")
            return "string";
        else if (bothInt && operator === "<")
            return "bool";
        else if (bothInt && operator === ">")
            return "bool";
        else if (bothInt && operator === "==")
            return "bool";
        else if (bothInt && operator === "!=")
            return "bool";
        else if (bothInt)
            return "int";
        else if (lType === "float" && rType === "float")
            return "float";
    }

    checkStringRules(rType, lType, operator) {
        if (operator != "+")
            throw new Error(`Undefined operator ${operator} for string`);
        return "string";
    }
}