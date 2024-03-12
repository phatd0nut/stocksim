function CreateUser(container, settings) {
  this.parentContainer = container;
  this.settings = settings;
  this.settings.loadThemeFromCookie();
  this.portfolio = new Portfolio(container, settings);
  this.charts = new Charts();
  this.search = new Search(this.settings, this.charts);
  this.search.setPortfolio(this.portfolio);
  this.portfolio.initSearchClass(this.search);

  this.createUserBox = function () {
    // Om cookies 'username' och 'stocks' finns, visa portföljen
    if (document.cookie.includes('username') && document.cookie.includes('stocks')) {
      this.portfolio.showPortfolio(this.parentContainer); // Du behöver ange rätt container här
    } else {

      this.createUserDiv = document.createElement('div');
      this.createUserDiv.className = 'createUserDiv';

      if (!this.parentContainer.contains(this.settings.getSettingsIconElm())) {
        this.parentContainer.appendChild(this.settings.getSettingsIconElm());
      }
      this.parentContainer.insertBefore(this.createUserDiv, this.settings.getSettingsIconElm());

      this.h2 = document.createElement('h2');
      this.h2.innerHTML = 'Fyll i ditt namn för att fortsätta';
      this.h2.className = 'h2instructions';
      this.createUserDiv.appendChild(this.h2);

      this.inputName = document.createElement('input');
      this.inputName.type = 'text';
      this.inputName.placeholder = 'Ange namn här';
      this.inputName.className = 'inputBars inputName';
      this.inputName.name = 'name';
      this.createUserDiv.appendChild(this.inputName);

      this.createUserBtn = document.createElement('button');
      this.createUserBtn.className = 'buttons createUserBtn';
      this.createUserBtn.innerHTML = 'Tryck för att påbörja';
      this.createUserDiv.appendChild(this.createUserBtn);

      this.createUserBtn.addEventListener('click', () => {
        var name = this.inputName.value;
        if (name !== '') { // Check if input is not empty
          // Skapa en ny användare om det inte finns en cookie med det angivna namnet
          var createNewU = new User(name, this.parentContainer, this.settings, this.portfolio, this.search);
          createNewU.initSearch();
          document.cookie = `username=${name}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`; // Spara namnet i en cookie
          this.settings.removeIcons();
          this.createUserDiv.remove();
          createNewU.userInterface();
        }
      });
    }
  }
}