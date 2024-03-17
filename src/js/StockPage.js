// Klass som skapar sidan för en specifik aktie. Tar emot en förälder, en instans av StockPrice, en instans av Settings, och en instans av Search som argument.
function StockPage(parent, stockPrice, settings, searchClass) {
    this.searchClass = searchClass;
    this.stockPrice = stockPrice;
    this.parent = parent;
    this.settings = settings;
    this.name = null; // Referens till aktiens namn. Sätts när aktiesidan skapas.
    this.symbol = null; // Referens till aktiens symbol. Sätts när aktiesidan skapas.
    this.apiKey = null; // Referens till aktiens API-nyckel. Sätts när aktiesidan skapas.

    // Metod för att sätta en instans av Charts i StockPage.
    this.setCharts = function (charts) {
        this.charts = charts;
    }

    // Metod för att sätta en instans av Portfolio i StockPage.
    this.setPortfolio = function (portfolio) {
        this.portfolio = portfolio;
    }

    // Metod som renderar aktiesidan. Tar emot namn och symbol för aktien som argument.
    this.createStockPage = function (name, symbol) {
        this.name = name;
        this.symbol = symbol;

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

        this.settingsIcon = document.getElementById('settingsIcon');
        this.settingsIcon.remove();
        this.portfolioIconDiv = document.getElementById('portfolioIconDiv');
        this.settingsHolder = document.getElementById('settingsHolder');
        this.goBackToSearch = document.createElement('img');
        this.goBackToSearch.id = 'goBackToSearch';
        if (document.querySelector('.container[data-mode="dark"]')) {
            this.goBackToSearch.src = '../src/img/go_back_2.png';
        } else {
            this.goBackToSearch.src = '../src/img/go_back_1.png';
        }

        this.goBackToSearch.addEventListener('click', () => {
            this.goBackToSearch.remove();
            this.stockPage.remove();
            this.searchClass.createSearchBox();
        });
        this.settingsHolder.insertBefore(this.goBackToSearch, this.portfolioIconDiv);

        this.portfolioIconDiv.addEventListener('click', () => {
            this.goBackToSearch.remove();
            this.settings.initIcons();
            this.settings.removePortfolioIcon();
        });

        this.charts.stockChartSetters(this.stockPrice, this.stockPriceP, this.stockChart);
        this.stockBtns(name, symbol);
    }

    // Kollar om aktien finns i portföljen och skapar en div för att visa aktier som ägs av användaren.
    this.checkIfStockExistsInPortfolio = function (symbol) {
        this.portfolio = this.getPortfolio();
        this.ownedStocks = this.portfolio.getOwnedStocks();
        this.isOwned = this.ownedStocks.some(stock => stock.symbol === symbol);

        if (this.stockPage) { // Kontrollera om aktiesidan finns i DOM:en innan du fortsätter.
            if (this.ownedStocksDiv) { // Om ownedStocksDiv redan finns, ta bort det.
                this.ownedStocksDiv.remove();
            }

            // Skapa en div för att visa aktier som ägs av användaren.
            this.ownedStocksDiv = document.createElement('div');
            this.ownedStocksDiv.id = 'ownedStocks';
            this.stockPage.appendChild(this.ownedStocksDiv);

            this.ownedStocksHeader = document.createElement('h3');
            this.ownedStocksHeader.innerHTML = 'Äger aktier: <span id="ownedStocksInfo"></span>';
            this.ownedStocksDiv.appendChild(this.ownedStocksHeader);

            // Uppdatera ownedStocksInfo med information om hur många aktier som ägs av användaren.
            var ownedStocksInfo = document.getElementById('ownedStocksInfo');
            if (ownedStocksInfo) {
                if (this.isOwned) {
                    // Hitta aktien i portföljen och hämta information om antal och investerat belopp.
                    var ownedStock = this.ownedStocks.find(stock => stock.symbol === symbol);

                    if (ownedStock) {
                        ownedStocksInfo.innerHTML = `${ownedStock.quantity} st. (${ownedStock.amountInvested.toFixed(2)} USD$)`;
                    } else {
                        // Om aktien inte finns i portföljen, visa ett standardmeddelande.
                        ownedStocksInfo.innerHTML = 'Inga.';
                    }
                } else {
                    ownedStocksInfo.innerHTML = 'Inga.';
                }
            }
        }
    }

    // Funktion för att förbereda aktiegrafen för att visa det på aktiesidan och kontrollera om aktien finns i portföljen.
    this.prepareChart = function (symbol, apiKey, unit) {
        this.apiKey = apiKey;
        this.charts.initStockChart(symbol, apiKey, unit);
        this.checkIfStockExistsInPortfolio(symbol);
    }

    // Funktion för att skapa knappar för att ändra tidsintervall och köpa aktier.
    this.stockBtns = function (name, symbol) {
        this.changeTimeFrameDiv = document.createElement('div');
        this.changeTimeFrameDiv.className = 'changeTimeFrameDiv';
        this.stockPage.appendChild(this.changeTimeFrameDiv);

        this.weeklyButton = document.createElement('button');
        this.monthlyButton = document.createElement('button');
        this.yearlyButton = document.createElement('button');

        this.weeklyButton.className = 'buttons weeklyButton';
        this.weeklyButton.innerHTML = 'Vecka';
        this.monthlyButton.className = 'buttons monthlyButton';
        this.monthlyButton.innerHTML = 'Månad';
        this.yearlyButton.className = 'buttons yearlyButton';
        this.yearlyButton.innerHTML = 'År';

        this.changeTimeFrameDiv.appendChild(this.weeklyButton);
        this.changeTimeFrameDiv.appendChild(this.monthlyButton);
        this.changeTimeFrameDiv.appendChild(this.yearlyButton);

        // Lyssna på klick på knapparna för tidsramen för att ändra tidsintervall
        this.weeklyButton.addEventListener('click', () => {
            this.prepareChart(this.symbol, this.apiKey, 'week');
            this.weeklyButton.classList.add('active');
            this.monthlyButton.classList.remove('active');
            this.yearlyButton.classList.remove('active');
        });

        this.monthlyButton.addEventListener('click', () => {
            this.prepareChart(this.symbol, this.apiKey, 'month');
            this.monthlyButton.classList.add('active');
            this.weeklyButton.classList.remove('active');
            this.yearlyButton.classList.remove('active');
        });

        this.yearlyButton.addEventListener('click', () => {
            this.prepareChart(this.symbol, this.apiKey, 'year');
            this.yearlyButton.classList.add('active');
            this.weeklyButton.classList.remove('active');
            this.monthlyButton.classList.remove('active');
        });

        // Sätter veckoknappen som aktiv som standard.
        this.weeklyButton.classList.add('active');

        this.buyStockButton = document.createElement('button');
        this.buyStockButton.innerHTML = 'Köp aktie';
        this.buyStockButton.className = 'buttons stockPageBuyButton';
        this.stockPage.appendChild(this.buyStockButton);

        this.buyStockButton.addEventListener('click', () => {
            console.log(this.searchClass);
            this.stockPage.style.display = 'none'; // Hide StockPage
            this.searchClass.createBuyDiv(name, symbol);
        });
    }

    // Metod för att returnera instansen av Charts.
    this.getCharts = function () {
        return this.charts;
    }

    // Metod för att returnera instansen av Portfolio.
    this.getPortfolio = function () {
        return this.portfolio;
    }

    // Metod för att returnera instansen av Search.
    this.getSearchClass = function () {
        return this.searchClass;
    }
}