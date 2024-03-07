// Funktion för att söka efter aktier och hantera interaktion med användargränssnittet för köp.
function Search(charts, portfolio, settings) {
  this.charts = charts; // En array med diagramdata.
  this.portfolio = portfolio; // Portföljobjektet.
  this.settings = settings; // Inställningsobjektet.

  // Initialisering av variabler och instanser.
  const self = this;
  const apiKey = new StockMarketAPI()(); // API-nyckel för börsdata.
  const parentContainer = document.querySelector('.container'); // Huvudbehållare i DOM.
  const stockPrice = new StockPrice(); // Instans för aktiepris.
  const stockPage = new StockPage(parentContainer, stockPrice, this.charts, self, this.settings, this.portfolio); // Instans för sida med aktieinformation med aktiepris, diagramdata, sökobjekt, inställningsobjekt och portföljobjekt som argument.
  var searchValue; // Söksträng.
  var symbol; // Aktiesymbol.
  var currentStockPrice; // Aktiepris.


  var startDateSearch = new Date(); // Instans av Date-objekt för att sätta startdatum för sökningen.
  this.startDateSearchStr = startDateSearch.toISOString().split('T')[0]; // Sätter startdatum för sökningen till dagens datum.

  stockPrice.setApiKey(apiKey); // Sätt API-nyckel för aktieprisobjektet.
  stockPrice.setStartDate(this.startDateSearchStr); // Sätt startdatum för aktieprisobjektet.

  // Funktion för att skapa sökresultatboxen.
  this.resultsBox = function (searchBox) {
    // Kontrollera om searchResultsDiv redan finns.
    this.searchResultsDiv = document.getElementById('searchResultsDiv');

    // Om den inte finns, skapa den.
    if (!this.searchResultsDiv) {
      this.searchResultsDiv = document.createElement('div');
      this.searchResultsDiv.id = 'searchResultsDiv';
      searchBox.appendChild(this.searchResultsDiv);
    } else {
      // Om den finns, rensa dess innehåll.
      this.searchResultsDiv.innerHTML = '';
    }
    this.searchResults = document.createElement('ul');
    this.searchResults.className = 'searchResults';
    this.searchResultsDiv.appendChild(this.searchResults);
  }

  // Funktion för att skapa sökrutan och visa saldo.
  this.createSearchBox = function () {
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
      // Uppdatera saldo och visa det i sökrutan med hjälp av portföljobjektet (se Portfolio.js).
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

    //Skapa portföljikonen och lägg till den på söksidan
    this.settings.addPortfolioIcon(this.searchBox); // Skapa portföljikonen och lägg till den i appen (se Settings.js).
    this.portfolioIconDiv = document.getElementById('portfolioIconDiv');

    // Lyssnar på klickhändelsen för att visa portföljen när användaren klickar på portföljikonen.
    this.portfolioIconDiv.addEventListener('click', () => {
      this.portfolio.showPortfolio(parentContainer);
    });

    // Lyssnar på input-händelsen i sökrutan och skapar en timeout-funktion för att hantera sökningen (debounce) för att undvika överbelastning av API:et med för många förfrågningar på kort tid.
    var debounceTimeout; // Variabel för att hantera debounce.
    this.searchStockInput.addEventListener('input', () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        searchValue = this.searchStockInput.value;
        this.resultsBox(this.searchBox);
        this.fetchApi(searchValue);
      }, 600); // 600 ms timeout för att hantera sökningen (debounce).
    });
  }

  // Funktion för att skapa knappar för köp och knapp för att gå till aktiesidan.
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

  // Funktion för att visa sökresultaten i en lista och lägga till klickhändelse för att köpa aktier. Om användaren klickar på en aktie, skapas en köpbox för att köpa aktier med.
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
        // Ta bort 'clicked' id från alla li-element.
        stockItems.forEach(item => {
          item.id = '';
        });

        // Lägg till 'clicked' id till det klickade li-elementet. Detta används för att visa vilken aktie som är vald för köp.
        this.id = 'clicked';
      });
    });
  }

  // Funktion för att hämta aktiedata från API.
  this.fetchApi = async function (searchValue) {
    // Rensa sökresultaten
    this.searchResults.innerHTML = '';

    // Om usStocks inte finns (som är en lista med amerikanska aktier), hämta aktier från API.
    if (!this.usStocks) {
      const apiUrl = 'https://financialmodelingprep.com/api/v3/stock/list?apikey=' + apiKey;

      // Rensa redan existerande GIF.
      var existingGif = document.getElementById('loadingGif');
      if (existingGif) {
        this.searchResults.removeChild(existingGif);
      }

      // Skapa en GIF för att visa att aktier hämtas från API (laddning).
      var gif = document.createElement('img');
      gif.src = '../src/img/sedel_1.gif';
      gif.id = 'loadingGif';
      this.searchResults.appendChild(gif);

      // Om informationstexten inte finns, skapa den.
      if (!this.p) {
        this.p = document.createElement('p');
        this.p.id = 'pSearch';
        this.searchBox.appendChild(this.p);
      }
      this.p.innerHTML = 'Letar efter aktier...';

      // Försök hämta aktier från API 5 gånger. Om det inte går att hämta aktier, visa felmeddelande.
      for (let i = 0; i < 5; i++) {
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();

          // Filtrera ut amerikanska aktier enbart.
          this.usStocks = data.filter(stock => stock.type === 'stock' && (stock.exchangeShortName === 'NASDAQ' || stock.exchangeShortName === 'NYSE'));
          break;
        } catch (error) {
          console.error(`Attempt ${i + 1} failed. Retrying...`);
          if (i === 4) {
            console.error('Error fetching stocklist after 5 attempts');
            this.p.innerHTML = 'Fel vid hämtning av aktier. Kontrollera din nätanslutning eller försök igen senare.';
          } else {
            await new Promise(resolve => setTimeout(resolve, 3000)); // Vänta 3 sekunder innan nästa försök.
          }
        }
      }
    }

    // Rensa GIF om den finns och visa sökresultaten.
    if (this.searchResults.contains(gif)) {
      this.searchResults.removeChild(gif);
    }

    // Filtrera ut matchande aktier och visa dem i sökresultaten om de finns (annars visa felmeddelande).
    var matchingStocks = this.usStocks.filter(stock => stock.name && stock.name.toLowerCase().startsWith(searchValue.toLowerCase()));

    if (matchingStocks.length > 0) {
      // Om this.p finns och den finns i searchBox, ta bort den från searchBox och sätt this.p till null (nullifiera den).
      if (this.p && this.searchBox.contains(this.p)) {
        this.searchBox.removeChild(this.p);
        this.p = null;
      }
      matchingStocks.forEach(stock => {
        symbol = stock.symbol;
        var name = stock.name;
        var exchangeShortName = stock.exchangeShortName;
        this.showResults(symbol, name, exchangeShortName);
      });
    } else {
      // Om this.p inte finns, skapa den och sätt innerHTML till 'Inga aktier hittades' (om det inte finns några matchande aktier).
      if (!this.p) {
        this.p = document.createElement('p');
        this.p.id = 'pSearch';
        this.searchBox.appendChild(this.p);
      }
      this.p.innerHTML = 'Inga aktier hittades';
    }
  }

  // Funktion för att köpa aktier och uppdatera saldo och portfölj med köpet (inklusive validering).
  this.buyStockFunc = async function (name) {
    // Dölj sökresultaten
    this.hideSearchElements();

    // Rensa buyDiv, stockInfo och buyHeader om de finns och sätt dem till null.
    if (this.stockInfo) {
      this.stockInfo.remove();
      this.stockInfo = null;
    }

    // Skapa buyDiv om den inte finns, annars uppdatera stockInfo med aktieinformationen med hjälp av name som argument. Name är aktiens namn som användaren klickade på i sökresultaten (se showResults-funktionen), och name är det som används för att skapa buyDiv och stockInfo för rätt aktie (se createBuyDiv-funktionen).
    if (!this.buyDiv) {
      this.createBuyDiv(name);
    } else {
      // Om buyDiv finns, uppdatera stockInfo med aktieinformationen med hjälp av name som argument.
      this.createStockInfo(name);
    }
  };

  // Funktion för att dölja sökresultaten och sökrutan när användaren klickar på en aktie för att köpa den.
  this.hideSearchElements = function () {
    this.searchResultsDiv.style.display = 'none';
    this.searchStockInput.style.display = 'none';
    this.buttonsDiv.style.display = 'none';
  };

  // Funktion för att åter visa sökresultaten och sökrutan när användaren klickar på 'Köp' eller 'Gå tillbaka' i köpboxen.
  this.showSearchElements = function () {
    this.searchResultsDiv.style.display = 'flex';
    this.searchStockInput.style.display = 'flex';
    this.buttonsDiv.style.display = 'flex';
  };

  // Funktion för att skapa köpboxen och visa aktieinformation och köpknappar för användaren att köpa aktier med (inklusive validering).
  this.createBuyDiv = async function (name) {
    // Rensa buyDiv och stockInfo om de finns och sätt dem till null.
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

    // Vänta på att aktiepriset hämtas och skapa sedan stockInfo och köpinputs med hjälp av namnet på aktien som användaren klickade på i sökresultaten (se showResults-funktionen) som argument för att skapa rätt köpbox för rätt aktie (se createStockInfo-funktionen).
    await this.createStockInfo(name);
    this.setupBuyStockInputs(name);
  };

  // Funktion för att skapa aktieinformationen och visa den i köpboxen. Name är argumentet som används för att skapa rätt köpbox för rätt aktie (se createBuyDiv-funktionen) och för att hämta rätt aktieinformation (se showResults-funktionen).
  this.createStockInfo = function (name) {
    this.stockInfo = document.createElement('div');
    this.stockInfo.id = 'stockInfoFromBuyBox';
    var buyHeader = document.createElement('h2');
    var headerPrice = document.createElement('span');

    buyHeader.innerHTML = name;
    if (name.length > 15) { // Om aktiens namn är längre än 15 tecken, sätt fontstorleken till 1rem.
      buyHeader.style.fontSize = '1rem';
    }
    headerPrice.id = 'headerPrice';
    buyHeader.id = 'buyHeader';
    this.buyDiv.appendChild(this.stockInfo);
    this.stockInfo.appendChild(buyHeader);
    this.stockInfo.appendChild(headerPrice);

    // Hämta realtidspriset (5 försök) för aktien och uppdatera sedan inputfältet med det nya priset (inklusive validering) och visa det i köpboxen. Om det inte går att hämta realtidspriset, hämta det senaste stängningspriset istället. Om det inte går att hämta det senaste stängningspriset, visa ett felmeddelande.
    this.retryGetRealTimePrice = async function () {
      for (let i = 0; i < 5; i++) {
        try {
          const realTimePrice = await stockPrice.getRealTimePrice(); // Hämtar det realtida priset.
          if (realTimePrice) {
            currentStockPrice = realTimePrice; // Sparar det realtida priset.
            headerPrice.innerHTML = realTimePrice + '$';
            this.updateInputField();
            return;
          } else {
            console.error(`Attempt ${i + 1} failed. Retrying...`);
          }
        } catch (error) {
          console.error(`Attempt ${i + 1} failed. Retrying...`);
        }
      }
      console.error('Error getting real-time price after 5 attempts. Falling back to last closing price.');
      const closingPrice = await stockPrice.lastClosingPrice(); // Hämtar det senaste stängningspriset
      currentStockPrice = closingPrice; // Sparar det senaste stängningspriset.
      headerPrice.innerHTML = closingPrice + '$';
      this.updateInputField();
    };
    this.retryGetRealTimePrice();

    // Funktion för att uppdatera inputfältet med det nya priset (inklusive validering) och visa det i köpboxen när användaren ändrar antalet aktier att köpa.
    this.updateInputField = () => {
      this.numberOfStocks = parseInt(this.stockQuantityInput.value);

      // Validering av antalet aktier att köpa.
      if (isNaN(this.numberOfStocks) || this.numberOfStocks < 1) {
        alert('Ange ett giltigt antal aktier att köpa');
        return;
      }

      // Validering av aktiepriset (om det inte har hämtats än, visa ett felmeddelande).
      if (typeof currentStockPrice === 'undefined') {
        alert('Inget aktiepris hittades. Försök igen senare.');
        return;
      }

      // Uppdatera inputfältet med det nya priset (antal aktier * aktiepris) och visa det i köpboxen.
      this.inputField.value = this.numberOfStocks * currentStockPrice;
    };

    this.showStockPageAfterPurchase = function () {
      // Hämta stockPageDiv (aktiesidan) från DOM:en om den finns och visa den om du går tillbaka från köpboxen på aktiesidan.
      var stockPageDiv = document.querySelector('.stockPage');
      if (stockPageDiv) {
        stockPageDiv.style.display = 'flex';
        stockPage.checkIfStockExistsInPortfolio(symbol);
      } else return;
    }

    // Funktion för att skapa inputfält för att ange belopp att investera och antal aktier att köpa samt knappar för att köpa och gå tillbaka i köpboxen.
    this.setupBuyStockInputs = function (name) {
      this.inputFieldsDiv = document.createElement('div');
      this.inputFieldsDiv.className = 'inputFieldsDiv';

      this.buttonsDiv = document.createElement('div');
      this.buttonsDiv.className = 'buttonsDiv';

      this.inputField = document.createElement('input');
      this.inputField.type = 'text';
      this.inputField.className = 'inputBars';
      this.inputField.id = 'buyInputField';
      this.inputFieldsDiv.appendChild(this.inputField);

      this.stockQuantityInput = document.createElement('input');
      this.stockQuantityInput.type = 'number';
      this.stockQuantityInput.className = 'inputBars';
      this.stockQuantityInput.id = 'stockQuantityInput';
      this.stockQuantityInput.setAttribute('type', 'number');
      this.stockQuantityInput.setAttribute('min', '1');
      this.stockQuantityInput.value = '1'; // Standardvärde ett (1) för antal aktier att köpa.
      this.inputFieldsDiv.appendChild(this.stockQuantityInput);

      this.buyButton = document.createElement('button');
      this.buyButton.innerHTML = 'Köp';
      this.buyButton.className = 'buttons';
      this.buyButton.id = 'buyButton';
      this.buttonsDiv.appendChild(this.buyButton);

      this.revertBuy = document.createElement('button');
      this.revertBuy.innerHTML = 'Gå tillbaka';
      this.revertBuy.className = 'buttons';
      this.revertBuy.id = 'revertBuy';
      this.buttonsDiv.appendChild(this.revertBuy);

      // Event listeners för att hantera köp och gå tillbaka i köpboxen (inklusive validering).
      this.revertBuy.addEventListener('click', () => {
        // Rensa buyDiv, stockInfo, inputField, buyButton och revertBuy om de finns och sätt dem till null (nullifiera dem).
        if (this.buyDiv) {
          this.buyDiv.remove();
          this.buyDiv = null;
        }
        if (this.stockInfo) {
          this.stockInfo = null;
        }
        if (this.buyButton) {
          this.buyButton.remove();
          this.buyButton = null;
        }
        if (this.revertBuy) {
          this.revertBuy.remove();
          this.revertBuy = null;
        }

        // Hämta stockPageDiv (aktiesidan) från DOM:en om den finns och visa den om du går tillbaka från köpboxen på aktiesidan.
        this.showStockPageAfterPurchase();

        // Visa sökresultaten och sökrutan igen när du går tillbaka från köpboxen på söksidan (se showSearchElements-funktionen).
        this.showSearchElements();
        this.createButtons(name, symbol, apiKey);
        this.searchBox.appendChild(this.buttonsDiv);
      });


      this.buyDiv.appendChild(this.inputFieldsDiv);
      this.buyDiv.appendChild(this.buttonsDiv);
      this.stockQuantityInput.addEventListener('change', this.updateInputField); // Lägg till event listener för att hantera ändring av antal aktier att köpa (se updateInputField-funktionen).

      // Event listener för att hantera ändring av belopp att investera (inklusive validering).
      this.inputField.addEventListener('change', async () => {
        this.amountToInvest = parseFloat(this.inputField.value);
        if (isNaN(this.amountToInvest)) {
          alert('Please enter a valid number');
          return;
        }
      });

      // Event listener för att genomföra köp av aktier samt uppdatera saldo och portfölj med köpet. När köpet slutförs, ta bort köpboxen och visa sökresultaten och sökrutan igen (se showSearchElements-funktionen). Om aktie köps från aktiesidan, visa aktiesidan igen efter köpet (se showStockPageAfterPurchase-funktionen).
      this.buyButton.addEventListener('click', async () => {
        await this.updateInputField(); // Kontrollera att inputfältet uppdaterats med det nya priset innan köpet genomförs.
        this.buyDiv.remove();
        this.buyDiv = null;
        this.inputField.remove();
        this.inputField = null;
        this.buyButton.remove();
        this.buyButton = null;
        this.revertBuy.remove();
        this.revertBuy = null;
        this.searchBox.appendChild(this.buttonsDiv);
        this.showSearchElements();
        this.showStockPageAfterPurchase();
        this.createButtons(name, symbol, apiKey);

        //Skapa en ny instans av Stock (se Stock.js) med aktiens symbol, namn, aktiepris och antal köpa aktier som argument.
        var stockObj = new Stock(symbol, name, currentStockPrice, this.numberOfStocks);

        // Lägg till aktien i portföljen och uppdatera saldo och portfölj med köpet (se Portfolio.js).
        this.portfolio.addStock(stockObj);
        this.portfolio.getBalance();
        this.updateBalance();
        stockPage.checkIfStockExistsInPortfolio(symbol);
      });
    };
  }
  // Funktion för att gå till aktiesidan med aktieinformationen när användaren klickar på 'Gå till aktien' i sökresultaten (se showResults-funktionen och createButtons-funktionen).
  this.goToStockFunc = function (symbol, name, apiKey) {
    this.searchResultsDiv.remove();
    this.searchBox.remove();
    stockPage.createStockPage(name);
    stockPage.prepareChart(symbol, apiKey, 'week');
  };
}