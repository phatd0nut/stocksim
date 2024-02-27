function StockApp() {
    var parent = document.getElementById('app');

    this.init = function () {
        this.appBody();
    }

    this.appBody = function () {
        var container = document.createElement('div');
        var logo = new Logo();
        logo.createLogo(container);
        container.className = 'container';
        parent.appendChild(container);
        var detectMode = new DetectMode(container);
        var settings = new Settings(container, detectMode);
        settings.settingsIcon();
        detectMode.detect();
        var createUser = new CreateUser(container, settings);
        createUser.createUserBox(parent);
    }

}