// Funktion för att skapa en aktieklass
function Stock(stockPrice, symbol, name, price, quantity) {
    this.priceData = stockPrice;
    this.symbol = symbol;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.amountInvested = this.price * this.quantity;
}