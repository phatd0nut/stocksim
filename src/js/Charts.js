function Charts() {
    var mode = document.querySelector('.container').getAttribute('data-mode');
    var myChart;

    this.getSettingsClass = function (settings) {
        this.settings = settings;
    }

    this.listenForModeChange = function () {
        var observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type == "attributes" && mutation.attributeName === 'data-mode') {
                    mode = mutation.target.getAttribute('data-mode');
                    console.log(mode);
                    // Update the colors in the chart
                    this.updateChartColors(mode);
                    // Update the chart
                    if (myChart) {
                        myChart.update();
                    }
                }
            });
        });
    
        // Start observing the target node for configured mutations
        observer.observe(document.querySelector('.container'), { attributes: true });
    }

   this.updateChartColors = function (mode) {
        var color = mode === 'light' ? '#ffffff' : '#f9ffae';
        if (myChart) {
            myChart.data.datasets[0].borderColor = color;
            myChart.data.datasets[0].pointBackgroundColor = color;
            if (myChart.options.scales.xAxes[0]) {
                myChart.options.scales.xAxes[0].ticks.fontColor = color;
            }
            if (myChart.options.scales.yAxes[0]) {
                myChart.options.scales.yAxes[0].ticks.fontColor = color;
            }
        }
    }
    console.log(mode);

    this.stockChartSetters = function (stockPrice, stockPriceP, stockChart) {
        this.stockPrice = stockPrice;
        this.stockPriceP = stockPriceP;
        this.parent = stockChart;

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'myChart';
        this.parent.appendChild(this.canvas);
    }

    this.initStockChart = function (symbol, apiKey, unit) {
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

        this.updatePrice = function () {
            this.stockPrice.getRealTimePrice().then(realTimePrice => {
                if (realTimePrice) {
                    this.stockPriceP.innerHTML = 'Aktuell kurs: <b>' + realTimePrice + '  USD$</b>';
                } else {
                    this.stockPrice.lastClosingPrice().then(closingPrices => {
                        const price = closingPrices.lastClosingPrice;
                        if (price) {
                            this.stockPriceP.innerHTML = 'Aktuell kurs: <b>' + price + '  USD$</b>';
                        } else {
                            this.stockPriceP.innerHTML = 'Kunde inte hämta aktuell kurs.';
                            console.error('Error: both realTimePrice and lastClosingPrice are undefined');
                        }
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
            this.createNewStockChart(unit, historicalData);
        }).catch(function (error) {
            console.error('Error getting historical price:', error);
        });
    }

    this.createNewStockChart = (unit, data) => {
        console.log(mode);
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

        if (myChart instanceof Chart) {
            myChart.destroy();
        }
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Aktiekurs',
                    data: formattedData,
                    borderColor: mode === 'light' ? '#ffffff' : '#f9ffae',  // Linjefärg
                    pointBackgroundColor: mode === 'light' ? '#ffffff' : '#f9ffae',  // Färg på punkterna
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
                            fontColor: mode === 'light' ? '#ffffff' : '#f9ffae',
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
                            fontColor: mode === 'light' ? '#ffffff' : '#f9ffae',
                            drawOnChartArea: false,  // Dölj tick marks på y-axeln
                        }
                    }]
                }
            }
        });
    };
}