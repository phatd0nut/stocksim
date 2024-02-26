function BuyStocks(symbol, name, apiKey, balance) {


    
    // Method to get the user's balance
    this.getBudget = function (budget) {
        return budget;
    };
    this.portfolioBudget = this.getBudget(balance); // Pass balance to getBudget

    // Method to buy stocks
    this.buyStock = function (stock, quantity) {
        var totalCost = stock.price * quantity;
        if (this.portfolioBudget >= totalCost) {
            this.portfolioBudget -= totalCost;
            this.stocks.push({
                stock: stock,
                quantity: quantity
            });
        } else {
            console.log("You don't have enough portfolioBudget to buy this stock.");
        }
    };
}