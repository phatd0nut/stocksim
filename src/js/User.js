// Klass för att skapa en ny användare
function User(name, parent, settings) {
  this.settings = settings;
  this.name = name;
  this.balance = 0;
  const portfolio = new Portfolio();
  const charts = new Charts();

  this.userInterface = function () {
    this.setupDiv = document.createElement('div');
    this.setupDiv.className = 'setupDiv';
    parent.appendChild(this.setupDiv);

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
      if (budget !== '') {
        this.balance = parseFloat(this.inputBudget.value);
        console.log('User Balance:', this.balance); // Log user balance
        this.inputBudget.remove();
        this.setBudgetBtn.remove();
        this.p.remove();
        this.h2UserName.remove();
        portfolio.setBalance(this.balance);
        console.log('Portfolio Balance:', portfolio.getBalance()); // Log portfolio balance
        var search = new Search(charts, portfolio);  
        search.createSearchBox();
        this.setupDiv.remove();
      } else {
        this.p.innerHTML = 'Belopp saknas, försök igen';
      }
    });
  }
}