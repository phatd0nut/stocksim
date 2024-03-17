// Klass för aktier. Här skapas objekt för aktier som används i appen. Tar emot symbol, namn, pris och kvantitet som argument.
function Stock(symbol, name, price, quantity) {
    this.symbol = symbol;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.amountInvested = this.price * this.quantity;
}