function Search(charts, portfolio) {
  this.charts = charts;
  this.portfolio = portfolio;
  const self = this;
  const apiKey = new StockMarketAPI()();
  const parentContainer = document.querySelector('.container');
  const stockPrice = new StockPrice();
  const stockPage = new StockPage(parentContainer, stockPrice, this.charts, self);
  var searchValue;
  var symbol;
  var currentStockPrice;

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

  this.createSearchBox = function () {
    // this.balance = this.portfolio.getBalance();
    this.searchBox = document.createElement('div');
    this.searchBox.className = 'searchBox';
    parentContainer.appendChild(this.searchBox);

    this.h2 = document.createElement('h2');
    this.h2.innerHTML = 'Sök efter aktier';
    this.h2.className = 'h2search';
    this.searchBox.appendChild(this.h2);

    this.balanceText = document.createElement('p');
    this.balanceText.className = 'searchBalance';
    this.updateBalance = function () {
      this.balance = this.portfolio.getBalance();
      this.balanceText.innerHTML = 'Ditt saldo: <b>' + this.balance + '$</b>';
    }
    this.searchBox.appendChild(this.balanceText);
    this.updateBalance();

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

  this.createButtons = (name, symbol, apiKey) => {
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
      this.buyStockFunc(name);
    });

    this.goToStock = document.createElement('button');
    this.goToStock.innerHTML = 'Gå till aktien';
    this.goToStock.className = 'buttons goToStock';
    this.buttonsDiv.appendChild(this.goToStock);

    this.goToStock.addEventListener('click', () => {
      this.goToStockFunc(symbol, name, apiKey);
    });

    this.searchBox.appendChild(this.buttonsDiv);
  }

  this.showResults = (symbol, name, exchangeShortName) => {
    this.stockItem = document.createElement('li');
    this.stockItem.innerHTML = `(${symbol}) ${name}  <span id="stockRegion">${exchangeShortName}</span>`;
    this.searchResults.appendChild(this.stockItem);



    this.stockItem.addEventListener('click', () => {
      stockPrice.setSymbol(symbol);
      this.createButtons(name, symbol, apiKey);
    });

    const stockItems = document.querySelectorAll('.searchResults li');

    stockItems.forEach(item => {
      item.addEventListener('click', function () {
        // Remove 'clicked' id from all li elements
        stockItems.forEach(item => {
          item.id = '';
        });

        // Add 'clicked' id to the clicked li element
        this.id = 'clicked';
      });
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
        this.p = null; // Nullify this.p
      }
      matchingStocks.forEach(stock => {
        symbol = stock.symbol;
        var name = stock.name;
        var exchangeShortName = stock.exchangeShortName;
        this.showResults(symbol, name, exchangeShortName);
      });
    } else {
      // If this.p doesn't exist, create it
      if (!this.p) {
        this.p = document.createElement('p');
        this.p.className = 'pSearch';
        this.searchBox.appendChild(this.p);
      }
      // Update the innerHTML of this.p
      this.p.innerHTML = 'Inga aktier hittades';
    }
  }

  this.buyStockFunc = async function (name) {
    // Hide relevant elements
    this.hideSearchElements();

    // Remove existing stockInfo and set to null
    if (this.stockInfo) {
      this.stockInfo.remove();
      this.stockInfo = null;
    }

    // Check if this.buyDiv exists, and create it if it doesn't
    if (!this.buyDiv) {
      this.createBuyDiv(name);
    } else {
      // If this.buyDiv already exists, just update the stockInfo
      this.createStockInfo(name);
    }
  };

  this.hideSearchElements = function () {
    this.searchResultsDiv.style.display = 'none';
    this.searchStockInput.style.display = 'none';
    this.buttonsDiv.style.display = 'none';
  };

  this.showSearchElements = function () {
    this.searchResultsDiv.style.display = 'flex';
    this.searchStockInput.style.display = 'flex';
    this.buttonsDiv.style.display = 'flex';
  };

  this.createBuyDiv = async function (name) {
    // Remove existing buyDiv, stockInfo, and buyHeader and set to null
    if (this.buyDiv) {
      this.buyDiv.remove();
      this.buyDiv = null;
    }

    if (this.stockInfo) {
      this.stockInfo.remove();
      this.stockInfo = null;
    }

    this.buyDiv = document.createElement('div');
    this.buyDiv.className = 'buyDiv';
    parentContainer.appendChild(this.buyDiv);

    // Wait for the asynchronous calls to complete before proceeding
    await this.createStockInfo(name);
    this.setupBuyStockInputs(name);
  };

  this.createStockInfo = function (name) {
    this.stockInfo = document.createElement('div');
    this.stockInfo.id = 'stockInfoFromBuyBox';
    var buyHeader = document.createElement('h2');
    var headerPrice = document.createElement('span');

    buyHeader.innerHTML = name;
    if (name.length > 15) {
      buyHeader.style.fontSize = '1rem';
    }
    headerPrice.id = 'headerPrice';
    buyHeader.id = 'buyHeader';
    this.buyDiv.appendChild(this.stockInfo);
    this.stockInfo.appendChild(buyHeader);
    this.stockInfo.appendChild(headerPrice);

    stockPrice.getRealTimePrice().then(realTimePrice => {
      if (realTimePrice) {
        currentStockPrice = realTimePrice; // Store the real-time price
        headerPrice.innerHTML = realTimePrice + '$';
      } else {
        stockPrice.lastClosingPrice().then(closingPrice => {
          currentStockPrice = closingPrice; // Store the last closing price
          headerPrice.innerHTML = closingPrice + '$';
        });
      }

      this.updateInputField();
    }).catch(error => {
      console.error('Error getting price:', error);
    });
  };

  this.updateInputField = () => {
    this.numberOfStocks = parseInt(this.stockQuantityInput.value);

    // Validate the input
    if (isNaN(this.numberOfStocks) || this.numberOfStocks < 1) {
      alert('Ange ett giltigt antal aktier att köpa');
      return;
    }

    // Use the stored stock price
    if (typeof currentStockPrice === 'undefined') {
      alert('Vänligen vänta tills aktiepriset har hämtats');
      return;
    }

    // Update the input field
    this.inputField.value = this.numberOfStocks * currentStockPrice;
  };

  this.setupBuyStockInputs = function (name) {
    // Create div for input fields
    this.inputFieldsDiv = document.createElement('div');
    this.inputFieldsDiv.className = 'inputFieldsDiv';

    // Create div for buttons
    this.buttonsDiv = document.createElement('div');
    this.buttonsDiv.className = 'buttonsDiv';

    this.inputField = document.createElement('input');
    this.inputField.type = 'text';
    this.inputField.className = 'inputBars';
    this.inputField.id = 'buyInputField';
    this.inputFieldsDiv.appendChild(this.inputField); // Append to inputFieldsDiv

    this.stockQuantityInput = document.createElement('input');
    this.stockQuantityInput.type = 'number';
    this.stockQuantityInput.className = 'inputBars';
    this.stockQuantityInput.id = 'stockQuantityInput';
    this.stockQuantityInput.setAttribute('type', 'number');
    this.stockQuantityInput.setAttribute('min', '1');
    this.stockQuantityInput.value = '1'; // Set initial value to 1
    this.inputFieldsDiv.appendChild(this.stockQuantityInput); // Append to inputFieldsDiv

    this.buyButton = document.createElement('button');
    this.buyButton.innerHTML = 'Köp';
    this.buyButton.className = 'buttons';
    this.buyButton.id = 'buyButton';
    this.buttonsDiv.appendChild(this.buyButton); // Append to buttonsDiv

    // Create revertBuy button here and append to buttonsDiv
    this.revertBuy = document.createElement('button');
    this.revertBuy.innerHTML = 'Gå tillbaka';
    this.revertBuy.className = 'buttons';
    this.revertBuy.id = 'revertBuy';
    this.buttonsDiv.appendChild(this.revertBuy); // Append to buttonsDiv

    this.revertBuy.addEventListener('click', () => {
      if (this.buyDiv) {
        this.buyDiv.remove();
        this.buyDiv = null; // Set buyDiv to null
      }
      if (this.stockInfo) {
        this.stockInfo = null; // Set stockInfo to null
      }
      if (this.buyButton) {
        this.buyButton.remove();
        this.buyButton = null; // Set buyButton to null
      }
      if (this.revertBuy) {
        this.revertBuy.remove();
        this.revertBuy = null; // Set revertBuy to null
      }
      
      const stockPageDiv = document.querySelector('.stockPage');

      if (stockPageDiv) {
          stockPageDiv.style.display = 'flex';
      }
      

      this.showSearchElements();
      this.createButtons(name, symbol, apiKey);
      this.searchBox.appendChild(this.buttonsDiv);
    });

    // Append inputFieldsDiv and buttonsDiv to buyDiv
    this.buyDiv.appendChild(this.inputFieldsDiv);
    this.buyDiv.appendChild(this.buttonsDiv);
    this.stockQuantityInput.addEventListener('change', this.updateInputField);

    // Add event listener to handle input change
    this.inputField.addEventListener('change', async () => {
      this.amountToInvest = parseFloat(this.inputField.value);
      if (isNaN(this.amountToInvest)) {
        alert('Please enter a valid number');
        return;
      }
    });

    this.buyButton.addEventListener('click', async () => {
      await this.updateInputField();
      this.buyDiv.remove();
      this.buyDiv = null; // Set buyDiv to null
      this.searchStockInput.style.display = 'flex';
      this.searchResultsDiv.style.display = 'flex';
      this.buttonsDiv.style.display = 'flex';
      this.inputField.remove();
      this.inputField = null; // Set inputField to null
      this.buyButton.remove();
      this.buyButton = null;
      this.revertBuy.remove();
      this.revertBuy = null; // Set revertBuy to null
      this.searchBox.appendChild(this.buttonsDiv);

      // Create a new instance of the Stock class
      console.log(name);
      var stockObj = new Stock(symbol, name, currentStockPrice, this.numberOfStocks); // Adjusted here

      this.portfolio.addStock(stockObj);
      this.portfolio.getBalance();
      this.updateBalance();

      // Hide searchResultsDiv
      this.searchResultsDiv.style.display = 'none';

      // Recreate buyDiv with the stock name
      this.createBuyDiv(stockObj.name);
    });
  };

  this.goToStockFunc = function (symbol, name, apiKey) {
    this.searchResultsDiv.remove();
    this.searchBox.remove();
    stockPage.createStockPage(name);
    stockPage.prepareChart(symbol, apiKey, unit = 'week');
  };
}