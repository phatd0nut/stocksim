function Search() {
  var apiKey = new StockMarketAPI()();
  var searchResultsDiv = null;
  var searchResults = null;
  var parentContainer = document.querySelector('.container');


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

  this.fetchApi = function () {
    const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${searchValue}&apikey=${apiKey}`;

    // Simulated response using dummy variables
    const dummyResponse = {
      'bestMatches': {
        '01. symbol': 'AAPL',
        '02. name': 'Apple Inc.',
      }
    };

    // Simulated response handling
    // Commented out actual API call and used dummy response instead
    // fetch(apiUrl)
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log(data);
    //     if (data['Global Quote']) {
    //       var symbol = data['Global Quote']['01. symbol'];
    //       var price = data['Global Quote']['05. price'];
    //       console.log('Symbol: ' + symbol);
    //       console.log('Price: ' + price);
    //     } else {
    //       console.log('No stock found');
    //     }
    //   });

    // Simulated response handling using dummy variables
    console.log(dummyResponse);
    if (dummyResponse['bestMatches']) {
      var symbol = dummyResponse['bestMatches']['01. symbol'];
      var name = dummyResponse['bestMatches']['02. name'];
      this.showResults(symbol, name);
    } else {
      console.log('No stock found');
    }
  }

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
}