function StockApp() {
    var parent = document.getElementById('app');

    this.init = function () {
        this.appBody();
    }

    this.appBody = function() {
        var container = document.createElement('div');
        var logo = new Logo();
        logo.createLogo(container);
        container.className = 'container';
        parent.appendChild(container);
        var createUser = new CreateUser(container);
        createUser.createUserBox(parent);
        var detectMode = new DetectMode(container);
        detectMode.detect();
        var settings = new Settings(container, detectMode);
        settings.settingsIcon();
    }

}