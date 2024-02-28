function StockPage(parent, stockPrice, charts) {
    this.stockPrice = stockPrice;
    this.charts = charts;
    this.parent = parent;

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
        this.stockBtns();
    }

    this.prepareChart = function (symbol, apiKey, unit) {
        this.charts.initStockChart(symbol, apiKey, unit);
    }

    this.stockBtns = function () {
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
            var quantity = /* get quantity from user input */
                portfolio.buyStock(currentStock, quantity);
        });
    }
}


/*
 this.prepareChart = function (symbol, apiKey, unit) {
        this.symbol = symbol;
        this.apiKey = apiKey;

        // Calculate start date based on the timeframe
        var startDate = new Date();

        if (unit === 'week') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (unit === 'month') {
            startDate.setDate(startDate.getDate() - 31);
        } else if (unit === 'year') {
            startDate.setFullYear(startDate.getFullYear() - 1);
        }

        this.startDateStr = startDate.toISOString().split('T')[0];
        this.stockPrice.setStartDate(this.startDateStr);

        this.updatePrice = function() {
            this.stockPrice.getRealTimePrice().then(realTimePrice => {
                if (realTimePrice) {
                    this.stockPriceP.innerHTML = 'Aktuell kurs: <b>' + realTimePrice + ':-</b>';
                } else {
                    this.stockPrice.lastClosingPrice().then(closingPrices => {
                        // Use either todaysClosingPrice or lastClosingPrice
                        this.stockPriceP.innerHTML = 'Aktuell kurs: <b>' + (closingPrices.todaysClosingPrice !== 'N/A' ? closingPrices.todaysClosingPrice : closingPrices.lastClosingPrice) + ':-</b>';
                    });
                }
            });
        }

        this.updatePrice();

        this.stockPrice.getHistoricalData(this.startDateStr).then((historicalData) => {
            if (!historicalData) {
                console.error('historicalData is undefined', historicalData);
                return;
            }
            this.createNewChart(unit, historicalData);
        }).catch(function (error) {
            console.error('Error getting historical price:', error);
        });
    }

    this.createNewChart = (unit, data) => {
        var formattedData = data.map(dataPoint => ({
            x: dataPoint.date,
            y: dataPoint.close,
        }));

        // Om unit är 'year', aggregera data till månadsvisa punkter
        if (unit === 'year') {
            const aggregatedData = {};
            formattedData.forEach(dataPoint => {
                const month = dataPoint.x.slice(0, 7);  // Hämta året och månaden
                if (!aggregatedData[month]) {
                    aggregatedData[month] = dataPoint.y;  // Spara priset för den första dagen i månaden
                }
            });
            formattedData = Object.entries(aggregatedData).map(([month, value]) => ({
                x: `${month}-01`,  // Lägg till "-01" till månaden
                y: value,
            }));
        }

        var canvas = document.getElementById('myChart');
        var ctx = canvas.getContext('2d');

        if (this.myChart instanceof Chart) {
            this.myChart.destroy();
        }
        this.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Aktiekurs',
                    data: formattedData,
                    borderColor: 'white',  // Linjefärg
                    pointBackgroundColor: '#f9ffae',  // Färg på punkterna
                    pointBorderColor: 'black',  // Färg på punkternas border
                    backgroundColor: 'transparent',  // Fyllning
                    borderWidth: 2,
                    pointRadius: 6,
                    hoverRadius: 6,
                }]
            },
            options: {
                legend: {
                    display: false,  // Dölj legenderna
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false,  // Dölj grid lines på x-axeln
                        },
                        ticks: {
                            fontColor: '#f9ffae',  // Svart text
                        },
                        type: 'time',
                        distribution: 'series',  // Add this line
                        time: {
                            unit: unit === 'year' ? 'month' : 'day',
                            stepSize: unit === 'year' ? 1 : undefined,
                        },
                        display: true,
                    }],
                    yAxes: [{
                        gridLines: {
                            color: 'rgba(0, 0, 0, 0)',  // Dölj grid lines
                        },
                        ticks: {
                            fontColor: '#f9ffae',  // Svart text
                            drawOnChartArea: false,  // Dölj tick marks på y-axeln
                        }
                    }]
                }
            }
        });
    };
    */