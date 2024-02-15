function StockApp() {
    var parent = document.getElementById('app');

    this.init = function () {
        this.appBody();
    }

    this.appBody = function() {
        var container = document.createElement('div');
        container.className = 'container';
        parent.appendChild(container);
        var createUser = new CreateUser(container);
        createUser.createUserBox(parent);
    }

}