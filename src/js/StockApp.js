// StockApp klassen ligger till grund för hela appen. Här sätts grundläggande struktur för appen och vissa klasser skapas och initieras här.
function StockApp() {
    var parent = document.getElementById('app'); // Hämtar elementet med id app från index.html och sparar i variabeln parent för att kunna appenda appens innehåll till denna div.

    this.init = function () {
        this.appBody();
    }

    // Metod för att skapa appens innehåll och struktur samt initiera vissa klasser som används i appen.
    this.appBody = function () {
        var container = document.createElement('div'); // Skapar en div för att hålla allt innehåll i appen.
        container.className = 'container';
        var logo = new Logo(); // Skapar en instans av klassen Logo för att skapa appens logga.
        logo.createLogo(container);
        parent.appendChild(container);

        var detectMode = new DetectMode(container); // Skapar en instans av klassen DetectMode och skickar med container som argument för att kunna appenda innehåll till denna div senare i koden.

        var settings = new Settings(container, detectMode); // Skapar en instans av klassen Settings och skickar med container och detectMode som argument för att kunna appenda innehåll till denna div senare i koden.

        settings.settingsIcon(); // Kör settingsIcon metoden i Settings.js för att skapa en settings ikon i appen.

        detectMode.detect(); // Kör detect metoden i DetectMode.js för att kolla vilket tema som är satt i användarens webbläsare.

        var createUser = new CreateUser(container, settings); // Skapar en instans av klassen CreateUser och skickar med container och settings som argument för att kunna appenda innehåll till denna div senare i koden. CreateUser klassen används för att skapa en ny användare och sätta budget för användaren.

        createUser.createUserBox(parent); // Kör createUserBox metoden i CreateUser.js för att skapa en box där användaren kan skapa en ny användare och sätta budget.
    }

}