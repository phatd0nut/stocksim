// Funktion för att skapa en användarklass
function User(name, parent) {
  var initialBalance = 0;
  this.name = name;
  this.balance = initialBalance;
  // this.portfolio = new Portfolio();

  this.setupInterface = function () {
    // Initiera API-nyckel
    var getApiKey = new StockMarketAPI()();


    var setupDiv = document.createElement('div');
    setupDiv.className = 'setupDiv';
    parent.appendChild(setupDiv);
    this.h2UserName = document.createElement('h2');
    this.h2UserName.innerHTML = 'Hej ' + this.name + '!';
    this.h2UserName.className = 'h2UserName';
    setupDiv.appendChild(this.h2UserName);
    this.p = document.createElement('p');
    this.p.innerHTML = 'Leta efter aktier att köpa!';
    this.p.className = 'searchStocks';
    setupDiv.appendChild(this.p);

    // Create search input
    var searchStockInput = document.createElement('input');
    searchStockInput.type = 'text';
    searchStockInput.placeholder = 'Sök efter aktier';
    searchStockInput.className = 'searchStockInput';
    setupDiv.appendChild(searchStockInput);

    // Add event listener for search input
    searchStockInput.addEventListener('input', function (event) {
      var searchValue = event.target.value;
      var search = new Search();
      search.searchStocks(searchValue);
      
    })
  }

  this.setupInterface();
}