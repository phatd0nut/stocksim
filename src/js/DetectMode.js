// Klass för att detektera vilket läge som används i användarens enhet.
function DetectMode(container) {
    this.container = container; // Container för att hålla användargränssnittet och fästa det i DOM:en.

    // Metod för att sätta referenser till ikonerna i settings-klassen.
    this.detectIcons = function (settingsIconElm, closeModeIconElm, closeSettingsIconElm, portfolioIconElm) {
        this.settingsIconElm = settingsIconElm;
        this.closeModeIconElm = closeModeIconElm;
        this.closeSettingsIconElm = closeSettingsIconElm;
        this.portfolioIconElm = portfolioIconElm;
    }

    // Metod för att uppdatera ikonerna beroende på vilket tema som används.
    this.updateIcons = function (theme) {
        var mode = this.container.getAttribute('data-mode');
        if (mode === 'light' && theme === 'light') {
            this.settingsIconElm.src = '../src/img/settings_icon_1.png';
            this.closeModeIconElm.src = '../src/img/close_icon_1.png';
            this.closeSettingsIconElm.src = '../src/img/close_icon_1.png';
            this.portfolioIconElm.src = '../src/img/portfolio_icon1.png';
        } else if (mode === 'dark' && theme === 'dark') {
            this.settingsIconElm.src = '../src/img/settings_icon_2.png';
            this.closeModeIconElm.src = '../src/img/close_icon_2.png';
            this.closeSettingsIconElm.src = '../src/img/close_icon_2.png';
            this.portfolioIconElm.src = '../src/img/portfolio_icon2.png';
        }
    }

    // Metod för att sätta temat till ljust.
    this.lightMode = function (theme) {
        this.container.style.backgroundColor = '#278664';
        this.container.setAttribute('data-mode', 'light');
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#278664');
        this.updateIcons(theme);
    }

    // Metod för att sätta temat till mörkt.
    this.darkMode = function (theme) {
        this.container.style.backgroundColor = '#4e594a';
        this.container.setAttribute('data-mode', 'dark');
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#4e594a');
        this.updateIcons(theme);
    }

    // Metod för att detektera vilket tema som används och sätta det temat. Om sparade cookies finns med tema sätts det temat. Annars kollar den om användaren har inställt sitt operativsystem på mörkt eller ljust tema och sätter det temat. Om ingen cookie finns och användaren inte har inställt något tema sätts temat till ljust.
    this.detect = function () {
        var themeCookie = document.cookie.split('; ').find(row => row.startsWith('theme='));
        if (themeCookie) {
            var theme = themeCookie.split('=')[1];
            if (theme === 'dark') {
                this.darkMode('dark');
            } else {
                this.lightMode('light');
            }
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.darkMode('dark');
            document.cookie = "theme=dark; path=/;expires=Fri, 01 Dec 9999 00:00:00 GMT";
        } else {
            this.lightMode('light');
            document.cookie = "theme=light; path=/;expires=Fri, 01 Dec 9999 00:00:00 GMT";
        }
    }
}
