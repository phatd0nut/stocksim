// Funktion för att skapa en aktieklass
function Stock(symbol, name, price, quantity) {
    this.symbol = symbol;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.amountInvested = this.price * this.quantity;
}

