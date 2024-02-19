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
        // Hämta data från API
        const apiUrl2 = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=full&apikey=${apiKey}`;
        // Deklarera unit som används för att ändra tidsintervall i grafen
        var unit = 'day';

        fetch(apiUrl2)
            .then(response => response.json())
            .then(data => {

                console.log(data);
                /*
                const timeSeriesData = data['Time Series (Daily)'];
                const formattedData = Object.entries(timeSeriesData).map(([date, valueObj]) => {
                    return {
                        x: new Date(date),
                        y: parseFloat(valueObj['4. close'])  // Använd stängningspriset för varje dag
                    };
                });

                // Hämta dagens datum och datumet för en vecka, en månad och ett år sedan
                var today = new Date();
                var oneWeekAgo = new Date();
                oneWeekAgo.setDate(today.getDate() - 7);
                var oneMonthAgo = new Date();
                oneMonthAgo.setMonth(today.getMonth() - 1);
                var oneYearAgo = new Date();
                oneYearAgo.setFullYear(today.getFullYear() - 1);

                // Filtrera formattedData till att endast innehålla data från den senaste veckan, månaden och året
                var lastWeekData = formattedData.filter(item => item.x >= oneWeekAgo);
                var lastMonthData = formattedData.filter(item => item.x >= oneMonthAgo);
                var lastYearData = formattedData.filter(item => item.x >= oneYearAgo);

                // Gruppera lastWeekData, lastMonthData och lastYearData
                var weeklyData = groupBy(lastWeekData, getWeek).flat();
                var monthlyData = groupBy(lastMonthData, getMonth).flat();
                var yearlyData = groupBy(lastYearData, getYear).flat();
                console.log(weeklyData);

                */

                // Skapa diagrammet
                /*
                var ctx = document.getElementById('myChart').getContext('2d');
                var chart = new Chart(ctx, {
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
                            xAxes: [{
                                type: 'time',
                                time: {
                                    unit: 'day',
                                },
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Datum'
                                }
                            }]
                        }
                    }
                });*/

                // Dummy response
                var weeklyDummyData = [
                    { x: new Date('2022-01-01'), y: 100 },
                    { x: new Date('2022-01-02'), y: 105 },
                    { x: new Date('2022-01-03'), y: 102 },
                    { x: new Date('2022-01-04'), y: 99 },
                    { x: new Date('2022-01-05'), y: 101 },
                    { x: new Date('2022-01-06'), y: 98 },
                    { x: new Date('2022-01-07'), y: 97 }
                ];

                var monthlyDummyData = [
                    { x: new Date('2022-01-01'), y: 100 },
                    { x: new Date('2022-02-01'), y: 105 },
                    { x: new Date('2022-03-01'), y: 102 },
                    { x: new Date('2022-04-01'), y: 99 },
                    { x: new Date('2022-05-01'), y: 101 },
                    { x: new Date('2022-06-01'), y: 98 },
                    { x: new Date('2022-07-01'), y: 97 }
                ];

                var yearlyDummyData = [
                    { x: new Date('2022-01-01'), y: 100 },
                    { x: new Date('2023-01-01'), y: 105 },
                    { x: new Date('2024-01-01'), y: 102 },
                    { x: new Date('2025-01-01'), y: 99 },
                    { x: new Date('2026-01-01'), y: 101 },
                    { x: new Date('2027-01-01'), y: 98 },
                    { x: new Date('2028-01-01'), y: 97 }
                ];

                // Använd dummyresponsen istället för att göra ett API-anrop
                var ctx = document.getElementById('myChart').getContext('2d');
                var chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'Veckovis aktiepris',
                            data: weeklyDummyData,
                            borderColor: 'white',  // Linjefärg
                            pointBackgroundColor: '#f9ffae',  // Färg på punkterna
                            pointBorderColor: 'black',  // Färg på punkternas border
                            backgroundColor: 'transparent',  // Fyllning
                            borderWidth: 2,
                            pointRadius: 6,
                            hoverRadius: 6,
                            hidden: false  // Visa detta dataset som standard
                        }, {
                            label: 'Månadsvis aktiepris',
                            data: monthlyDummyData,  // Tomt dataset för nu
                            borderColor: 'white',  // Linjefärg
                            pointBackgroundColor: '#f9ffae',  // Färg på punkterna
                            pointBorderColor: 'black',  // Färg på punkternas border
                            backgroundColor: 'transparent',  // Fyllning
                            borderWidth: 2,
                            pointRadius: 6,
                            hoverRadius: 6,
                            hidden: true  // Dölj detta dataset som standard
                        }, {
                            label: 'Årsvis aktiepris',
                            data: yearlyDummyData,  // Tomt dataset för nu
                            borderColor: 'white',  // Linjefärg
                            pointBackgroundColor: '#f9ffae',  // Färg på punkterna
                            pointBorderColor: 'black',  // Färg på punkternas border
                            backgroundColor: 'transparent',  // Fyllning
                            borderWidth: 2,
                            pointRadius: 6,
                            hoverRadius: 6,
                            hidden: true  // Dölj detta dataset som standard
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

                this.changeTimeUnit = function (unit) {
                    chart.options.scales.xAxes[0].time.unit = unit;  // Ändra tidsenheten
                    chart.update();  // Uppdatera diagrammet med den nya tidsenheten
                }
         
                document.querySelector('.weeklyButton').addEventListener('click', () => {
                    chart.getDatasetMeta(0).hidden = false;  // Visa veckovis data
                    chart.getDatasetMeta(1).hidden = true;  // Dölj månadsvis data
                    chart.getDatasetMeta(2).hidden = true;  // Dölj årsvis data
                    this.changeTimeUnit('day');
                    chart.update();
                });

                document.querySelector('.monthlyButton').addEventListener('click', () => {
                    chart.getDatasetMeta(0).hidden = true;  // Dölj veckovis data
                    chart.getDatasetMeta(1).hidden = false;  // Visa månadsvis data
                    chart.getDatasetMeta(2).hidden = true;  // Dölj årsvis data
                    this.changeTimeUnit('month');
                    chart.update();
                });

                document.querySelector('.yearlyButton').addEventListener('click', () => {
                    chart.getDatasetMeta(0).hidden = true;  // Dölj veckovis data
                    chart.getDatasetMeta(1).hidden = true;  // Dölj månadsvis data
                    chart.getDatasetMeta(2).hidden = false;  // Visa årsvis data
                    this.changeTimeUnit('year');
                    chart.update();
                });

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
