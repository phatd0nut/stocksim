function StockApp() {
    var apiKey = new StockMarketAPI()();
    var parent = document.getElementById('app');

    this.init = function () {
        this.createContainer();
    }


    this.createContainer = function() {
        var container = document.createElement('div');
        container.className = 'container';
        parent.appendChild(container);
        var createUser = new CreateUser(container);
    }

}