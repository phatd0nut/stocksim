// Klass för att skapa en ny användare
function User(name, parent) {
  var initialBalance = 0;
  this.name = name;
  this.balance = initialBalance;

  this.userInterface = function () {
    var setupDiv = document.createElement('div');
    setupDiv.className = 'setupDiv';
    parent.appendChild(setupDiv);
    this.h2UserName = document.createElement('h2');
    this.h2UserName.innerHTML = 'Hej ' + this.name + '!';
    this.h2UserName.className = 'h2UserName';
    setupDiv.appendChild(this.h2UserName);
    this.p = document.createElement('p');
    this.p.innerHTML = 'Bestäm hur mycket pengar du vill investera:';
    this.p.className = 'setBudgetP';
    setupDiv.appendChild(this.p);

    var inputBudget = document.createElement('input');
    inputBudget.type = 'number';
    inputBudget.placeholder = 'Ange belopp';
    inputBudget.className = 'inputBars inputBudget';
    setupDiv.appendChild(inputBudget);

    var setBudgetBtn = document.createElement('button');
    setBudgetBtn.className = 'buttons setBudgetBtn';
    setBudgetBtn.innerHTML = 'Spara';
    setupDiv.appendChild(setBudgetBtn);

    setBudgetBtn.addEventListener('click', () => {
      this.balance = inputBudget.value;
      inputBudget.remove();
      setBudgetBtn.remove();
      this.p.remove();
      this.h2UserName.remove();
      var search = new Search();  
      search.createSearchBox(this.balance);
      setupDiv.remove();
    });
  }
}