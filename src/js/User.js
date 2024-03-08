// Klass för att skapa en ny användare och sätta budget för användaren. Användarens namn och budget sätts här och används sedan i hela programmet för att visa användarens namn och budget i olika delar av programmet.
function User(name, parent, settings) {
  this.settings = settings; // Settings objektet som skickas in från StockApp.js.
  this.name = name; // Användarens namn som skickas in från main.js.
  this.balance = 0;
  var portfolio = new Portfolio(this.settings, parent);
  var charts = new Charts();
  var search = new Search();

  // Om användarens namn finns, visa portföljen
  if (this.name) {
    portfolio.showPortfolio(parent); // Du behöver ange rätt container här
  }

  // Kollar om användaren redan har en cookie med sitt namn och budget. Om användaren har en cookie så sätts användarens namn och budget till det värdet som finns i cookien.
  this.setCookies = function () {
    document.cookie = `username=${this.name}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    document.cookie = `balance=${this.balance}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
  }

  this.userInterface = function () {
    this.setupDiv = document.createElement('div');
    this.setupDiv.className = 'setupDiv';
    parent.appendChild(this.setupDiv);

    var nameCookie = document.cookie.split('; ').find(row => row.startsWith('username='));
var balanceCookie = document.cookie.split('; ').find(row => row.startsWith('balance='));
if (nameCookie && balanceCookie) {
  this.name = nameCookie.split('=')[1];
  this.balance = parseFloat(balanceCookie.split('=')[1]);
  if (this.balance > 0) {
    portfolio.setBalance(this.balance);
    search.setCharts(charts);
    search.setPortfolio(portfolio);
    search.setSettings(this.settings);
    search.createSearchBox();

    if (this.setupDiv) {
      this.setupDiv.parentNode.removeChild(this.setupDiv);
    }
  }
}

    this.h2UserName = document.createElement('h2');
    this.h2UserName.innerHTML = 'Hej ' + this.name + '!';
    this.h2UserName.className = 'h2UserName';
    this.setupDiv.appendChild(this.h2UserName);

    this.p = document.createElement('p');
    this.p.innerHTML = 'Bestäm hur mycket pengar du vill investera:';
    this.p.className = 'setBudgetP';
    this.setupDiv.appendChild(this.p);

    this.inputBudget = document.createElement('input');
    this.inputBudget.type = 'number';
    this.inputBudget.placeholder = 'Ange belopp';
    this.inputBudget.className = 'inputBars inputBudget';
    this.setupDiv.appendChild(this.inputBudget);

    this.setBudgetBtn = document.createElement('button');
    this.setBudgetBtn.className = 'buttons setBudgetBtn';
    this.setBudgetBtn.innerHTML = 'Spara';
    this.setupDiv.appendChild(this.setBudgetBtn);

    this.setBudgetBtn.addEventListener('click', () => {
      var budget = this.inputBudget.value;
      if (budget !== '' && parseFloat(budget) > 0) {
        this.balance = parseFloat(this.inputBudget.value);
        this.setCookies();  // Sätt cookies när balansen uppdateras
        this.inputBudget.remove();
        this.setBudgetBtn.remove();
        this.p.remove();
        this.h2UserName.remove();
        portfolio.setBalance(this.balance);
        search.setCharts(charts);
        search.setPortfolio(portfolio);
        search.setSettings(this.settings);
        search.createSearchBox();
        this.setupDiv.remove();
      } else {
        this.p.innerHTML = 'Belopp saknas eller är 0, försök igen';
      }
    });
  }
}