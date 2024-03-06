function DetectMode(container) {
    this.container = container;

    this.detectIcons = function (settingsIconElm, closeModeIconElm, closeSettingsIconElm, portfolioIconElm) {
        this.settingsIconElm = settingsIconElm;
        this.closeModeIconElm = closeModeIconElm;
        this.closeSettingsIconElm = closeSettingsIconElm;
        this.portfolioIconElm = portfolioIconElm;
    }
    
    this.updateIcons = function () {
        var mode = this.container.getAttribute('data-mode');
        if (mode === 'light') {
            this.settingsIconElm.src = '../src/img/settings_icon_1.png';
            this.closeModeIconElm.src = '../src/img/close_icon_1.png';
            this.closeSettingsIconElm.src = '../src/img/close_icon_1.png';
            this.portfolioIconElm.src = '../src/img/portfolio_icon1.png';
        } else if (mode === 'dark') {
            this.settingsIconElm.src = '../src/img/settings_icon_2.png';
            this.closeModeIconElm.src = '../src/img/close_icon_2.png';
            this.closeSettingsIconElm.src = '../src/img/close_icon_2.png';
            this.portfolioIconElm.src = '../src/img/portfolio_icon2.png';
        }
    }
    
    this.lightMode = function () {
        this.container.style.backgroundColor = '#278664';
        this.container.setAttribute('data-mode', 'light');
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#278664');
        this.updateIcons();
    }
    
    this.darkMode = function () {
        this.container.style.backgroundColor = '#4e594a';
        this.container.setAttribute('data-mode', 'dark');
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#4e594a');
        this.updateIcons();
    }
    
    this.detect = function () {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.darkMode();
        } else {
            this.lightMode();
        }
        this.updateIcons();
    }
}