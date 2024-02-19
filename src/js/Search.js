function Search() {
  var apiKey = new StockMarketAPI()();
  var parentContainer = document.querySelector('.container');
  var searchValue;
  var ticker;

  this.resultsBox = function (searchBox) {
    // Kontrollera om searchResultsDiv redan finns
    this.searchResultsDiv = document.getElementById('searchResultsDiv');

    // Om den inte finns, skapa den
    if (!this.searchResultsDiv) {
      this.searchResultsDiv = document.createElement('div');
      this.searchResultsDiv.id = 'searchResultsDiv';
      searchBox.appendChild(this.searchResultsDiv);
    } else {
      // Om den finns, rensa dess innehåll
      this.searchResultsDiv.innerHTML = '';
    }

    this.searchResults = document.createElement('ul');
    this.searchResults.className = 'searchResults';
    this.searchResultsDiv.appendChild(this.searchResults);
  }

  this.showResults = (ticker, name, type, region, price, searchBox) => {
    this.stockItem = document.createElement('li');
    this.stockItem.innerHTML = `(${ticker}) ${name}  <span id="stockRegion">${region}</span>`;
    this.searchResults.appendChild(this.stockItem);

    this.stockItem.addEventListener('click', () => {
      this.previousButtonsDiv = document.querySelector('.stockButtonsDiv');
      if (this.previousButtonsDiv) {
        this.previousButtonsDiv.remove();
      }
      this.buttonsDiv = document.createElement('div');
      this.buttonsDiv.className = 'stockButtonsDiv';

      this.buyStock = document.createElement('button');
      this.buyStock.innerHTML = 'Köp aktien';
      this.buyStock.className = 'buttons buyStock';
      this.buttonsDiv.appendChild(this.buyStock);

      this.buyStock.addEventListener('click', () => {
        this.buyStockFunc({ ticker, name, type, region, price });
      });

      this.goToStock = document.createElement('button');
      this.goToStock.innerHTML = 'Gå till aktien';
      this.goToStock.className = 'buttons goToStock';
      this.buttonsDiv.appendChild(this.goToStock);

      this.goToStock.addEventListener('click', () => {
        this.goToStockFunc(ticker, name, apiKey);
      });

      searchBox.appendChild(this.buttonsDiv);
    });
  }

  this.fetchApi = function (searchBox) {
    /*
    const apiUrl = `https://www.alphavantage.co/query?function=ticker_SEARCH&keywords=${searchValue}&apikey=${apiKey}`;
    const priceUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data['bestMatches']) {
          this.searchResults.innerHTML = ''; // clear previous results
          data['bestMatches'].forEach(match => {
            ticker = match['1. ticker'];
            var name = match['2. name'];
            var type = match['3. type'];
            var region = match['4. region'];

            // Make a separate API call to fetch the stock price

            fetch(priceUrl)
              .then(response => response.json())
              .then(priceData => {
                var price = priceData['Global Quote']['05. price'];
                this.showResults(ticker, name, type, region, price, searchBox);
              })
              .catch(error => {
                console.log('Error fetching stock price:', error);
              });
          });
        } else {
          console.log('No stock found');
        }
      });
      */

    // Simulated response using dummy variables
    const dummyResponse = {
      'bestMatches': [
        { '1. ticker': 'AAPL', '2. name': 'Apple Inc.', '3. region': 'US' },
        { '1. ticker': 'APPL', '2. name': 'Applied Optoelectronics, Inc.', '3. region': 'US' },
        { '1. ticker': 'APPL', '2. name': 'Applied Optoelectronics, Inc.', '3. region': 'US' },
        { '1. ticker': 'APPL', '2. name': 'Applied Optoelectronics, Inc.', '3. region': 'US' },
      ]
    };

    // Simulated response handling using dummy variables
    if (dummyResponse['bestMatches']) {
      this.searchResults.innerHTML = ''; // clear previous results
      dummyResponse['bestMatches'].forEach(match => {
        ticker = match['1. ticker'];
        var name = match['2. name'];
        var region = match['3. region'];
        var type = match['4. type'];
        var price = 100;
        this.showResults(ticker, name, type, region, price, this.searchBox);
      });
    } else {
      console.log('No stock found');
    }
  }

  this.createSearchBox = function (balance) {
    this.searchBox = document.createElement('div');
    this.searchBox.className = 'searchBox';
    parentContainer.appendChild(this.searchBox);

    this.h2 = document.createElement('h2');
    this.h2.innerHTML = 'Sök efter aktier';
    this.h2.className = 'h2search';
    this.searchBox.appendChild(this.h2);

    this.balanceText = document.createElement('p');
    this.balanceText.innerHTML = 'Ditt saldo: <b>' + balance + ':-</b>';
    this.balanceText.className = 'searchBalance';
    this.searchBox.appendChild(this.balanceText);

    this.p = document.createElement('p');
    this.p.innerHTML = 'Ange aktieticker för att se aktuell kurs';
    this.p.className = 'pSearch';
    this.searchBox.appendChild(this.p);

    this.searchStockInput = document.createElement('input');
    this.searchStockInput.type = 'text';
    this.searchStockInput.placeholder = 'Sök aktie här';
    this.searchStockInput.className = 'inputBars searchStockInput';
    this.searchStockInput.name = 'searchStockInput';
    this.searchBox.appendChild(this.searchStockInput);

    var debounceTimeout;
    this.searchStockInput.addEventListener('input', () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        searchValue = this.searchStockInput.value;
        this.resultsBox(this.searchBox);
        this.fetchApi(this.searchBox);
      }, 600);
    });
  }

  this.buyStockFunc = function (ticker, name, type, region, price) {
    var buyStock = new Stock(ticker, name, type, region, price);
    this.searchResultsDiv.remove();
  }

  this.goToStockFunc = function (ticker, name, apiKey) {
    this.searchResultsDiv.remove();
    this.searchBox.remove();
    var stockPage = new StockPage(parentContainer);
    stockPage.createStockPage(name);
    stockPage.createChart(ticker, apiKey);
  }
}