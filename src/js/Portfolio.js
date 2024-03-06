function Portfolio(settings) {
    this.settings = settings; // Settingsobjektet som skickas in från User.js
    this.stocks = []; // Array to hold the stocks
    this.totalInvested = 0; // Total amount of money invested in stocks
    this.noStockMsg = null; // Message to display when the portfolio is empty
    this.isMsgVisible = false; // Flag to check if the no stock message is visible
    this.fadeTimeout = null; // Timeout for the fade-out animation
}

// Metod för att hämta aktier som ägs av användaren från portföljen (stocks) arrayen.
Portfolio.prototype.getOwnedStocks = function () {
    return this.stocks;
};

/// Method to add a stock to the portfolio
Portfolio.prototype.addStock = function (stock) {
    // Check if the stock already exists in the portfolio
    var existingStock = this.stocks.find(s => s.symbol === stock.symbol);

    if (existingStock) {
        // If it exists, increase the quantity and update the totalInvested and amountInvested
        existingStock.quantity += stock.quantity;
        existingStock.amountInvested += stock.amountInvested;
        this.totalInvested += stock.amountInvested;
    } else {
        // If it doesn't exist, add it to the portfolio and update the totalInvested
        if (this.stocks.length < 10) {
            this.stocks.push(stock);
            this.totalInvested += stock.amountInvested;
        } else {
            console.log("You can't hold more than 10 stocks");
            return;
        }
    }

    this.totalInvested = parseFloat(this.totalInvested.toFixed(2)); // Round the final result

    // Update the balance
    this.updateBalance(stock);
};

// Method to display the portfolio chart
Portfolio.prototype.displayChart = function () {
    // Code to generate and display the chart
};

// Method to display the portfolio
Portfolio.prototype.showPortfolio = function (container) {
    // Check if the user has any stocks in the portfolio
    if (this.stocks.length > 0) {
        console.log('Displaying portfolio...');

        // Code to display the portfolio content (e.g., table, list, etc.)
        // Replace this comment with the actual code to show the portfolio content.

    } else {
        this.manageMessageVisibility(container); // Visa meddelande om portföljen är tom
    }
};

// Metod för att hantera fade-in och fade-out-effekter samt meddelandets synlighet när portföljen är tom
Portfolio.prototype.manageMessageVisibility = function (container) {
    if (!this.noStockMsg) {
        this.noStockMsg = document.createElement('p');
        this.noStockMsg.id = 'noStockMsg';
        this.noStockMsg.innerHTML = 'Lägg till en aktie i portföljen innan du kan öppna portföljen!';
        container.appendChild(this.noStockMsg);
        this.fadeInAndOut();
    } else {
        this.fadeInAndOut();
    }
};

// Metod för att hantera fade-in och fade-out-effekter för meddelandet som visas när portföljen är tom
Portfolio.prototype.fadeInAndOut = function () {
    clearTimeout(this.fadeTimeout);

    if (this.isMsgVisible) { // Om meddelandet är synligt ska det försvinna
        this.noStockMsg.style.opacity = 1;
        this.fadeTimeout = setTimeout(() => {
            this.noStockMsg.style.opacity = 0;
            this.removeMessage();
        }, 3000);
        this.isMsgVisible = false;
    } else { // Om meddelandet inte är synligt ska det visas
        this.noStockMsg.style.opacity = 1;
        this.fadeTimeout = setTimeout(() => {
            this.noStockMsg.style.opacity = 0;
            this.removeMessage();
        }, 3000);
        this.isMsgVisible = true;
    }
};

// Metod för att ta bort meddelandet och nollställa referensen
Portfolio.prototype.removeMessage = function () {
    setTimeout(() => {
        this.noStockMsg.remove();
        this.noStockMsg = null; // Nollställ referensen till meddelandet
    }, 1000); // Vänta 1 sekund innan meddelandet tas bort
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