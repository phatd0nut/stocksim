function StockPage(parent, stockPrice, charts, searchClass, settings, portfolio) {
    this.stockPrice = stockPrice;
    this.charts = charts;
    this.parent = parent;
    this.searchClass = searchClass;
    this.settings = settings;
    this.portfolio = portfolio;

    this.createStockPage = function (name) {
        this.stockPage = document.createElement('div');
        this.stockPage.className = 'stockPage';
        parent.appendChild(this.stockPage);

        this.h2 = document.createElement('h2');
        this.h2.innerHTML = name;
        this.h2.className = 'h2stock';
        this.stockPage.appendChild(this.h2);

        this.stockInfo = document.createElement('div');
        this.stockInfo.className = 'stockInfo';
        this.stockPage.appendChild(this.stockInfo);

        this.stockPriceP = document.createElement('p');
        this.stockPriceP.className = 'stockPrice';
        this.stockInfo.appendChild(this.stockPriceP);

        this.stockChart = document.createElement('div');
        this.stockChart.className = 'stockChart';
        this.stockInfo.appendChild(this.stockChart);

        this.charts.stockChartSetters(this.stockPrice, this.stockPriceP, this.stockChart);
        this.stockBtns(name);
    }

    // Kollar om aktien finns i portföljen och skapar en div för att visa aktier som ägs av användaren.
    this.checkIfStockExistsInPortfolio = function (symbol) {
        this.ownedStocks = this.searchClass.portfolio.getOwnedStocks();
        this.isOwned = this.ownedStocks.some(stock => stock.symbol === symbol);

        if (this.stockPage) {
            // Check if the ownedStocksDiv already exists
            if (!this.ownedStocksDiv) {
                console.log('Creating ownedStocksDiv');
                this.ownedStocksDiv = document.createElement('div');
                this.ownedStocksDiv.id = 'ownedStocks';
                this.stockPage.appendChild(this.ownedStocksDiv);

                this.ownedStocksHeader = document.createElement('h3');
                this.ownedStocksHeader.innerHTML = 'Äger aktier: <span id="ownedStocksInfo"></span>';
                this.ownedStocksDiv.appendChild(this.ownedStocksHeader);
            }

            // Update owned stocks content or clear it if not owned
            const ownedStocksInfo = document.getElementById('ownedStocksInfo');
            if (this.isOwned) {
                // Find the first stock with the specified symbol
                const ownedStock = this.ownedStocks.find(stock => stock.symbol === symbol);

                if (ownedStock) {
                    // If owned, display the quantity and amountInvested of the first matching stock
                    ownedStocksInfo.innerHTML = `${ownedStock.quantity} st. (${ownedStock.amountInvested.toFixed(2)} USD$)`;
                } else {
                    // If not owned, display a default message
                    ownedStocksInfo.innerHTML = 'Inga.';
                }
            } else {
                // If not owned, display a default message
                ownedStocksInfo.innerHTML = 'Inga.';
            }
        }
    }

    // Funktion för att förbereda aktiekursdiagrammet för att visa det på aktiesidan och kontrollera om aktien finns i portföljen.
    this.prepareChart = function (symbol, apiKey, unit) {
        this.charts.initStockChart(symbol, apiKey, unit);
        this.checkIfStockExistsInPortfolio(symbol);
    }

    this.stockBtns = function (name) {
        this.changeTimeFrameDiv = document.createElement('div');
        this.changeTimeFrameDiv.className = 'changeTimeFrameDiv';
        this.stockPage.appendChild(this.changeTimeFrameDiv);

        this.weeklyButton = document.createElement('button');
        this.monthlyButton = document.createElement('button');
        this.yearlyButton = document.createElement('button');

        this.weeklyButton.className = 'buttons weeklyButton';
        this.weeklyButton.innerText = 'Vecka';
        this.monthlyButton.className = 'buttons monthlyButton';
        this.monthlyButton.innerText = 'Månad';
        this.yearlyButton.className = 'buttons yearlyButton';
        this.yearlyButton.innerText = 'År';

        this.changeTimeFrameDiv.appendChild(this.weeklyButton);
        this.changeTimeFrameDiv.appendChild(this.monthlyButton);
        this.changeTimeFrameDiv.appendChild(this.yearlyButton);

        // Lyssna på klick på knappar för att ändra tidsintervall
        this.weeklyButton.addEventListener('click', () => {
            this.prepareChart(this.symbol, this.apiKey, 'week');
        });

        this.monthlyButton.addEventListener('click', () => {
            this.prepareChart(this.symbol, this.apiKey, 'month');
        });

        this.yearlyButton.addEventListener('click', () => {
            this.prepareChart(this.symbol, this.apiKey, 'year');
        });

        this.buyStockButton = document.createElement('button');
        this.buyStockButton.innerHTML = 'Köp aktie';
        this.buyStockButton.className = 'buttons stockPageBuyButton';
        this.stockPage.appendChild(this.buyStockButton);

        this.buyStockButton.addEventListener('click', () => {
            console.log('Buy stock button clicked');
            this.stockPage.style.display = 'none'; // Hide StockPage
            this.searchClass.createBuyDiv(name);
        });

        // Skapar en portföljikon och lägger till den på aktiesidan
        this.settings.addPortfolioIcon(this.stockPage);
        this.portfolioIconDiv = document.getElementById('portfolioIconDiv');

        // Lyssnar på klickhändelsen för att visa portföljen när användaren klickar på portföljikonen.
        this.portfolioIconDiv.addEventListener('click', () => {
            this.portfolio.showPortfolio(this.stockPage);
        });

    }
}