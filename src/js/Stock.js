// Funktion för att skapa en aktieklass
function Stock(ticker, name, type, region, price) {
    this.ticker = ticker;
    this.name = name;
    this.type = type;
    this.region = region;
    this.price = price;

    if (ticker === null || name === null || price === null) {
        this.noStockInfo();
    }

    this.noStockInfo = function () {
        return "No stock information available for " + this.name + " (" + this.ticker + ")";
    };
}

