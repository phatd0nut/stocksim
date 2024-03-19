// Klassen för portföljen. Här hanteras allt som har med portföljen att göra, t.ex. att lägga till och ta bort aktier, visa portföljen, uppdatera portföljens värde, etc.
function Portfolio(parent, settings) {
    this.settings = settings; // Settings objektet som skickas in från CreateUser.js.
    this.parent = parent; // Referens till förälder containern (.container) som skickas in från User.js.
    this.stocks = []; // Array för att lagra aktier som ägs av användaren.
    this.totalInvested = 0; // Totalt investerat belopp i aktier. Sätts till 0 från början.
    this.noStockMsg = null; // Referens till meddelandet om att portföljen är tom.
    this.isMsgVisible = false; // Flaggar för att meddela noStockMsgs synlighet.
    this.fadeTimeout = null; // Timeout for the fade-out animation gällande noStockMsg.
    this.balance = 0; // Initialt värde för användarens budget. Sätts till 0 från början.

    this.getOwnedStocks(); // Hämta aktier som ägs av användaren från cookies.
    this.scheduleUpdate(); // Anropar metoden för att uppdatera aktiernas prestanda varje dag kl. 22:00.
};

// Metod för att schemalägga uppdateringen av aktiernas prestanda.
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

// Metod för att initiera localStorage och hämta data från localStorage.
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

// Metod för att initiera Search klassen i Portfolio klassen.
Portfolio.prototype.initSearchClass = function (searchClass) {
    this.searchClass = searchClass;
    return this.searchClass;
};

// Metod för att initiera Price klassen i Portfolio klassen.
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
    return this.stocks;
};

// Metod för att lägga till en ny aktie i portföljen.
Portfolio.prototype.addStock = function (stock) {
    // Beräkna hur mycket pengar som spenderas på nya aktier.
    var spentOnNewStock = parseFloat(stock.price * stock.quantity);

    // Kontrollera om användaren har tillräckligt med pengar för att köpa aktierna.
    if (this.getBalance() - spentOnNewStock < 0) {
        alert('Du har inte tillräckligt med pengar för att köpa aktierna!');
        return;
    }

    // Kontrollera om användaren redan äger aktier av samma typ
    var existingStock = this.stocks.find(s => s.symbol === stock.symbol);

    if (existingStock) {
        existingStock.quantity += stock.quantity;
        existingStock.amountInvested += stock.amountInvested;
        this.totalInvested += stock.amountInvested;
    } else {
        if (this.stocks.length < 10) {
            this.stocks.push(stock);
            this.totalInvested += stock.amountInvested;
        } else {
            alert("Du kan inte äga fler än 10 olika aktier i din portfölj!");
            return;
        }
    }

    this.totalInvested = parseFloat(this.totalInvested.toFixed(2));

    // Uppdatera balansen efter att ha köpt nya aktier. Skicka med den nya aktien som argument för hålla reda på hur mycket pengar som spenderas på nya aktier.
    this.updateBalance(stock);

// Spara aktiesymbolen som en cookie.
document.cookie = `${stock.symbol}=${JSON.stringify(stock)};path=/;expires=Fri, 01 Dec 9999 00:00:00 GMT`;

// Spara hela aktie arrayen som en cookie.
document.cookie = `stocks=${JSON.stringify(this.stocks)};path=/;expires=Fri, 01 Dec 9999 00:00:00 GMT`;

    // Anropa metoden för att aktiernas prestanda ska uppdateras.
    this.updateStocksPerformance();
};

// Metod för att uppdatera portföljens värde.
Portfolio.prototype.updatePortfolioValue = function () {
    // Sätt totalValue och totalValueChangePercentage till 0 från början.
    this.totalValue = 0; // Referens till portföljens totala värde.
    this.totalValueChangePercentage = 0; // Referens till portföljens totala värdeförändring i procent.

    // Iterera över alla aktier
    for (var i = 0; i < this.stocks.length; i++) {
        var stock = this.stocks[i];

        // Lägg till aktiens värde till totalValue.
        this.totalValue += stock.price * stock.quantity;
    }

    this.totalValue = parseFloat(this.totalValue.toFixed(2));

    // Jämför totalValue med totalInvested för att räkna ut totalValueChangePercentage.
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

    // Spara totalValue och totalValueChangePercentage i localStorage.
    localStorage.setItem('totalValue', JSON.stringify(this.totalValue));
    localStorage.setItem('totalValueChangePercentage', JSON.stringify(this.totalValueChangePercentage));
};

// Metod för att uppdatera aktiernas prestanda.
Portfolio.prototype.updateStocksPerformance = async function () {
    this.realTimePriceArr = []; // Array för att lagra procentuell vinst/förlust för varje aktie.
    var priceChangePercentage; // Variabel för att lagra procentuell vinst/förlust för varje aktie.

    // Iterera över alla aktier.
    for (var i = 0; i < this.stocks.length; i++) {
        var stock = this.stocks[i];

        this.priceClass.setSymbol(stock.symbol); // Koppla rätt aktiesymbol till Price klassen för att hämta realtidspriset.

        // Hämta det senaste realtidspriset.
        var currentPrice = await this.priceClass.getRealTimePrice();

        // Jämför realtidspriset med det initiala priset.
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

        // Spara procentuell vinst/förlust i localStorage.
        localStorage.setItem('realTimePriceArr', JSON.stringify(this.realTimePriceArr));
    }
    this.updatePortfolioValue(); // Anropa metoden för att uppdatera portföljens värde efter att ha uppdaterat aktiernas prestanda.
};

// Metod för att hämta cookies.
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

// Metod för att ta bort andra synliga divar.
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

// Metod för att skapa en tillbaka-knapp för att gå tillbaka till söksidan.
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


// Metod för att visa portföljen.
Portfolio.prototype.showPortfolio = function () {
    // Kontrollera om användaren redan äger aktier och om det finns cookies med aktier.
    var stocksInCookies = this.getCookie('stocks');
    if (this.stocks.length > 0 || (stocksInCookies && JSON.parse(stocksInCookies).length > 0)) {
        if (stocksInCookies) {
            var stocksFromCookies = JSON.parse(stocksInCookies);
            // Slå ihop aktierna från cookies med de befintliga aktierna.
            var mergedStocks = this.stocks.concat(stocksFromCookies);
            // Ta bort dubletter från den sammanslagna arrayen.
            this.stocks = mergedStocks.filter((stock, index, self) =>
                index === self.findIndex((t) => (
                    t.symbol === stock.symbol
                ))
            );
        }

        // Skapa en div för portföljen om den inte redan finns.
        if (!this.portfolioDiv) {
            this.portfolioDiv = document.createElement('div');
            this.portfolioDiv.className = 'portfolioDiv';
            this.removeVisibleDivs();
            this.settings.removePortfolioIcon();
            this.returnBtn(this.portfolioDiv);
        } else {
            this.removeVisibleDivs();
            this.portfolioDiv.innerHTML = '';
            this.settings.removePortfolioIcon();
            this.returnBtn(this.portfolioDiv);
        }

        // Uppdatera totalt investerat och antal aktier
        this.totalInvested = this.stocks.reduce((total, stock) => total + stock.amountInvested, 0);
        this.totalInvested = parseFloat(this.totalInvested.toFixed(2));
        this.numberOfStocks = this.stocks.length;

        this.h2 = document.createElement('h2');
        this.h2.id = 'portfolioHeader';
        this.h2.innerHTML = 'Min Portfölj';
        this.portfolioDiv.appendChild(this.h2);

        // Uppdatera totalt investerat och antal aktier i portföljen. Samt visa procentuell vinst/förlust för varje aktie.
        this.updateStocksPerformance().then(() => {
            this.totalInvestedP = document.createElement('p');
            this.totalInvestedP.textContent = 'Totalt investerat: ' + this.totalInvested + ' USD$ (' + this.totalValueChangePercentage + ' förändring)';
            this.portfolioDiv.appendChild(this.totalInvestedP);

            this.numberOfStocksP = document.createElement('p');
            this.numberOfStocksP.textContent = 'Antal olika aktier: ' + this.numberOfStocks + ' st.';
            this.portfolioDiv.appendChild(this.numberOfStocksP);

            this.stockHolderDiv = document.createElement('div');
            this.stockHolderDiv.id = 'stockHolderDiv';

            // Skapa en div för varje aktie som ägs av användaren. Visa aktiens namn, symbol, procentuell vinst/förlust, investerat belopp och antal aktier. Lägg till en eventlistener för att visa mer information om varje aktie.
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

                    this.infoDiv = document.createElement('div');
                    this.infoDiv.className = 'info1';

                    this.individualStock = document.createElement('p');
                    var fontSize = stock.name.length > 20 ? '0.85rem' : '1rem';
                    this.individualStock.innerHTML = '<b>(' + stock.symbol + ')</b> ' + '<span id="stockNameSpan" style="font-size: ' + fontSize + '">' + stock.name + '</span>';

                    this.infoDiv.appendChild(this.individualStock);
                    this.profitOrLoss = document.createElement('p');
                    this.profitOrLoss.id = 'profitOrLoss';
                    this.profitOrLoss.innerHTML = this.realTimePriceArr[index];

                    this.infoDiv.appendChild(this.profitOrLoss);
                    this.stockDiv.appendChild(this.infoDiv);

                    var detailsDiv = document.createElement('div');
                    detailsDiv.className = 'info2';
                    detailsDiv.style.maxHeight = '0px';

                    this.amountInvested = document.createElement('p');
                    this.amountInvested.innerHTML = 'Investerat: ' + stock.amountInvested.toFixed(2) + ' USD$';
                    detailsDiv.appendChild(this.amountInvested);

                    this.quantity = document.createElement('p');
                    this.quantity.innerHTML = '(' + stock.quantity + ' st.)';
                    detailsDiv.appendChild(this.quantity);

                    this.stockDiv.appendChild(detailsDiv);

                    var isExpanding = false;

                    this.stockDiv.addEventListener('click', () => {
                        if (isExpanding) {
                            detailsDiv.style.transition = 'none';
                            detailsDiv.style.maxHeight = '500px';
                            setTimeout(() => {
                                detailsDiv.style.transition = 'max-height 0.2s ease-in-out';
                                detailsDiv.style.maxHeight = '0px';
                            }, 0);
                            isExpanding = false;
                        } else if (detailsDiv.style.maxHeight !== '0px') {
                            detailsDiv.style.maxHeight = '0px';
                        } else {
                            detailsDiv.style.maxHeight = '500px';
                            isExpanding = true;
                        }
                    });

                    this.stockHolderDiv.appendChild(this.stockDiv);
                });
            });

            this.portfolioDiv.appendChild(this.stockHolderDiv);
            this.parent.appendChild(this.portfolioDiv);
        });
    } else {
        return // Om användaren inte äger några aktier, gör inget.
    }
};

// Metod för att hantera fade-in och fade-out-effekter samt meddelandets synlighet när portföljen är tom.
Portfolio.prototype.manageMessageVisibility = function (container) {
    if (!this.noStockMsg) {
        this.noStockMsg = document.createElement('p');
        this.noStockMsg.id = 'noStockMsg';
        this.noStockMsg.innerHTML = 'Du måste äga aktier innan portföljen kan visas!';

        if (container) {
            container.appendChild(this.noStockMsg);
        }
    }

    // Kontrollera om fadeInAndOut redan körs eller inte.
    if (!this.animationInProgress) {
        this.fadeInAndOut();
    }
};


// Metod för att visa meddelandet om inga aktier med en fade-in och fade-out-effekt.
Portfolio.prototype.fadeInAndOut = function () {
    if (this.animationInProgress) {
        return; // Gör inget om en animation redan pågår.
    }

    this.animationInProgress = true; // Sätter flaggan till true för att indikera att en animation pågår.

    // Trigga en reflow för att starta en ny animation. En reflow är en process där webbläsaren beräknar layouten för elementen på sidan för att uppdatera dem, och därmed starta en ny CSS-animation.
    this.noStockMsg.offsetWidth;
    this.noStockMsg.classList.add('show');

    setTimeout(() => {
        this.noStockMsg.classList.remove('show');
        this.noStockMsg.classList.add('hide');

        setTimeout(() => {
            this.noStockMsg.remove();
            this.noStockMsg = null; // Nollställ referensen till meddelandet.
            this.animationInProgress = false; // Sätt flaggan till false för att indikera att animationen är klar.
        }, 1000); // Vänta 1 sekund innan meddelandet tas bort.
    }, 3000); // Visa meddelandet i 3 sekunder.
};

// Metod för att returnera totalt investerat belopp.
Portfolio.prototype.showInvestedMoney = function () {
    return this.totalInvested;
};

// Metod för att uppdatea totalt investerat belopp. Tar emot en ny aktie som argument för att räkna ut det nya totala investerade beloppet och beräkna värdeförändringen.
Portfolio.prototype.updateBalance = function (newStock) {
    // Läs in saldot från cookien.
    this.balance = parseFloat(document.cookie.replace(/(?:(?:^|.*;\s*)balance\s*\=\s*([^;]*).*$)|^.*$/, "$1"));

    // Om det inte finns någon ny aktie, returnera saldot.
    if (!newStock) {
        return this.balance;
    }

    // Beräkna hur mycket pengar som spenderas på nya aktier.
    var spentOnNewStock = parseFloat(newStock.price * newStock.quantity);

    // Subrahera det spenderade beloppet från saldot.
    this.balance -= spentOnNewStock;

    // Avrunda slutgiltiga saldot till två decimaler.
    this.balance = parseFloat(this.balance.toFixed(2));

    // Spara det nya saldot i en cookie.
    document.cookie = `balance=${this.balance};path=/`;
};

// Metod för att sätta saldot.
Portfolio.prototype.setBalance = function (balance) {
    this.balance = parseFloat(balance);
};

// Metod för att hämta saldot.
Portfolio.prototype.getBalance = function () {
    // Hämta saldot från cookien.
    var balanceFromCookie = parseFloat(this.getCookie('balance'));

    // Om saldot inte är ett nummer från cookien, returnera det nuvarande saldot som inte är sparat i cookien.
    if (isNaN(balanceFromCookie)) {
        return this.balance;
    }

    return balanceFromCookie;
};