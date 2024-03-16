// Initiera appen och skapa en ny instans av StockApp klassen.
const App = {
    init: function () {

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('Service Worker registrerad på:', registration.scope);
            })
            .catch(function(error) {
                console.log('Registrering av Service Worker misslyckades:', error);
            });
        }

        var stockApp = new StockApp();
        stockApp.init(); // Kör appen genom att kalla på init metoden i StockApp.js.
    }
}

window.addEventListener('load', App.init); // Lyssnar efter när sidan laddas och kör då App.init metoden.