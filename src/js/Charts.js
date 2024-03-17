// Klass som skapar grafer för aktiekurser. Använder Chart.js för att skapa graferna som är en extern modul.
function Charts() {
    var mode = document.querySelector('.container').getAttribute('data-mode'); // Hämta vilket tema som används.
    var myChart; // Variabel för att hålla chart.js objektet.

    // Metod för att hämta settings-klassen från StockApp.js.
    this.getSettingsClass = function (settings) {
        this.settings = settings;
    }

    // Metod för att lyssna efter ändringar i vilket tema som används.
    this.listenForModeChange = function () {
        var observer = new MutationObserver((mutations) => { // Skapa en ny observer för att lyssna efter ändringar i DOM:en.
            mutations.forEach((mutation) => {
                if (mutation.type == "attributes" && mutation.attributeName === 'data-mode') {
                    mode = mutation.target.getAttribute('data-mode');
                    this.updateChartColors(mode); // Uppdatera färgerna på graferna.
                    if (myChart) { // Uppdatera graferna om de redan finns. 
                        myChart.update();
                    }
                }
            });
        });

        // Starta observern och lyssna efter ändringar i data-mode attributet.
        observer.observe(document.querySelector('.container'), { attributes: true });
    }

    // Metod för att uppdatera färgerna på graferna.
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

    // Metod för att sätta inställningar för graf-klassen. Sätter referenser för aktiekursen, elementet där kursen ska skrivas ut och parent elementet som grafen ska appendas till. Denna metod visar rätt pris mot rätt aktie.
    this.stockChartSetters = function (stockPrice, stockPriceP, stockChart) {
        this.stockPrice = stockPrice;
        this.stockPriceP = stockPriceP;
        this.parent = stockChart;

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'myChart';
        this.parent.appendChild(this.canvas);
    }

    // Metod för att initiera grafen. Hämtar historiska priser för en aktie och skapar en graf med hjälp av Chart.js. Har olika tidsintervall för att visa prisinformation för olika tidsperioder. Tar emot symbol för aktien, api-nyckel och tidsintervall som argument.
    this.initStockChart = function (symbol, apiKey, unit) {
        this.symbol = symbol;
        this.apiKey = apiKey;

        var startDate = new Date(); // Hämta dagens datum. Används för att sätta startdatum för historiska priser.

        // Sätt startdatum beroende på vilket tidsintervall som valts.
        if (unit === 'week') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (unit === 'month') {
            startDate.setDate(startDate.getDate() - 31);
        } else if (unit === 'year') {
            startDate.setFullYear(startDate.getFullYear() - 1);
        }

        this.startDateStr = startDate.toISOString().split('T')[0]; // Gör om startdatumet till en sträng.
        this.stockPrice.setStartDate(this.startDateStr); // Sätt startdatumet i stockPrice klassen.

        // Metod för att hämta historiska priser för och uppdatera pris-elementet.
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
        this.updatePrice(); // Uppdatera priset direkt när grafen skapas.

        this.stockPrice.getHistoricalData(this.startDateStr).then((historicalData) => {
            if (!historicalData) {
                console.error('Ingen historisk prisinformation finns tillgänglig.', historicalData);
                return;
            }
            this.createNewStockChart(unit, historicalData);
        }).catch(function (error) {
            console.error('Fel vid hämtning av historiskt pris:', error);
        });
    }

    // Metod för att skapa en ny graf med hjälp av Chart.js. Tar emot tidsintervall och historisk prisinformation som argument.
    this.createNewStockChart = (unit, data) => {
        var formattedData = data.map(dataPoint => ({
            x: dataPoint.date,
            y: dataPoint.close,
        }));

        // Om unit är 'year', aggregera data till månadsvisa punkter.
        if (unit === 'year') {
            const aggregatedData = {};
            formattedData.forEach(dataPoint => {
                const month = dataPoint.x.slice(0, 7);  // Hämta året och månaden.
                if (!aggregatedData[month]) {
                    aggregatedData[month] = dataPoint.y;  // Spara priset för den första dagen i månaden.
                }
            });
            formattedData = Object.entries(aggregatedData).map(([month, value]) => ({
                x: `${month}-01`,  // Lägg till "-01" till månaden.
                y: value,
            }));
        }

        var canvas = document.getElementById('myChart'); // Hämta canvas elementet där grafen ska appendas.
        var ctx = canvas.getContext('2d'); // Hämta context för canvas elementet. Används för att rita grafen.

        if (myChart instanceof Chart) { // Om det redan finns en graf, ta bort den.
            myChart.destroy(); // Förstör den gamla grafen.
        }

        // Skapa en ny graf med hjälp av Chart.js. Här sätts inställningar för grafens utseende.
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Aktiekurs',
                    data: formattedData, // Prisinformationen som ska visas i grafen.
                    borderColor: mode === 'light' ? '#ffffff' : '#f9ffae',  // Linjefärg.
                    pointBackgroundColor: mode === 'light' ? '#ffffff' : '#f9ffae',  // Färg på punkterna.
                    pointBorderColor: 'black',  // Färg på punkternas border.
                    backgroundColor: 'transparent',  // Fyllning.
                    borderWidth: 2, // Linjebredd.
                    pointRadius: 6, // Storlek på punkterna.
                    hoverRadius: 6, // Storlek på punkterna när användaren hovrar över dem.
                }]
            },
            options: {
                legend: {
                    display: false,  // Dölj legenderna.
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false,  // Dölj grid lines på x-axeln.
                        },
                        ticks: {
                            fontColor: mode === 'light' ? '#ffffff' : '#f9ffae', // Färg på texten på x-axeln.
                        },
                        type: 'time', // Sätt x-axeln till att visa tid.
                        distribution: 'series',  // Fördela punkterna jämnt över x-axeln.
                        time: {
                            unit: unit === 'year' ? 'month' : 'day', // Sätt tidsintervall för x-axeln.
                            stepSize: unit === 'year' ? 1 : undefined, // Sätt steglängd för x-axeln.
                        },
                        display: true, // Visa x-axeln.
                    }],
                    yAxes: [{
                        gridLines: {
                            color: 'rgba(0, 0, 0, 0)',  // Dölj grid lines.
                        },
                        ticks: {
                            fontColor: mode === 'light' ? '#ffffff' : '#f9ffae', // Färg på texten på y-axeln.
                            drawOnChartArea: false,  // Dölj tick marks på y-axeln.
                        }
                    }]
                }
            }
        });
    };
}