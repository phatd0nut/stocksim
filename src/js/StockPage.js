function StockPage(parent) {
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

        this.stockPrice = document.createElement('p');
        this.stockPrice.innerHTML = 'Dagens Kurs: <b>100:-</b>';
        this.stockPrice.className = 'stockPrice';
        this.stockInfo.appendChild(this.stockPrice);

        this.stockChart = document.createElement('div');
        this.stockChart.className = 'stockChart';
        this.stockInfo.appendChild(this.stockChart);

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'myChart';
        this.stockChart.appendChild(this.canvas);
        this.stockBtns();
    }

    this.createChart = function (ticker, apiKey) {
        var unit = 'week';

        const createNewChart = (unit) => {
            // Beräkna startdatum baserat på tidsramen
            let startDate = new Date();
            let startDateStr;
            if (unit === 'week') {
                startDate.setDate(startDate.getDate() - 7);
            } else if (unit === 'month') {
                startDate.setDate(startDate.getDate() - 31);
            } else if (unit === 'year') {
                startDate.setFullYear(startDate.getFullYear() - 1);
            }

            // Formatera startdatumet till YYYY-MM-DD format
            startDateStr = startDate.toISOString().split('T')[0];

            // Hämta data från API
            const apiUrl2 = `https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?from=${startDateStr}&to=${new Date().toISOString().split('T')[0]}&apikey=${apiKey}`;

            fetch(apiUrl2)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    var formattedData = data.historical.map(item => ({
                        x: item.date,
                        y: item.close,
                    }));
                    var canvas = document.getElementById('myChart');
                    var ctx = canvas.getContext('2d');

                    if (myChart) {
                        myChart.destroy();
                    }

                    var myChart = new Chart(ctx, {
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
                                    time: {
                                        unit: unit,
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
                });
        }

        // Skapa den ursprungliga grafen
        createNewChart(unit);

        // Lyssna på klick på knappar för att ändra tidsintervall
        this.weeklyButton.addEventListener('click', () => {
            createNewChart('week');
        });

        this.monthlyButton.addEventListener('click', () => {
            createNewChart('month');
        });

        this.yearlyButton.addEventListener('click', () => {
            createNewChart('year');
        });
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

        this.buyStockButton = document.createElement('button');
        this.buyStockButton.innerHTML = 'Köp aktie';
        this.buyStockButton.className = 'buttons stockPageBuyButton';
        this.stockPage.appendChild(this.buyStockButton);
        this.buyStockButton.addEventListener('click', () => {
        });
    }
}