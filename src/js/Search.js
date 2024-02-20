function Search() {
  var apiKey = new StockMarketAPI()();
  var parentContainer = document.querySelector('.container');
  var searchValue;
  var symbol;

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

  this.showResults = (symbol, name, exchangeShortName) => {
    this.stockItem = document.createElement('li');
    this.stockItem.innerHTML = `(${symbol}) ${name}  <span id="stockRegion">${exchangeShortName}</span>`;
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
        this.goToStockFunc(symbol, name, apiKey);
      });

      this.searchBox.appendChild(this.buttonsDiv);
    });
  }

  this.fetchApi = function (searchBox) {
    const apiUrl = `https://financialmodelingprep.com/api/v3/search?query=${searchValue}&apikey=${apiKey}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data) {
          console.log(data);
          this.searchResults.innerHTML = ''; // Rensa tidigare sökresultat
          data.forEach(stock => {
            symbol = stock.symbol;
            var name = stock.name;
            var currency = stock.currency;
            var exchangeName = stock.stockExchange;
            var exchangeShortName = stock.exchangeShortName;
            this.showResults(symbol, name, exchangeShortName);
            // console.log(symbol, name, currency, exchangeName, exchangeShortName);
          });
        } else {
          console.log('No stock found');
        }
      });

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
}