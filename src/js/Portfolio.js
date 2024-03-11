function Portfolio(settings, parent) {
    this.settings = settings; // Settingsobjektet som skickas in från User.js
    this.parent = parent; // Referens till förälder containern (.container) som skickas in från User.js
    this.stocks = []; // Array to hold the stocks
    this.totalInvested = 0; // Total amount of money invested in stocks
    this.noStockMsg = null; // Message to display when the portfolio is empty
    this.isMsgVisible = false; // Flag to check if the no stock message is visible
    this.fadeTimeout = null; // Timeout for the fade-out animation
    this.balance = 0; // Add this line to initialize the balance
};

Portfolio.prototype.initSearchClass = function (searchClass) {
    this.searchClass = searchClass;
};

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
            alert("Du kan inte äga fler än 10 olika aktier i din portfölj!");
            return;
        }
    }

    this.totalInvested = parseFloat(this.totalInvested.toFixed(2)); // Round the final result

    // Update the balance
    this.updateBalance(stock);

    // Save a cookie for the stock without an expiration date
    document.cookie = `${stock.symbol}=${JSON.stringify(stock)};path=/`;

    // Save the entire stocks array as a cookie
    document.cookie = `stocks=${JSON.stringify(this.stocks)};path=/`;
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

Portfolio.prototype.getCookie = function (name) {
    var cookieArr = document.cookie.split(";");
    for (var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

Portfolio.prototype.removeVisibleDivs = function () {
    var classes = ['setupDiv', 'searchBox', 'createUserDiv', 'searchBox'];
    classes.forEach((className) => {
        var elements = document.querySelectorAll('.' + className);
        elements.forEach((element) => {
            element.remove();
        });
    });
};

Portfolio.prototype.settingsBtn = async function (container) {
    await this.settings.loadThemeFromCookie();
    this.settings.createIcons();
    this.settings.settingsIcon();
    this.settings.getSettingsIconElm();

    var backToSearchDiv = document.createElement('div');
    backToSearchDiv.id = 'backToSearchDiv';
    container.appendChild(backToSearchDiv);

    var backToSearchIcon = document.createElement('img');
    backToSearchIcon.src = '../src/img/search_1.png';
    backToSearchIcon.id = 'backToSearchIcon';
    backToSearchDiv.appendChild(backToSearchIcon);

    var backToSearchP = document.createElement('p');
    backToSearchP.id = 'backToSearchP';
    backToSearchP.textContent = 'Sök aktier';
    backToSearchDiv.appendChild(backToSearchP);

    backToSearchDiv.addEventListener('click', () => {
        this.settings.removeIcons();
        if (this.portfolioDiv) {
            this.portfolioDiv.remove();
            backToSearchDiv.remove();
            this.searchClass.createSearchBox();
        }
    });
};


// Method to display the portfolio
Portfolio.prototype.showPortfolio = function (container, previousReference, goBack, previous) {
    // Check if the user has any stocks in the portfolio or in the cookies
    var stocksInCookies = this.getCookie('stocks');
    if (this.stocks.length > 0 || (stocksInCookies && JSON.parse(stocksInCookies).length > 0)) {
        if (stocksInCookies) {
            var stocksFromCookies = JSON.parse(stocksInCookies);
            // Merge this.stocks and stocksFromCookies
            var mergedStocks = this.stocks.concat(stocksFromCookies);
            // Filter out duplicates
            this.stocks = mergedStocks.filter((stock, index, self) =>
                index === self.findIndex((t) => (
                    t.symbol === stock.symbol
                ))
            );
        }

        // Remove visible elements
        this.removeVisibleDivs();
        this.settingsBtn(container, previous);

        // Create a new div for the portfolio
        this.portfolioDiv = document.createElement('div');
        this.portfolioDiv.className = 'portfolioDiv';

        // Calculate total invested and number of different stocks
        this.totalInvested = this.stocks.reduce((total, stock) => total + stock.amountInvested, 0);
        this.totalInvested = parseFloat(this.totalInvested.toFixed(2));
        this.numberOfStocks = this.stocks.length;

        this.h2 = document.createElement('h2');
        this.h2.id = 'portfolioHeader';
        this.h2.innerHTML = 'Min Portfölj';
        this.portfolioDiv.appendChild(this.h2);

        // Create and append total invested and number of stocks
        this.totalInvestedP = document.createElement('p');
        this.totalInvestedP.textContent = 'Totalt investerat: ' + this.totalInvested + ' USD$';
        this.portfolioDiv.appendChild(this.totalInvestedP);

        this.numberOfStocksP = document.createElement('p');
        this.numberOfStocksP.textContent = 'Antal olika aktier: ' + this.numberOfStocks + ' st.';
        this.portfolioDiv.appendChild(this.numberOfStocksP);

        // Create a new div to hold all the stockDiv elements
        this.stockHolderDiv = document.createElement('div');
        this.stockHolderDiv.id = 'stockHolderDiv';

        this.stocks.forEach(stock => {
            this.stockDiv = document.createElement('div');
            this.stockDiv.className = 'stocksDiv';

            // Create a div for the symbol, name and profitOrLoss
            this.infoDiv = document.createElement('div');
            this.infoDiv.className = 'info1';

            this.individualStock = document.createElement('p');
            this.individualStock.innerHTML = '(<b>' + stock.symbol + '</b>) ' + stock.name;
            this.infoDiv.appendChild(this.individualStock);

            // Logic to calculate and display profit or loss
            this.profitOrLoss = document.createElement('p');
            // Get the initial price and the latest closing price
            this.initialPrice = stock.price;
            this.latestClosingPrice = 'N/A';
            // Check if there is more than one closing price
            if (stock.historicalPrice && stock.historicalPrice.length > 1) {
                this.latestClosingPrice = stock.historicalPrice[stock.historicalPrice.length - 1].close;
                // Calculate the change in percent
                this.changePercent = ((this.latestClosingPrice - this.initialPrice) / this.initialPrice) * 100;
                this.profitOrLoss.innerHTML = this.changePercent >= 0 ? '+' + this.changePercent.toFixed(2) + '<b>%</b>' : '-' + Math.abs(this.changePercent.toFixed(2)) + '<b>%</b>';
            } else {
                this.profitOrLoss.innerHTML = '<b>0%</b>';
            }
            this.infoDiv.appendChild(this.profitOrLoss);

            this.stockDiv.appendChild(this.infoDiv);

            // Create a div for the quantity and amountInvested
            var detailsDiv = document.createElement('div');
            detailsDiv.className = 'info2';
            detailsDiv.style.maxHeight = '0px'; // Hide initially

            this.amountInvested = document.createElement('p');
            this.amountInvested.innerHTML = 'Investerat: ' + stock.amountInvested + ' USD$';
            detailsDiv.appendChild(this.amountInvested);

            this.quantity = document.createElement('p');
            this.quantity.innerHTML = '(' + stock.quantity + ' st.)';
            detailsDiv.appendChild(this.quantity);

            this.stockDiv.appendChild(detailsDiv);

            // Add a flag to track if the element is expanding
            let isExpanding = false;

            // Add click event listener to the stockDiv
            this.stockDiv.addEventListener('click', () => {
                if (isExpanding) {
                    // If the element is still expanding, finish the expansion immediately and collapse it
                    detailsDiv.style.transition = 'none';
                    detailsDiv.style.maxHeight = '500px';
                    // Use setTimeout to allow the browser to update the max-height
                    setTimeout(() => {
                        detailsDiv.style.transition = 'max-height 0.2s ease-in-out';
                        detailsDiv.style.maxHeight = '0px';
                    }, 0);
                    isExpanding = false;
                } else if (detailsDiv.style.maxHeight !== '0px') {
                    detailsDiv.style.maxHeight = '0px';
                } else {
                    detailsDiv.style.maxHeight = '500px'; // Or any other value that is enough to show the content
                    isExpanding = true;
                }
            });

            this.stockHolderDiv.appendChild(this.stockDiv);
        });

        // Append the stockHolderDiv to the portfolioDiv
        this.portfolioDiv.appendChild(this.stockHolderDiv);

        // Append the portfolio div to the parent
        this.parent.appendChild(this.portfolioDiv);
        this.return(previous, previousReference, goBack);
    } else {
        if (this.balance > 0) {
            this.manageMessageVisibility(container); // Visa meddelande om portföljen är tom
        }
    }
};

// Metod för att hantera fade-in och fade-out-effekter samt meddelandets synlighet när portföljen är tom
Portfolio.prototype.manageMessageVisibility = function (container) {
    if (!this.noStockMsg) {
        this.noStockMsg = document.createElement('p');
        this.noStockMsg.id = 'noStockMsg';
        this.noStockMsg.innerHTML = 'Du måste äga aktier innan portföljen kan visas!';
        
        // Kontrollera om container är definierad innan du använder appendChild
        if (container) {
            container.appendChild(this.noStockMsg);
        }
    }

    // Kontrollera om fadeInAndOut redan körs eller inte
    if (!this.animationInProgress) {
        this.fadeInAndOut();
    }
};


// Metod för att visa meddelandet om inga aktier med en fade-in och fade-out-effekt
Portfolio.prototype.fadeInAndOut = function () {
    if (this.animationInProgress) {
        return; // Gör inget om en animation redan pågår
    }

    this.animationInProgress = true; // Sätter flaggan till true för att indikera att en animation pågår

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
        alert('Du har inte tillräckligt med pengar för att köpa aktierna!');
        return;
    }

    // Subtract the amount spent on the new stock from the balance
    this.balance -= spentOnNewStock;

    // Round the final result to 2 decimal places
    this.balance = parseFloat(this.balance.toFixed(2));

    document.cookie = `balance=${this.balance};path=/`;  // Save the balance as a cookie
};

// Method to set the balance
Portfolio.prototype.setBalance = function (balance) {
    this.balance = parseFloat(balance);
};

// Method to get the balance
Portfolio.prototype.getBalance = function () {
    // Try to retrieve the balance from the cookie
    var balanceFromCookie = parseFloat(this.getCookie('balance'));

    // If the balance is not found in the cookie, return the current balance
    if (isNaN(balanceFromCookie)) {
        return this.balance;
    }

    return balanceFromCookie;
};

Portfolio.prototype.return = function (previous, previousReference, goBack) {
    if (previousReference === 'search') {
        goBack.createGoBack(previous, 'createSearchBox', this.portfolioDiv).then(() => {
            // The Promise has resolved, so the new page has been created
            // Now you can prepare the chart
            var settingsIcon = document.querySelector('#settingsIcon');
            settingsIcon.remove();
        });
    } else if (previousReference === 'stockPage') {
        goBack.createGoBack(previous, 'createStockPage', this.portfolioDiv, previous.name, previous.symbol).then(() => {
            // The Promise has resolved, so the new page has been created
            // Now you can prepare the chart
            previous.prepareChart(previous.symbol, previous.apiKey, 'week');
        });
    }
};