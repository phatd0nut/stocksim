function StockPage(parent, stockPrice, charts, searchClass) {
    this.stockPrice = stockPrice;
    this.charts = charts;
    this.parent = parent;
    this.searchClass = searchClass;

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

    this.prepareChart = function (symbol, apiKey, unit) {
        this.charts.initStockChart(symbol, apiKey, unit);
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
            this.stockPage.style.display = 'none'; // Hide StockPage
            this.searchClass.createBuyDiv(name);

        });
    }
}