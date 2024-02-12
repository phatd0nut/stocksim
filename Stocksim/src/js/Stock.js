// Funktion för att skapa en aktieklass
function Stock(ticker, stockName, price) {
    this.ticker = ticker;
    this.stockName = stockName;
    this.price = price;

    if (ticker === null || stockName === null || price === null) {
        this.noStockInfo();
    }

    this.noStockInfo = function () {
        return "No stock information available for " + this.stockName + " (" + this.ticker + ")";
    };
}