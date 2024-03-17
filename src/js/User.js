// Klass för att skapa en ny användare och sätta budget för användaren. Användarens namn och budget sätts här och används sedan i hela programmet för att visa användarens namn och budget i olika delar av programmet.
function User(name, parent, settings, portfolio, searchClass) {
  this.settings = settings; // Settings objektet som skickas in från StockApp.js.
  this.name = name; // Användarens namn som skickas in från main.js.
  this.balance = 0; // Användarens budget som sätts till 0 från början.
  var portfolio = portfolio; // Portfolio objektet som skickas in från CreateUser.js.
  var search = searchClass; // Search objektet som skickas in från CreateUser.js.

  // Metod för att skicka portfolio objektet till Search objektet.
  this.initSearch = function () {
    search.setPortfolio(portfolio);
  }

  // Metod för att sätta användarens budget i cookies.
  this.setCookies = function () {
    document.cookie = `balance=${this.balance}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
  }

  // Metod för att skapa användargränssnittet för att sätta budget.
  this.userInterface = function () {
    if (!this.setupDiv) {
      this.setupDiv = document.createElement('div');
      this.setupDiv.className = 'setupDiv';
      parent.appendChild(this.setupDiv);
    }

    this.h2UserName = document.createElement('h2');
    this.h2UserName.innerHTML = 'Hej ' + this.name + '!';
    this.h2UserName.className = 'h2UserName';
    this.setupDiv.appendChild(this.h2UserName);

    this.p = document.createElement('p');
    this.p.innerHTML = 'Bestäm hur mycket pengar du vill investera ($):';
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

    // Kolla om användaren redan har namn och en budget och sätt den i så fall.
    var nameCookie = document.cookie.split('; ').find(row => row.startsWith('username='));
    var balanceCookie = document.cookie.split('; ').find(row => row.startsWith('balance='));
    if (nameCookie && balanceCookie) {
      this.name = nameCookie.split('=')[1];
      this.balance = parseFloat(balanceCookie.split('=')[1]);
      if (this.balance > 0) {
        portfolio.setBalance(this.balance);
        this.inputBudget.value = this.balance;
      }
    }

    // Lyssnare för att sätta budgeten.
    this.setBudgetBtn.addEventListener('click', () => {
      var budget = this.inputBudget.value;
      if (budget !== '' && parseFloat(budget) > 0) {
        this.balance = parseFloat(this.inputBudget.value);
        this.setCookies();  // Sätt cookies när saldot uppdateras
        this.inputBudget.remove();
        this.setBudgetBtn.remove();
        this.p.remove();
        this.h2UserName.remove();
        portfolio.setBalance(this.balance);
        this.initSearch();
        search.createSearchBox();
        this.setupDiv.remove();
      } else {
        this.p.innerHTML = 'Belopp saknas eller är 0, försök igen';
      }
    });
  }
}