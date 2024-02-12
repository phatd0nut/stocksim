const App = {
    init: function () {
        var stockApp = new StockApp();
        stockApp.init();
    }
}

window.addEventListener('load', App.init);