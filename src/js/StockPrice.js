function StockPrice() {
    // Klass för att hämta prisdata för en aktie från Financial Modeling Prep API.
}

// Metod för att hämta realtidspriset för en aktie.
StockPrice.prototype.getRealTimePrice = function () {
    var realTimePriceUrl = 'https://financialmodelingprep.com/api/v3/stock/real-time-price/' + this.symbol + '?apikey=' + this.apiKey;
    return fetch(realTimePriceUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (!data.companiesPriceList || data.companiesPriceList.length === 0) {
                throw new Error('Realtidsprisdata finns inte tillgänglig för denna aktie');
            }
            var priceData = data.companiesPriceList[0];
            return priceData.price;
        })
        .catch(function (error) {
            console.error(error);
        });
}

// Metod för att hämta historisk prisdata för en aktie.
StockPrice.prototype.getHistoricalData = function () {
    var priceApiUrl = 'https://financialmodelingprep.com/api/v3/historical-price-full/' + this.symbol + '?from=' + this.startDateStr + '&to=' + new Date().toISOString().split('T')[0] + '&apikey=' + this.apiKey;
    return fetch(priceApiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (!data.historical) {
                throw new Error('Ingen historisk prisinformation finns tillgänglig för denna aktie');
            }
            return data.historical;
        });
};

// Metod för att hämta det senaste stängningspriset för en aktie.
StockPrice.prototype.lastClosingPrice = function () {
    var fiveDaysAgo = new Date(Date.now() - 864e5 * 5).toISOString().split('T')[0];
    var priceApiUrl2 = 'https://financialmodelingprep.com/api/v3/historical-price-full/' + this.symbol + '?from=' + fiveDaysAgo + '&to=' + new Date().toISOString().split('T')[0] + '&apikey=' + this.apiKey;

    return fetch(priceApiUrl2)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (!data.historical) {
                throw new Error('Ingen historisk prisinformation finns tillgänglig för denna aktie');
            }

            var lastClosingPriceData = data.historical.find(function (item) {
                return item.close !== 'N/A';
            });

            if (!lastClosingPriceData) {
                throw new Error('Ingen data för stängningspris finns tillgänglig för denna aktie');
            }

            var lastClosingPrice = lastClosingPriceData.close;

            return {
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

// Metod för att sätta symbol för aktien.
StockPrice.prototype.setSymbol = function (symbol) {
    this.symbol = symbol;
};

// Metod för att sätta API-nyckel för att använda i klassen.
StockPrice.prototype.setApiKey = function (apiKey) {
    this.apiKey = apiKey;
};

// Metod för att sätta startdatum för historiska priser.
StockPrice.prototype.setStartDate = function (startDateStr) {
    this.startDateStr = startDateStr;
};

