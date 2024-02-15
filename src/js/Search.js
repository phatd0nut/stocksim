function Search() {
  var apiKey = new StockMarketAPI()();
  var searchResultsDiv = null;
  var searchResults = null;
  var parentContainer = document.querySelector('.container');

  this.resultsBox = function (searchBox) {
    if (!searchResultsDiv) {
      searchResultsDiv = document.createElement('div');
      searchResultsDiv.className = 'searchResultsDiv';
      searchBox.appendChild(searchResultsDiv);
      this.searchResults = document.createElement('ul');
      this.searchResults.className = 'searchResults';
      searchResultsDiv.appendChild(this.searchResults);
    } else {
    }
  }

  this.showResults = (symbol, name) => {
    var stockItem = document.createElement('li');
    stockItem.innerHTML = `(${symbol}) ${name}`;
    this.searchResults.appendChild(stockItem);
  }

  this.fetchApi = function () {
    const apiUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchValue}&apikey=${apiKey}`;

    // Simulated response using dummy variables
    /* const dummyResponse = {
      'bestMatches': [
        { '1. symbol': 'AAPL', '2. name': 'Apple Inc.' },
        { '1. symbol': 'APPL', '2. name': 'Applied Optoelectronics, Inc.' }
      ]
    };
    */

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data['bestMatches']) {
          this.searchResults.innerHTML = ''; // clear previous results
          data['bestMatches'].forEach(match => {
            var symbol = match['1. symbol'];
            var name = match['2. name'];
            this.showResults(symbol, name);
          });
        } else {
          console.log('No stock found');
        }
      });

    /*
    // Simulated response handling using dummy variables
    console.log(dummyResponse);
    if (dummyResponse['bestMatches']) {
      this.searchResults.innerHTML = ''; // clear previous results
      dummyResponse['bestMatches'].forEach(match => {
        var symbol = match['1. symbol'];
        var name = match['2. name'];
        this.showResults(symbol, name);
      });
    } else {
      console.log('No stock found');
    }*/
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
    this.balanceText.innerHTML = 'Ditt saldo: ' + balance + ':-';
    this.balanceText.className = 'searchBalance';
    this.searchBox.appendChild(this.balanceText);

    this.p = document.createElement('p');
    this.p.innerHTML = 'Ange aktiesymbol för att se aktuell kurs';
    this.p.className = 'pSearch';
    this.searchBox.appendChild(this.p);

    this.searchStockInput = document.createElement('input');
    this.searchStockInput.type = 'text';
    this.searchStockInput.placeholder = 'Ange aktiesymbol';
    this.searchStockInput.className = 'inputBars searchStockInput';
    this.searchBox.appendChild(this.searchStockInput);

    this.searchStockInput.addEventListener('input', () => {
      searchValue = this.searchStockInput.value;
      this.resultsBox(this.searchBox);
      this.fetchApi();
    });

    this.searchBtn = document.createElement('button');
    this.searchBtn.className = 'buttons searchBtn';
    this.searchBtn.innerHTML = 'Sök';
    this.searchBox.appendChild(this.searchBtn);

    this.searchBtn.addEventListener('click', () => {
      searchValue = this.searchStockInput.value;
      this.resultsBox(this.searchBox);
      this.fetchApi();
    });
  }
}
