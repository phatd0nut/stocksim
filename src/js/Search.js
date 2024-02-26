function Search() {
  const apiKey = new StockMarketAPI()();
  const parentContainer = document.querySelector('.container');
  var searchValue;
  var symbol;
  const buy = new BuyStocks();
  const stockPrice = new StockPrice();
  const stockPage = new StockPage(parentContainer, stockPrice);

  var startDateSearch = new Date();
  this.startDateSearchStr = startDateSearch.toISOString().split('T')[0];

  stockPrice.setApiKey(apiKey);
  stockPrice.setStartDate(this.startDateSearchStr);

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
    buy.getBudget(balance);
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
        this.fetchApi(searchValue);
      }, 600);
    });
  }

  this.showResults = (symbol, name, exchangeShortName) => {
    this.stockItem = document.createElement('li');
    this.stockItem.innerHTML = `(${symbol}) ${name}  <span id="stockRegion">${exchangeShortName}</span>`;
    this.searchResults.appendChild(this.stockItem);

    this.stockItem.addEventListener('click', () => {
      stockPrice.setSymbol(symbol);
      console.log(symbol);

      const stockItems = document.querySelectorAll('.searchResults li');

      stockItems.forEach(item => {
        item.addEventListener('click', function () {
          // Remove 'clicked' class from all li elements
          stockItems.forEach(item => {
            item.id = '';
          });

          // Add 'clicked' class to the clicked li element
          this.id = 'clicked';
        });
      });


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

      this.buyDiv = document.createElement('div');
      this.buyDiv.className = 'buyDiv';

      this.buyStock.addEventListener('click', () => {
        this.searchStockInput.style.display = 'none';
        this.searchResultsDiv.style.display = 'none';
        this.buttonsDiv.style.display = 'none';
        this.searchBox.appendChild(this.buyDiv);

        var buyHeader = document.createElement('h2');
        var headerPrice = document.createElement('span');

        stockPrice.getRealTimePrice().then(realTimePrice => {
          if (realTimePrice) {
            headerPrice.innerHTML = realTimePrice;
          } else {
            stockPrice.lastClosingPrice().then(closingPrice => {
              headerPrice.innerHTML = closingPrice;
            });
          }
          buyHeader.innerHTML = name;
          headerPrice.id = 'headerPrice';
          buyHeader.id = 'buyHeader';
          this.buyDiv.appendChild(buyHeader);
          this.buyDiv.appendChild(headerPrice);
        }).catch(error => {
          console.error('Error getting price:', error);
        });

        this.revertBuy = document.createElement('button');
        this.revertBuy.innerHTML = 'Gå tillbaka';
        this.revertBuy.className = 'buttons revertBuy';
        this.buyDiv.appendChild(this.revertBuy);

        this.revertBuy.addEventListener('click', () => {
          this.buyDiv.remove();
          this.searchStockInput.style.display = 'flex';
          this.searchResultsDiv.style.display = 'flex';
          this.buttonsDiv.style.display = 'flex';
        });

        this.buyStockFunc(symbol, name);
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

  this.fetchApi = async function (searchValue) {
    // Rensa tidigare sökresultat
    this.searchResults.innerHTML = '';

    // Kontrollera om vi redan har hämtat listan över aktier
    if (!this.usStocks) {
      const apiUrl = 'https://financialmodelingprep.com/api/v3/stock/list?apikey=' + apiKey;

      // Ta bort befintlig laddnings-GIF om den finns
      var existingGif = document.getElementById('loadingGif');
      if (existingGif) {
        this.searchResults.removeChild(existingGif);
      }

      var gif = document.createElement('img');
      gif.src = '../src/img/sedel_1.gif';
      gif.id = 'loadingGif';
      this.searchResults.appendChild(gif);

      // Hämta en lista över alla amerikanska aktier
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Filtrera listan för att endast inkludera amerikanska aktier
      this.usStocks = data.filter(stock => stock.type === 'stock' && (stock.exchangeShortName === 'NASDAQ' || stock.exchangeShortName === 'NYSE'));
    }

    // Ta bort laddnings-GIF om den fortfarande är en del av this.searchResults
    if (this.searchResults.contains(gif)) {
      this.searchResults.removeChild(gif);
    }

    // Sök igenom listan över amerikanska aktier
    var matchingStocks = this.usStocks.filter(stock => stock.name && stock.name.toLowerCase().startsWith(searchValue.toLowerCase()));

    if (matchingStocks.length > 0) {
      // If this.p exists and is a child of this.searchBox, remove it
      if (this.p && this.searchBox.contains(this.p)) {
        this.searchBox.removeChild(this.p);
      }
      matchingStocks.forEach(stock => {
        symbol = stock.symbol;
        var name = stock.name;
        var exchangeShortName = stock.exchangeShortName;
        this.showResults(symbol, name, exchangeShortName);
      });
    } else {
      this.p = document.createElement('p');
      this.p.className = 'pSearch';
      this.p.innerHTML = 'Inga aktier hittades';
      if (!this.searchBox.contains(this.p)) {
        this.searchBox.appendChild(this.p);
      }
    }
  }

  this.buyStockFunc = function (symbol, name) {
    this.inputField = document.createElement('input');
    this.inputField.type = 'text';
    this.inputField.className = 'inputBars';
    this.inputField.id = 'buyInputField';
    this.inputField.placeholder = 'Ange belopp att köpa för';
    this.buyDiv.appendChild(this.inputField);
    // var buyStock = new BuyStocks(symbol, name, apiKey);
    // buyStock.buyStock();
  }

  this.goToStockFunc = function (symbol, name, apiKey) {
    this.searchResultsDiv.remove();
    this.searchBox.remove();
    stockPage.createStockPage(name);
    stockPage.prepareChart(symbol, apiKey, unit = 'week');
  }
}