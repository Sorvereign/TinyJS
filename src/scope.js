export default class Scope {
  
  constructor(parent) {
    this.table = {};
    this.parent = parent;
  }

  putSymbol(symbol, type) {
    if (this.getSymbol(symbol) !== undefined)
      throw new Error(`Can't redeclare variable ` + symbol);
    this.table[symbol] = type;
  }

  getSymbol(symbol) {
    if (this.table[symbol] === undefined && this.parent)
      return this.parent.getSymbol(symbol);
    return this.table[symbol];
  }
}