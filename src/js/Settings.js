// Inställningsklassen som skapar inställningsikonen och inställningsfältet i appen. Används för att byta tema och rensa användare. Tar emot parent och detectMode som argument för att kunna appenda innehåll till denna div senare i koden och för att kunna använda detectMode klassen i Settings klassen.
function Settings(parent, detectMode) {
    var mode = detectMode;
    var overlay = document.createElement('div'); // Skapar en div för att använda som overlay när användaren klickar på inställningsikonen.
    overlay.id = 'overlay';
    parent.appendChild(overlay);
    var settingsIconElm, closeModeIconElm, closeSettingsIconElm; // Deklarerar variabler för att använda i metoder nedan. Dessa variabler används för att representera ikoner i appen.

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

    mode.detectIcons(settingsIconElm, closeModeIconElm, closeSettingsIconElm); // Skickar med settings ikonen och stängningsikonen för mörkt/ljust läge till detectIcons metoden i DetectMode.js för att kunna ändra ikonerna beroende på vilket tema som är satt i användarens webbläsare.

    // Metod för att skapa inställningsfältet och lägga till det i appen.
    this.settingsIcon = function () {
        settingsIconElm.addEventListener('click', () => {
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

        // Eventlyssnare för att visa meny med knappar för att ändra tema när användaren klickar på knappen för att ändra tema.
        adjustMode.addEventListener('click', () => {
            closeSettingsIconElm.classList.remove('show');
            overlay.style.display = 'block';
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
                mode.lightMode(); // Använder lightMode metoden i DetectMode.js för att ändra till ljus visning.
            });

            // Skapar knapp för att ändra till mörk visning och lägger till den i modeDiv.
            var darkMode = document.createElement('button');
            darkMode.innerHTML = 'Mörk visning';
            darkMode.className = 'buttons';
            darkMode.id = 'darkMode';
            modeDiv.appendChild(darkMode);
            darkMode.addEventListener('click', () => {
                mode.darkMode(); // Använder darkMode metoden i DetectMode.js för att ändra till mörk visning.
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
                overlay.style.display = 'none';
            });
        });

        // Skapar knapp för att rensa användare och lägger till den i settings fältet.
        var clearCookies = document.createElement('button');
        clearCookies.innerHTML = 'Rensa användare';
        clearCookies.className = 'buttons';
        clearCookies.id = 'clearCookies';
        settingsBar.appendChild(clearCookies);
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