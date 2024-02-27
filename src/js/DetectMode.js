function DetectMode(container) {
    this.container = container;

    this.detectIcons = function (settingsIconElm, closeModeIconElm, closeSettingsIconElm) {
        this.settingsIconElm = settingsIconElm;
        this.closeModeIconElm = closeModeIconElm;
        this.closeSettingsIconElm = closeSettingsIconElm;
    }
    
    this.updateIcons = function () {
        var mode = this.container.getAttribute('data-mode');
        if (mode === 'light') {
            this.settingsIconElm.src = '../src/img/settings_icon_1.png';
            this.closeModeIconElm.src = '../src/img/close_icon_1.png';
            this.closeSettingsIconElm.src = '../src/img/close_icon_1.png';
        } else if (mode === 'dark') {
            this.settingsIconElm.src = '../src/img/settings_icon_2.png';
            this.closeModeIconElm.src = '../src/img/close_icon_2.png';
            this.closeSettingsIconElm.src = '../src/img/close_icon_2.png';
        }
    }
    
    this.lightMode = function () {
        this.container.style.backgroundColor = '#278664';
        this.container.setAttribute('data-mode', 'light');
        this.updateIcons();
    }
    
    this.darkMode = function () {
        this.container.style.backgroundColor = '#4e594a';
        this.container.setAttribute('data-mode', 'dark');
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



/*
function DetectMode(container) {
    this.container = container;

    this.detectIcons = function (settingsIconElm, closeModeIconElm, closeSettingsIconElm) {
        this.settingsIconElm = settingsIconElm;
        this.closeModeIconElm = closeModeIconElm;
        this.closeSettingsIconElm = closeSettingsIconElm;
        this.updateIcons();
    }

    this.updateIcons = function () {
        console.log('updateIcons called with', this.settingsIconElm, this.closeModeIconElm, this.closeSettingsIconElm);
        var mode = this.container.getAttribute('data-mode');
        if (mode === 'light') {
            this.settingsIconElm.src = '../src/img/settings_icon_1.png';
            this.closeModeIconElm.src = '../src/img/close_icon_1.png';
            this.closeSettingsIconElm.src = '../src/img/close_icon_1.png';
        } else if (mode === 'dark') {
            this.settingsIconElm.src = '../src/img/settings_icon_2.png';
            this.closeModeIconElm.src = '../src/img/close_icon_2.png';
            this.closeSettingsIconElm.src = '../src/img/close_icon_2.png';
        }
    }

    this.lightMode = function () {
        this.container.style.backgroundColor = 'rgb(39, 134, 100)';
        this.container.setAttribute('data-mode', 'light');
        this.updateIcons();
    }
    
    this.darkMode = function () {
        this.container.style.backgroundColor = 'rgb(78, 89, 74)';
        this.container.setAttribute('data-mode', 'dark');
        this.updateIcons();
    }

    this.detect = function () {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.darkMode();
        } else {
            this.lightMode();
        }
    }
}
*/