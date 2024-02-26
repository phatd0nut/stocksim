function StockPrice() {
}

StockPrice.prototype.getRealTimePrice = function () {
    var realTimePriceUrl = 'https://financialmodelingprep.com/api/v3/stock/real-time-price/' + this.symbol + '?apikey=' + this.apiKey;
    return fetch(realTimePriceUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (!data.companiesPriceList || data.companiesPriceList.length === 0) {
                throw new Error('Price data is not available');
            }

            var priceData = data.companiesPriceList[0];

            return priceData.price;
        })
        .catch(function (error) {
            // Handle error
            console.error(error);
        });
}

StockPrice.prototype.getHistoricalData = function () {
    var priceApiUrl = 'https://financialmodelingprep.com/api/v3/historical-price-full/' + this.symbol + '?from=' + this.startDateStr + '&to=' + new Date().toISOString().split('T')[0] + '&apikey=' + this.apiKey;
    return fetch(priceApiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (!data.historical) {
                throw new Error('No historical data returned by the API');
            }
            return data.historical;
        });
};

StockPrice.prototype.lastClosingPrice = function () {
    var priceApiUrl2 = 'https://financialmodelingprep.com/api/v3/historical-price-full/' + this.symbol + '?from=' + this.startDateStr + '&to=' + new Date().toISOString().split('T')[0] + '&apikey=' + this.apiKey;

    return fetch(priceApiUrl2)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (!data.historical) {
                throw new Error('No historical data available for this stock');
            }

            var todaysDate = new Date().toISOString().split('T')[0];
            var todaysData = data.historical.find(function (item) {
                return item.date === todaysDate;
            });

            var daysAgo = 1;
            var lastClosingPriceData;

            while (!lastClosingPriceData && daysAgo <= data.historical.length) {
                var date = new Date(Date.now() - 864e5 * daysAgo).toISOString().split('T')[0];
                var dataForDate = data.historical.find(function (item) {
                    return item.date === date;
                });
                if (dataForDate && dataForDate.close !== 'N/A') {
                    lastClosingPriceData = dataForDate;
                }
                daysAgo++;
            }

            if (!todaysData && !lastClosingPriceData) {
                throw new Error('No data available for the specified dates');
            }

            var todaysClosingPrice = todaysData ? todaysData.close : 'N/A';
            var lastClosingPrice = lastClosingPriceData ? lastClosingPriceData.close : 'N/A';

            return {
                todaysClosingPrice: todaysClosingPrice,
                lastClosingPrice: lastClosingPrice,
            };
        });
}

//Priskontroll (metod för debugging)
StockPrice.prototype.logPrices = function () {
    var self = this;
    this.getRealTimePrice().then(function (realTimePrice) {
        console.log('Realtidspriset:', realTimePrice);
        self.lastClosingPrice().then(function (closingPrices) {
            console.log('Dagens Stängning:', closingPrices.todaysClosingPrice);
            console.log('Senaste stängning:', closingPrices.lastClosingPrice);
        });
    });
};

StockPrice.prototype.setSymbol = function (symbol) {
    this.symbol = symbol;
};

StockPrice.prototype.setApiKey = function (apiKey) {
    this.apiKey = apiKey;
};

StockPrice.prototype.setStartDate = function (startDateStr) {
    this.startDateStr = startDateStr;
};

