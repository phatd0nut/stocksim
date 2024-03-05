function Portfolio() {
    this.stocks = []; // Array to hold the stocks
    this.totalInvested = 0; // Total amount of money invested in stocks
}


/// Method to add a stock to the portfolio
Portfolio.prototype.addStock = function (stock) {
    // Check if the stock already exists in the portfolio
    var existingStock = this.stocks.find(s => s.symbol === stock.symbol);

    if (existingStock) {
        // If it exists, increase the quantity and update the totalInvested
        existingStock.quantity += stock.quantity;
        this.totalInvested += stock.price * stock.quantity;
    } else {
        // If it doesn't exist, add it to the portfolio and update the totalInvested
        if (this.stocks.length < 10) {
            this.stocks.push(stock);
            this.totalInvested += stock.price * stock.quantity;
        } else {
            console.log("You can't hold more than 10 stocks");
            return;
        }
    }

    this.totalInvested = parseFloat(this.totalInvested.toFixed(2)); // Round the final result

    // Update the balance
    this.updateBalance(stock);

    console.log('Stock Added:', stock);
    console.log('Total Invested:', this.totalInvested);
    console.log('Portfolio Balance:', this.balance);
};

// Method to remove a stock from the portfolio
Portfolio.prototype.removeStock = function (stock) {
    var index = this.stocks.indexOf(stock);
    if (index > -1) {
        this.stocks.splice(index, 1);
        this.totalInvested -= stock.price * stock.quantity;
    }
};

// Method to display the portfolio chart
Portfolio.prototype.displayChart = function () {
    // Code to generate and display the chart
};

// Method to sell a stock
Portfolio.prototype.sellStock = function (stock) {
    // Code to sell the stock and update the totalInvested
};

// Method to show the amount of money invested in stocks
Portfolio.prototype.showInvestedMoney = function () {
    return this.totalInvested;
};

// Method to set the balance
Portfolio.prototype.setBalance = function (balance) {
    this.balance = balance;
};

// Method to update the balance after a stock purchase
Portfolio.prototype.updateBalance = function (newStock) {
    // If newStock is not defined, return the current balance
    if (!newStock) {
        return this.balance;
    }

    // Calculate the amount spent on the new stock
    var spentOnNewStock = newStock.price * newStock.quantity;

    // Check if the balance will go negative
    if (this.balance - spentOnNewStock < 0) {
        console.error('Insufficient balance to buy this stock');
        return;
    }

    // Subtract the amount spent on the new stock from the balance
    this.balance -= spentOnNewStock;

    // Round the final result to 2 decimal places
    this.balance = parseFloat(this.balance.toFixed(2));
};


// Method to get the balance
Portfolio.prototype.getBalance = function () {
    this.updateBalance(); // Update the balance before returning it
    return this.balance;
};