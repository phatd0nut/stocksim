// Klass för att skapa en ny användare. Användarens namn och portfölj sätts här. Har användaren redan en cookie med namn och portfölj visas portföljen direkt, annars skapas en ny användare.
function CreateUser(container, settings, charts) {
  this.parentContainer = container; // Container för att hålla användargränssnittet och fästa det i DOM:en.
  this.settings = settings; // Settings objektet som skickas in från StockApp.js.
  this.settings.loadThemeFromCookie(); // Ladda temat från en cookie om det finns en.
  this.portfolio = new Portfolio(container, settings); // Skapa en ny portfölj.
  this.portfolio.initLS(); // Kolla om det finns en portfölj i local storage.
  this.charts = charts; // Charts objektet som skickas in från StockApp.js.
  this.search = new Search(this.settings, this.charts); // Instansiering av Search klassen.
  this.search.setPortfolio(this.portfolio); // Skicka portfolio objektet till Search objektet.
  this.portfolio.initSearchClass(this.search); // Skicka search objektet till Portfolio objektet.

  // Metod för att skapa användargränssnittet för att skapa en ny användare.
  this.createUserBox = function () {
    // Om cookies 'username' och 'stocks' finns, visa portföljen
    if (document.cookie.includes('username') && document.cookie.includes('stocks')) {
      this.portfolio.showPortfolio(this.parentContainer);
    } else {
      this.createUserDiv = document.createElement('div');
      this.createUserDiv.className = 'createUserDiv';
      this.parentContainer.appendChild(this.createUserDiv);
      this.portfolioIconDiv = document.getElementById('portfolioIconDiv');
      this.portfolioIconDiv.addEventListener('click', () => {
        this.portfolio.manageMessageVisibility(this.parentContainer);
      });

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
      this.createUserBtn.innerHTML = 'Skriv ett namn för att fortsätta';
      this.createUserBtn.disabled = true; // Inaktivera knappen initialt
      this.createUserBtn.style.backgroundColor = '#cccccc'; // Gråmarkera knappen
      this.createUserBtn.style.color = '#666666'; // Ändra textfärgen till mörkgrå
      this.createUserDiv.appendChild(this.createUserBtn);

      this.inputName.addEventListener('input', () => {
        if (this.inputName.value.trim() !== '') {
          this.createUserBtn.disabled = false; // Aktivera knappen när användaren skriver något
          this.createUserBtn.innerHTML = 'Tryck här för att fortsätta'
          this.createUserBtn.style.backgroundColor = ''; // Ta bort gråmarkeringen
          this.createUserBtn.style.color = ''; // Återställ textfärgen
        } else {
          this.createUserBtn.disabled = true; // Inaktivera knappen om användaren tar bort all text
          this.createUserBtn.innerHTML = 'Skriv ett namn för att fortsätta';
          this.createUserBtn.style.backgroundColor = '#cccccc';
          this.createUserBtn.style.color = '#666666';
        }
      });
      
      this.createUserBtn.addEventListener('click', () => {
        var name = this.inputName.value.trim();
        if (name !== '') { // Kolla om användaren har skrivit in ett namn
          // Skapa en ny användare om det inte finns en cookie med det angivna namnet
          var createNewU = new User(name, this.parentContainer, this.settings, this.portfolio, this.search);
          createNewU.initSearch();
          document.cookie = `username=${name}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`; // Spara namnet i en cookie
          this.createUserDiv.remove();
          createNewU.userInterface();
        }
      });
    }
  }
}