function Portfolio(parent, settings) {
    this.settings = settings; // Settingsobjektet som skickas in från User.js
    this.parent = parent; // Referens till förälder containern (.container) som skickas in från User.js
    this.stocks = []; // Array to hold the stocks
    this.totalInvested = 0; // Total amount of money invested in stocks
    this.noStockMsg = null; // Message to display when the portfolio is empty
    this.isMsgVisible = false; // Flag to check if the no stock message is visible
    this.fadeTimeout = null; // Timeout for the fade-out animation
    this.balance = 0; // Add this line to initialize the balance

    this.getOwnedStocks(); // Hämta aktier som ägs av användaren från cookies
    this.scheduleUpdate(); // Anropar metoden för att uppdatera aktiernas prestanda varje dag kl. 22:00
};

Portfolio.prototype.scheduleUpdate = function () {
    // Hämta aktuellt datum och tid
    var now = new Date();

    // Kalibrera tiden till 22:00 så att uppdateringen sker kl. 22:00
    var msTo22 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0, 0) - now;
    if (msTo22 < 0) {
        // Om klockan är över 22:00, lägg till 24 timmar så att uppdateringen sker nästa dag kl. 22:00
        msTo22 += 24 * 60 * 60 * 1000;
    }

    setTimeout(() => {
        this.updateStocksPerformance();

        // Anropa metoden varje 24 timmar
        setInterval(() => this.updateStocksPerformance(), 24 * 60 * 60 * 1000);
    }, msTo22);
};

Portfolio.prototype.initLS = function () {
    var storedTotalValue = localStorage.getItem('totalValue');
    var storedTotalValueChangePercentage = localStorage.getItem('totalValueChangePercentage');
    var storedRealTimePriceArr = localStorage.getItem('realTimePriceArr');

    if (storedRealTimePriceArr) {
        this.realTimePriceArr = JSON.parse(storedRealTimePriceArr);
    }

    if (storedTotalValue) {
        this.totalValue = JSON.parse(storedTotalValue);
    }

    if (storedTotalValueChangePercentage) {
        this.totalValueChangePercentage = JSON.parse(storedTotalValueChangePercentage);
    }
};

Portfolio.prototype.initSearchClass = function (searchClass) {
    this.searchClass = searchClass;
    return this.searchClass;
};

Portfolio.prototype.initPriceClass = function (priceClass) {
    this.priceClass = priceClass;
    return this.priceClass;
}

// Metod för att hämta aktier som ägs av användaren från portföljen (stocks) arrayen.
Portfolio.prototype.getOwnedStocks = function () {
    var stocksInCookies = this.getCookie('stocks');
    if (stocksInCookies) {
        this.stocks = JSON.parse(stocksInCookies);
    }
    // Always return this.stocks, whether it's been updated or not
    return this.stocks;
};

// Method to add a stock to the portfolio
Portfolio.prototype.addStock = function (stock) {
    // Calculate the amount that would be spent on the new stock
    var spentOnNewStock = parseFloat(stock.price * stock.quantity);

    // Check if the balance will go negative
    if (this.getBalance() - spentOnNewStock < 0) {
        alert('Du har inte tillräckligt med pengar för att köpa aktierna!');
        return;
    }

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

    // Update the stocks performance after adding a new stock
    this.updateStocksPerformance();
};

// Method to update the total value of the portfolio
Portfolio.prototype.updatePortfolioValue = function () {
    // Initialize the total value to 0
    this.totalValue = 0;
    this.totalValueChangePercentage = 0;

    // Iterate over all stocks
    for (var i = 0; i < this.stocks.length; i++) {
        var stock = this.stocks[i];

        // Add the current value of the stock to the total value
        this.totalValue += stock.price * stock.quantity;
    }

    // Round the final result to 2 decimal places
    this.totalValue = parseFloat(this.totalValue.toFixed(2));

    // Calculate the percentage change in the total value
    if (this.totalInvested) {
        if (this.totalValue > this.totalInvested) {
            this.totalValueChangePercentage = "+ " + ((this.totalValue - this.totalInvested) / this.totalInvested * 100).toFixed(2) + "%";
        } else if (this.totalValue < this.totalInvested) {
            this.totalValueChangePercentage = "- " + Math.abs((this.totalValue - this.totalInvested) / this.totalInvested * 100).toFixed(2) + "%";
        } else {
            this.totalValueChangePercentage = "0%";
        }
    } else {
        this.totalValueChangePercentage = "0%";
    }

    // Save the totalValue and totalValueChangePercentage in localStorage
    localStorage.setItem('totalValue', JSON.stringify(this.totalValue));
    localStorage.setItem('totalValueChangePercentage', JSON.stringify(this.totalValueChangePercentage));
};

Portfolio.prototype.updateStocksPerformance = async function () {
    this.realTimePriceArr = [];
    var priceChangePercentage;

    // Iterera över alla aktier
    for (var i = 0; i < this.stocks.length; i++) {
        var stock = this.stocks[i];

        this.priceClass.setSymbol(stock.symbol);

        // Hämta det senaste realtidspriset (med en 15 minuters fördröjning) baserat på aktiesymbolen
        var currentPrice = await this.priceClass.getRealTimePrice();

        // Jämför realtidspriset med det initiala priset
        if (currentPrice > stock.price) {
            priceChangePercentage = "+ " + ((currentPrice - stock.price) / stock.price * 100).toFixed(2) + "%";
            this.realTimePriceArr.push(priceChangePercentage);
        } else if (currentPrice < stock.price) {
            priceChangePercentage = "-" + " " + Math.abs((currentPrice - stock.price) / stock.price * 100).toFixed(2) + "%";
            this.realTimePriceArr.push(priceChangePercentage);
        } else {
            priceChangePercentage = 0 + "%";
            this.realTimePriceArr.push(priceChangePercentage);
        }

        // Save the realTimePriceArr in localStorage
        localStorage.setItem('realTimePriceArr', JSON.stringify(this.realTimePriceArr));
    }
    this.updatePortfolioValue();
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
    var classes = ['.setupDiv', '.searchBox', '.createUserDiv', '.stockPage'];
    var elements = [];
    classes.forEach((className) => {
        var element = document.querySelector(className);
        if (element) {
            elements.push(element);
        }
    });
    elements.forEach((element) => {
        element.remove();
    });
};

Portfolio.prototype.returnBtn = async function (container) {
    await this.settings.loadThemeFromCookie();

    var backToSearchDiv = document.createElement('div');
    backToSearchDiv.id = 'backToSearchDiv';
    container.insertBefore(backToSearchDiv, container.firstChild);

    var goBackToSearch2 = document.createElement('img');
    goBackToSearch2.id = 'goBackToSearch2';
    if (document.querySelector('.container[data-mode="dark"]')) {
        goBackToSearch2.src = '../src/img/search_2.png';
    } else {
        goBackToSearch2.src = '../src/img/search_1.png';
    }
    backToSearchDiv.appendChild(goBackToSearch2);

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
Portfolio.prototype.showPortfolio = function () {
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

        // Create a new div for the portfolio if it doesn't exist
        if (!this.portfolioDiv) {
            this.portfolioDiv = document.createElement('div');
            this.portfolioDiv.className = 'portfolioDiv';
            // Remove visible elements
            this.removeVisibleDivs();
            this.settings.removePortfolioIcon();
            this.returnBtn(this.portfolioDiv);
        } else {
            // Clear the previous content
            this.removeVisibleDivs();
            this.portfolioDiv.innerHTML = '';
            this.settings.removePortfolioIcon();
            this.returnBtn(this.portfolioDiv);
        }

        // Calculate total invested and number of different stocks
        this.totalInvested = this.stocks.reduce((total, stock) => total + stock.amountInvested, 0);
        this.totalInvested = parseFloat(this.totalInvested.toFixed(2));
        this.numberOfStocks = this.stocks.length;

        this.h2 = document.createElement('h2');
        this.h2.id = 'portfolioHeader';
        this.h2.innerHTML = 'Min Portfölj';
        this.portfolioDiv.appendChild(this.h2);

        this.updateStocksPerformance().then(() => {
            // Create and append total invested
            this.totalInvestedP = document.createElement('p');
            this.totalInvestedP.textContent = 'Totalt investerat: ' + this.totalInvested + ' USD$ (' + this.totalValueChangePercentage + ' förändring)';
            this.portfolioDiv.appendChild(this.totalInvestedP);

            this.numberOfStocksP = document.createElement('p');
            this.numberOfStocksP.textContent = 'Antal olika aktier: ' + this.numberOfStocks + ' st.';
            this.portfolioDiv.appendChild(this.numberOfStocksP);


            // Create a new div to hold all the stockDiv elements
            this.stockHolderDiv = document.createElement('div');
            this.stockHolderDiv.id = 'stockHolderDiv';

            this.updateStocksPerformance().then(() => {
                this.stocks.forEach((stock, index) => {
                    this.stockDiv = document.createElement('div');
                    this.stockDiv.className = 'stocksDiv';

                    if (document.querySelector('.container[data-mode="dark"]')) {
                        this.stockDiv.style.backgroundColor = '#4e594a';
                        this.stockHolderDiv.style.backgroundColor = '#f9ffae';
                    } else if (document.querySelector('.container[data-mode="light"]')) {
                        this.stockDiv.style.backgroundColor = '#278664';
                        this.stockHolderDiv.style.backgroundColor = '#ffffff';
                    }

                    // Create a div for the symbol, name and profitOrLoss
                    this.infoDiv = document.createElement('div');
                    this.infoDiv.className = 'info1';

                    this.individualStock = document.createElement('p');
                    var fontSize = stock.name.length > 20 ? '0.85rem' : '1rem';
                    this.individualStock.innerHTML = '<b>(' + stock.symbol + ')</b> ' + '<span id="stockNameSpan" style="font-size: ' + fontSize + '">' + stock.name + '</span>';

                    this.infoDiv.appendChild(this.individualStock);
                    // Procentuell vinst/förlust element
                    this.profitOrLoss = document.createElement('p');
                    this.profitOrLoss.id = 'profitOrLoss';
                    // Använd index för att hämta motsvarande procentandel från arrayen
                    this.profitOrLoss.innerHTML = this.realTimePriceArr[index];


                    this.infoDiv.appendChild(this.profitOrLoss);

                    this.stockDiv.appendChild(this.infoDiv);

                    // Create a div for the quantity and amountInvested
                    var detailsDiv = document.createElement('div');
                    detailsDiv.className = 'info2';
                    detailsDiv.style.maxHeight = '0px'; // Hide initially

                    this.amountInvested = document.createElement('p');
                    this.amountInvested.innerHTML = 'Investerat: ' + stock.amountInvested.toFixed(2) + ' USD$';
                    detailsDiv.appendChild(this.amountInvested);

                    this.quantity = document.createElement('p');
                    this.quantity.innerHTML = '(' + stock.quantity + ' st.)';
                    detailsDiv.appendChild(this.quantity);

                    this.stockDiv.appendChild(detailsDiv);

                    // Add a flag to track if the element is expanding
                    var isExpanding = false;

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
            });

            // Append the stockHolderDiv to the portfolioDiv
            this.portfolioDiv.appendChild(this.stockHolderDiv);

            // Append the portfolio div to the parent
            this.parent.appendChild(this.portfolioDiv);
        });
    } else {
        return
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
    // Read the balance from cookies
    this.balance = parseFloat(document.cookie.replace(/(?:(?:^|.*;\s*)balance\s*\=\s*([^;]*).*$)|^.*$/, "$1"));

    // If newStock is not defined, return the current balance
    if (!newStock) {
        return this.balance;
    }

    // Calculate the amount spent on the new stock
    var spentOnNewStock = parseFloat(newStock.price * newStock.quantity);

    /*
        if (this.balance - spentOnNewStock < 0) {
            alert('Du har inte tillräckligt med pengar för att köpa aktierna!');
            return;
        }
    */
    // Subtract the amount spent on the new stock from the balance
    this.balance -= spentOnNewStock;

    // Round the final result to 2 decimal places
    this.balance = parseFloat(this.balance.toFixed(2));

    // Save the updated balance as a cookie
    document.cookie = `balance=${this.balance};path=/`;
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