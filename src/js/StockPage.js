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
        this.stockPrice.innerHTML = 'Aktuell kurs: <b>100:-</b>';
        this.stockPrice.className = 'stockPrice';
        this.stockInfo.appendChild(this.stockPrice);

        this.stockChart = document.createElement('div');
        this.stockChart.className = 'stockChart';
        this.stockInfo.appendChild(this.stockChart);

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'myChart';
        this.stockChart.appendChild(this.canvas);

        this.buyStockButton = document.createElement('button');
        this.buyStockButton.innerHTML = 'Köp aktie';
        this.buyStockButton.className = 'buyStockButton';
        this.stockPage.appendChild(this.buyStockButton);
        this.buyStockButton.addEventListener('click', () => {
            this.buyStockFunc(stock);
        });
    }

    this.createChart = function (ticker, apiKey) {
        this.changeTimeFrameDiv = document.createElement('div');
        this.changeTimeFrameDiv.className = 'changeTimeFrameDiv';
        this.stockPage.appendChild(this.changeTimeFrameDiv);

        this.weeklyButton = document.createElement('button');
        this.monthlyButton = document.createElement('button');
        this.yearlyButton = document.createElement('button');

        this.weeklyButton.className = 'buttons weeklyButton';
        this.weeklyButton.innerText = 'Visa veckovis data';
        this.monthlyButton.className = 'buttons monthlyButton';
        this.monthlyButton.innerText = 'Visa månadsvis data';
        this.yearlyButton.className = 'buttons yearlyButton';
        this.yearlyButton.innerText = 'Visa årsvis data';

        this.changeTimeFrameDiv.appendChild(this.weeklyButton);
        this.changeTimeFrameDiv.appendChild(this.monthlyButton);
        this.changeTimeFrameDiv.appendChild(this.yearlyButton);

        // Hämta data från API
        const apiUrl2 = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=full&apikey=${apiKey}`;

        fetch(apiUrl2)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const timeSeriesData = data['Time Series (Daily)'];
                const formattedData = Object.entries(timeSeriesData).map(([date, valueObj]) => {
                    return {
                        x: new Date(date),
                        y: parseFloat(valueObj['4. close'])  // Använd stängningspriset för varje dag
                    };
                });

                // Gruppera data efter vecka, månad och år
                const weeklyData = groupBy(formattedData, getWeek);
                const monthlyData = groupBy(formattedData, getMonth);
                const yearlyData = groupBy(formattedData, getYear);

                // Skapa diagrammet
                let ctx = document.getElementById('myChart').getContext('2d');
                let chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'Veckovis aktiepris',
                            data: weeklyData,
                            hidden: false  // Visa detta dataset som standard
                        }, {
                            label: 'Månadsvis aktiepris',
                            data: monthlyData,
                            hidden: true  // Dölj detta dataset som standard
                        }, {
                            label: 'Årsvis aktiepris',
                            data: yearlyData,
                            hidden: true  // Dölj detta dataset som standard
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    unit: 'month'
                                }
                            }
                        }
                    }
                });
            });

        // Lägg till knappar för att växla mellan veckovis, månadsvis och årsvis data
        document.querySelector('.weeklyButton').addEventListener('click', () => {
            chart.getDatasetMeta(0).hidden = false;  // Visa veckovis data
            chart.getDatasetMeta(1).hidden = true;  // Dölj månadsvis data
            chart.getDatasetMeta(2).hidden = true;  // Dölj årsvis data
            chart.update();
        });

        document.querySelector('.monthlyButton').addEventListener('click', () => {
            chart.getDatasetMeta(0).hidden = true;  // Dölj veckovis data
            chart.getDatasetMeta(1).hidden = false;  // Visa månadsvis data
            chart.getDatasetMeta(2).hidden = true;  // Dölj årsvis data
            chart.update();
        });

        document.querySelector('.yearlyButton').addEventListener('click', () => {
            chart.getDatasetMeta(0).hidden = true;  // Dölj veckovis data
            chart.getDatasetMeta(1).hidden = true;  // Dölj månadsvis data
            chart.getDatasetMeta(2).hidden = false;  // Visa årsvis data
            chart.update();
        });

        // Hjälpfunktioner för att formatera datum
        function getWeek(date) {
            var onejan = new Date(date.getFullYear(), 0, 1);
            return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        }

        function getMonth(date) {
            return date.getMonth() + 1;
        }

        function getYear(date) {
            return date.getFullYear();
        }

        // Hjälpfunktion för att gruppera data
        function groupBy(array, keyGetter) {
            const map = new Map();
            array.forEach((item) => {
                const key = keyGetter(item.x);
                const collection = map.get(key);
                if (!collection) {
                    map.set(key, [item]);
                } else {
                    collection.push(item);
                }
            });
            return Array.from(map.values());
        }
    }

    this.buyStockFunc = function (stock) {
        console.log('Buying stock', stock);
    }
}
