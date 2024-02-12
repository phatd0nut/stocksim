function Search(searchValue) {
    var apiKey = new StockMarketAPI()();


    this.searchStocks = function () {
        const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${searchValue}&apikey=${apiKey}`;

        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            // Här kan du hantera den hämtade aktieinformationen
            console.log(data);
            const stockInfo = data['Global Quote'];
            console.log(stockInfo);
            // const stockSymbol = stockInfo['01. symbol'];
            // const stockPrice = stockInfo['05. price'];
        
            // console.log(`Aktiesymbol: ${stockSymbol}`);
            // console.log(`Aktiepris: ${stockPrice}`);
          })
          .catch(error => {
            console.error('Något gick fel:', error);
          });
    }
}
                
    