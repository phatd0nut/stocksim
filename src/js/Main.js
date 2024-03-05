// Initiera appen och skapa en ny instans av StockApp klassen.
const App = {
    init: function () {
        var stockApp = new StockApp();
        stockApp.init(); // Kör appen genom att kalla på init metoden i StockApp.js.
    }
}

window.addEventListener('load', App.init); // Lyssnar efter när sidan laddas och kör då App.init metoden.