function Portfolio(settings, parent) {
    this.settings = settings; // Settingsobjektet som skickas in från User.js
    this.parent = parent; // Referens till förälder containern (.container) som skickas in från User.js
    this.stocks = []; // Array to hold the stocks
    this.totalInvested = 0; // Total amount of money invested in stocks
    this.noStockMsg = null; // Message to display when the portfolio is empty
    this.isMsgVisible = false; // Flag to check if the no stock message is visible
    this.fadeTimeout = null; // Timeout for the fade-out animation
    this.balance = 0; // Add this line to initialize the balance
}

// Metod för att hämta aktier som ägs av användaren från portföljen (stocks) arrayen.
Portfolio.prototype.getOwnedStocks = function () {
    return this.stocks;
};

/// Method to add a stock to the portfolio
Portfolio.prototype.addStock = function (stock) {
    // Check if the stock already exists in the portfolio
    console.log(this.stocks);
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

Portfolio.prototype.calculateTotalInvestedOverTime = function () {
    // Skapa en ny array för att lagra det totala värdet av portföljen för varje dag
    this.totalValueOverTime = [];

    // För varje dag...
    for (let i = 0; i < 365; i++) {
        // Återställ det totala värdet av portföljen för den dagen
        var totalValue = 0;

        // Beräkna det totala värdet av portföljen för den dagen
        this.stocks.forEach(stock => {
            if (stock.historicalPrice[i]) {
                totalValue += stock.historicalPrice[i].close * stock.quantity;
            }
        });

        // Lägg till det totala värdet av portföljen för den dagen i arrayen
        this.totalValueOverTime.push({
            date: this.stocks[0].historicalPrice[i].date,
            totalValue: totalValue,
        });
    }
}

Portfolio.prototype.updateTotalInvested = function () {
    // Reset totalInvested
    this.totalInvested = 0;

    // Iterate over all stocks
    for (let i = 0; i < this.stocks.length; i++) {
        // Add the current value of the stock to totalInvested
        this.totalInvested += this.stocks[i].currentPrice * this.stocks[i].quantity;
    }

    // Round the final result
    this.totalInvested = parseFloat(this.totalInvested.toFixed(2));
};

// Method to display the portfolio chart
Portfolio.prototype.displayChart = function () {
    // Code to generate and display the chart
};

// Method to display the portfolio
Portfolio.prototype.showPortfolio = function (container) {
    // Check if the user has any stocks in the portfolio
    if (this.stocks.length > 0) {
        // Remove the container
        container.remove();

        // Create a new div for the portfolio
        this.portfolioDiv = document.createElement('div');
        this.portfolioDiv.id = 'portfolioDiv';

        // Calculate total invested and number of different stocks
        var totalInvested = this.stocks.reduce((total, stock) => total + stock.amountInvested, 0);
        totalInvested = parseFloat(totalInvested.toFixed(2));
        var numberOfStocks = this.stocks.length;

        var h2 = document.createElement('h2');
        h2.id = 'portfolioHeader';
        h2.innerHTML = 'Min Portfölj';
        this.portfolioDiv.appendChild(h2);

        // Create and append total invested and number of stocks
        var totalInvestedP = document.createElement('p');
        totalInvestedP.textContent = 'Totalt investerat: ' + totalInvested + ' USD$';
        this.portfolioDiv.appendChild(totalInvestedP);

        var numberOfStocksP = document.createElement('p');
        numberOfStocksP.textContent = 'Antal olika aktier: ' + numberOfStocks + ' st.';
        this.portfolioDiv.appendChild(numberOfStocksP);

        // Loop through the stocks and create a div for each one
        this.stocks.forEach(stock => {
            var stockDiv = document.createElement('div');
            stockDiv.class = 'stocksDiv';

            var individualStock = document.createElement('p');
            individualStock.innerHTML = '(' + stock.symbol + ') ' + stock.name + ' ' + stock.quantity + ' st.';
            stockDiv.appendChild(individualStock);

            var amountInvested = document.createElement('p');
            amountInvested.innerHTML = 'Investerat belopp: ' + stock.amountInvested;
            stockDiv.appendChild(amountInvested);

            // Logic to calculate and display profit or loss
            var profitOrLoss = document.createElement('p');
            var difference = stock.price * stock.quantity - stock.amountInvested;
            profitOrLoss.innerHTML = difference >= 0 ? 'Vinst: ' + difference : 'Förlust: ' + Math.abs(difference);
            stockDiv.appendChild(profitOrLoss);

            this.portfolioDiv.appendChild(stockDiv);
        });

        // Append the portfolio div to the parent
        this.parent.appendChild(this.portfolioDiv);
    } else {
        this.manageMessageVisibility(container); // Visa meddelande om portföljen är tom
    }
};

// Metod för att hantera fade-in och fade-out-effekter samt meddelandets synlighet när portföljen är tom
Portfolio.prototype.manageMessageVisibility = function (container) {
    if (!this.noStockMsg) {
        this.noStockMsg = document.createElement('p');
        this.noStockMsg.id = 'noStockMsg';
        this.noStockMsg.innerHTML = 'Du måste äga aktier innan portföljen kan visas!';
        container.appendChild(this.noStockMsg);
        this.fadeInAndOut();
    } else {
        this.fadeInAndOut();
    }
};
// Metod för att visa meddelandet om inga aktier med en fade-in och fade-out-effekt
Portfolio.prototype.fadeInAndOut = function () {
    if (this.animationInProgress) {
        return; // Gör inget om en animation redan pågår
    }

    this.animationInProgress = true; // Sätter flaggan till true för att indikera att en animation pågår

    if (!this.noStockMsg) {
        this.noStockMsg = document.createElement('p');
        this.noStockMsg.id = 'noStockMsg';
        this.noStockMsg.innerHTML = 'Du måste äga aktier innan portföljen kan visas!';
        container.appendChild(this.noStockMsg);
    }

    // Trigga en reflow för att starta en ny animation. En reflow är en process där webbläsaren beräknar layouten för elementen på sidan för att uppdatera dem, och därmed starta en ny CSS-animation.
    this.noStockMsg.offsetWidth;
    this.noStockMsg.classList.add('show');

    setTimeout(() => {
        this.noStockMsg.classList.remove('show');
        this.noStockMsg.classList.add('hide');

        setTimeout(() => {
            this.noStockMsg.remove();
            this.noStockMsg = null; // Nollställ referensen till meddelandet
            this.animationInProgress = false; // Sätt flaggan till false för att indikera att animationen är klar
        }, 1000); // Vänta 1 sekund innan meddelandet tas bort
    }, 3000); // Visa meddelandet i 3 sekunder
};

// Method to show the amount of money invested in stocks
Portfolio.prototype.showInvestedMoney = function () {
    return this.totalInvested;
};

// Method to update the balance after a stock purchase
Portfolio.prototype.updateBalance = function (newStock) {
    // If newStock is not defined, return the current balance
    if (!newStock) {
        return this.balance;
    }

// Calculate the amount spent on the new stock
var spentOnNewStock = parseFloat(newStock.price * newStock.quantity);

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

// Method to set the balance
Portfolio.prototype.setBalance = function (balance) {
    this.balance = parseFloat(balance);
};

// Method to get the balance
Portfolio.prototype.getBalance = function () {
    return this.balance;
};