// Inställningsklassen som skapar inställningsikonen och inställningsfältet i appen. Används för att byta tema och rensa användare. Tar emot parent och detectMode som argument för att kunna appenda innehåll till denna div senare i koden och för att kunna använda detectMode klassen i Settings klassen.
function Settings(parent, detectMode) {
    var mode = detectMode;
    var overlay = document.createElement('div'); // Skapar en div för att använda som overlay när användaren klickar på inställningsikonen.
    overlay.id = 'overlay';
    parent.appendChild(overlay);
    var settingsIconElm, closeModeIconElm, closeSettingsIconElm, portfolioIconElm; // Deklarerar variabler för att använda i metoder nedan. Dessa variabler används för att representera ikoner i appen.

    // Skapar portföljikonen
    portfolioIconElm = document.createElement('img');
    portfolioIconElm.src = '../src/img/portfolio_icon1.png';
    portfolioIconElm.id = 'portfolioIcon';

    // Skapar stängningsikonen för mörkt/ljust läge och lägger till den i appen.
    closeModeIconElm = document.createElement('img');
    closeModeIconElm.src = '../src/img/close_icon_1.png';
    closeModeIconElm.id = 'closeModeIcon';
    parent.appendChild(closeModeIconElm);

    // Skapar inställningsikonen och lägger till den i appen.
    settingsIconElm = document.createElement('img');
    settingsIconElm.src = '../src/img/settings_icon_1.png';
    settingsIconElm.id = 'settingsIcon';
    parent.appendChild(settingsIconElm);

    settingsIconElm.style.visibility = 'visible'; // Visar settings ikonen initialt.
    setTimeout(() => {
        settingsIconElm.classList.add('show'); // För att få en fade in effekt på settings ikonen.
    }, 0);

    // Skapar stängningsikonen för inställningsfältet och lägger till den i appen.
    closeSettingsIconElm = document.createElement('img');
    closeSettingsIconElm.src = '../src/img/close_icon_1.png';
    closeSettingsIconElm.id = 'closeSettingsIcon';
    parent.appendChild(closeSettingsIconElm);
    closeSettingsIconElm.style.visibility = 'hidden'; // Gömmer closeSettings ikonen initialt.

    this.getCookie = function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    // Lägg till denna metod för att läsa in temat från cookien när en instans av klassen skapas
    this.loadThemeFromCookie = function () {
        var theme = this.getCookie("theme");
        mode.detectIcons(settingsIconElm, closeModeIconElm, closeSettingsIconElm, portfolioIconElm);

        if (theme == "light") {
            mode.lightMode(theme);
        } else if (theme == "dark") {
            mode.darkMode(theme);
        }
    
        // Update icons based on the loaded theme
        mode.updateIcons(theme);
    }
    
    // Call the detect method after loading the theme from the cookie
    this.loadThemeFromCookie();

    // Metod för att skapa portföljikonen och lägga till den i appen.
    this.addPortfolioIcon = function (parentCont) {
        var portfolioIconDiv = document.createElement('div');
        portfolioIconDiv.id = 'portfolioIconDiv';
        parentCont.appendChild(portfolioIconDiv);

        var goToPortfolioText = document.createElement('p');
        goToPortfolioText.innerHTML = 'Visa portfölj';
        goToPortfolioText.id = 'goToPortfolioText';
        portfolioIconDiv.appendChild(goToPortfolioText);

        portfolioIcon = document.createElement('img');
        portfolioIcon.src = '../src/img/portfolio_icon1.png';
        portfolioIcon.id = 'portfolioIcon';
        portfolioIconDiv.appendChild(portfolioIconElm);
    }

    mode.detectIcons(settingsIconElm, closeModeIconElm, closeSettingsIconElm, portfolioIconElm); // Skickar med settings ikonen och stängningsikonen för mörkt/ljust läge till detectIcons metoden i DetectMode.js för att kunna ändra ikonerna beroende på vilket tema som är satt i användarens webbläsare.

    // Metod för att skapa inställningsfältet och lägga till det i appen.
    this.settingsIcon = function () {
        settingsIconElm.addEventListener('click', () => {
            overlay.style.display = 'block'; // Visa overlay när användaren klickar på settings ikonen och förhindra användaren från att klicka på andra delar av appen under tiden som settings fältet visas.
            settingsIconElm.classList.remove('show'); // Starta fade out övergång för settings ikonen.
            setTimeout(() => {
                settingsIconElm.style.visibility = 'hidden';
                closeSettingsIconElm.style.visibility = 'visible';
                closeSettingsIconElm.classList.add('show'); // Fade in closeSettings ikonen.
            }, 200); // Längden på övergången.
            this.createSettingsBar();
        });

        // Metod för att stänga inställningsfältet och ta bort det från appen.
        closeSettingsIconElm.addEventListener('click', () => {
            overlay.style.display = 'none'; // Dölj overlay när användaren klickar på closeSettings ikonen.
            closeSettingsIconElm.classList.remove('show'); // Starta fade out övergång för closeSettings ikonen.
            var settingsBar = document.getElementById('settingsBar');
            // Starta fade out övergång för settings fältet
            settingsBar.classList.remove('show');
            // Vänta tills övergången är klar och ta bort settings fältet från appen.
            setTimeout(() => {
                closeSettingsIconElm.style.visibility = 'hidden';
                settingsIconElm.style.visibility = 'visible';
                settingsIconElm.classList.add('show'); // Fade in settings ikonen.
                settingsBar.remove();
            }, 500); // Längden på övergången.
        });
    }

    // Metod för att skapa inställningsfältet och lägga till det i appen samt knappar för att ändra tema och rensa användare.
    this.createSettingsBar = function () {
        var settingsBar = document.createElement('div');
        settingsBar.id = 'settingsBar';
        parent.appendChild(settingsBar);

        // Starta fade in övergång för att visa settings fältet.
        setTimeout(() => {
            settingsBar.classList.add('show');
        }, 0);

        // Skapar knapp för att ändra tema och lägger till den i settings fältet.
        var adjustMode = document.createElement('button');
        adjustMode.innerHTML = 'Anpassa';
        adjustMode.className = 'buttons';
        adjustMode.id = 'adjustMode';
        settingsBar.appendChild(adjustMode);

        // Skapar knapp för att rensa cookies och lägger till den i settingsBar.
        var clearCookies = document.createElement('button');
        clearCookies.innerHTML = 'Rensa cookies';
        clearCookies.className = 'buttons';
        clearCookies.id = 'clearCookies';
        settingsBar.appendChild(clearCookies);
        clearCookies.addEventListener('click', () => {
            var cookies = document.cookie.split("; ");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                var eqPos = cookie.indexOf("=");
                var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            }
        });

        // Eventlyssnare för att visa meny med knappar för att ändra tema när användaren klickar på knappen för att ändra tema.
        adjustMode.addEventListener('click', () => {
            closeSettingsIconElm.classList.remove('show');
            var modeDiv = document.createElement('div'); // Skapar en ny div för att hålla knapparna för att ändra tema.
            modeDiv.id = 'modeDiv';
            settingsBar.appendChild(modeDiv);
            modeDiv.style.visibility = 'visible';
            setTimeout(() => {
                modeDiv.classList.add('show'); // Fade in modeDiv.
            }, 0);

            // Skapar knapp för att ändra till ljus visning och lägger till den i modeDiv.
            var lightMode = document.createElement('button');
            lightMode.innerHTML = 'Ljus visning';
            lightMode.className = 'buttons';
            lightMode.id = 'lightMode';
            modeDiv.appendChild(lightMode);
            lightMode.addEventListener('click', () => {
                mode.lightMode('light'); // Använder lightMode metoden i DetectMode.js för att ändra till ljus visning.
                document.cookie = "theme=light; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/"; // Sparar temat i en cookie
            });

            // Skapar knapp för att ändra till mörk visning och lägger till den i modeDiv.
            var darkMode = document.createElement('button');
            darkMode.innerHTML = 'Mörk visning';
            darkMode.className = 'buttons';
            darkMode.id = 'darkMode';
            modeDiv.appendChild(darkMode);
            darkMode.addEventListener('click', () => {
                mode.darkMode('dark'); // Använder darkMode metoden i DetectMode.js för att ändra till mörk visning.
                document.cookie = "theme=dark; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/"; // Sparar temat i en cookie
            });

            modeDiv.appendChild(closeModeIconElm);

            // Eventlyssnare för att stänga modeDiv menyn.
            closeModeIconElm.addEventListener('click', () => {
                closeSettingsIconElm.classList.add('show');
                modeDiv.classList.remove('show');
                setTimeout(() => {
                    modeDiv.style.visibility = 'hidden';
                    modeDiv.remove();
                    closeModeIconElm.remove();
                }, 200);
            });
        });
    }

    // Metod för att ta bort ikoner från appen när användaren har skapat en användare och satt budget. Metoden används av CreateUser.js klassen.
    this.removeIcons = function () {
        settingsIconElm.remove();
        closeSettingsIconElm.remove();
        closeModeIconElm.remove();
    }

    // Metod för att hämta inställningsikonerna för att kunna använda den i CreateUser.js för att appenda dem till rätt ställe i appen.
    this.getSettingsIconElm = function () {
        return settingsIconElm;
    }
}