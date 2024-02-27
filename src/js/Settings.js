function Settings(parent, detectMode) {
    var mode = detectMode;
    var overlay = document.createElement('div');
    overlay.id = 'overlay';
    parent.appendChild(overlay);
    var settingsIconElm, closeModeIconElm, closeSettingsIconElm;

    closeModeIconElm = document.createElement('img');
    closeModeIconElm.src = '../src/img/close_icon_1.png';
    closeModeIconElm.id = 'closeModeIcon';
    parent.appendChild(closeModeIconElm);

    settingsIconElm = document.createElement('img');
    settingsIconElm.src = '../src/img/settings_icon_1.png';
    settingsIconElm.id = 'settingsIcon';
    parent.appendChild(settingsIconElm);

    settingsIconElm.style.visibility = 'visible'; // Make the settings icon visible initially
    setTimeout(() => {
        settingsIconElm.classList.add('show'); // Fade in the settings icon
    }, 0);

    closeSettingsIconElm = document.createElement('img');
    closeSettingsIconElm.src = '../src/img/close_icon_1.png';
    closeSettingsIconElm.id = 'closeSettingsIcon';
    parent.appendChild(closeSettingsIconElm);
    closeSettingsIconElm.style.visibility = 'hidden'; // Hide the closeSettings icon initially

    mode.detectIcons(settingsIconElm, closeModeIconElm, closeSettingsIconElm);

    this.settingsIcon = function () {
        settingsIconElm.addEventListener('click', () => {
            settingsIconElm.classList.remove('show'); // Start the fade out transition for settings icon
            setTimeout(() => {
                settingsIconElm.style.visibility = 'hidden'; // Hide the settings icon after the transition
                closeSettingsIconElm.style.visibility = 'visible'; // Show the closeSettings icon
                closeSettingsIconElm.classList.add('show'); // Fade in the closeSettings icon
            }, 200); // The duration of your transition
            this.createSettingsBar();
        });

        closeSettingsIconElm.addEventListener('click', () => {
            closeSettingsIconElm.classList.remove('show'); // Start the fade out transition for closeSettings icon
            var settingsBar = document.getElementById('settingsBar');
            // Hide the bar
            settingsBar.classList.remove('show');
            // Wait for the transition to finish before removing the bar and hiding the closeSettings icon
            setTimeout(() => {
                closeSettingsIconElm.style.visibility = 'hidden'; // Hide the closeSettings icon after the transition
                settingsIconElm.style.visibility = 'visible'; // Show the settings icon
                settingsIconElm.classList.add('show'); // Fade in the settings icon
                settingsBar.remove();
            }, 500); // The duration of your transition
        });
    }

    this.createSettingsBar = function () {
        var settingsBar = document.createElement('div');
        settingsBar.id = 'settingsBar';
        parent.appendChild(settingsBar);

        // Show the bar
        setTimeout(() => {
            settingsBar.classList.add('show');
        }, 0);

        var adjustMode = document.createElement('button');
        adjustMode.innerHTML = 'Anpassa';
        adjustMode.className = 'buttons';
        adjustMode.id = 'adjustMode';
        settingsBar.appendChild(adjustMode);

        adjustMode.addEventListener('click', () => {
            closeSettingsIconElm.classList.remove('show');
            overlay.style.display = 'block';
            var modeDiv = document.createElement('div');
            modeDiv.id = 'modeDiv';
            settingsBar.appendChild(modeDiv);
            modeDiv.style.visibility = 'visible';
            setTimeout(() => {
                modeDiv.classList.add('show'); // Fade in the modeDiv
            }, 0);

            var lightMode = document.createElement('button');
            lightMode.innerHTML = 'Ljus visning';
            lightMode.className = 'buttons';
            lightMode.id = 'lightMode';
            modeDiv.appendChild(lightMode);
            lightMode.addEventListener('click', () => {
                mode.lightMode();
            });

            var darkMode = document.createElement('button');
            darkMode.innerHTML = 'Mörk visning';
            darkMode.className = 'buttons';
            darkMode.id = 'darkMode';
            modeDiv.appendChild(darkMode);
            darkMode.addEventListener('click', () => {
                mode.darkMode();
            });

            modeDiv.appendChild(closeModeIconElm);

            closeModeIconElm.addEventListener('click', () => {
                closeSettingsIconElm.classList.add('show'); // Start the fade out transition for closeModeIcon icon
                modeDiv.classList.remove('show');
                setTimeout(() => {
                    modeDiv.style.visibility = 'hidden'; // Hide the modeDiv after the transition
                    modeDiv.remove();
                    closeModeIconElm.remove();
                }, 200); // The duration of your transition
                // Rest of your code...

                overlay.style.display = 'none';
            });
        });

        var clearCookies = document.createElement('button');
        clearCookies.innerHTML = 'Rensa användare';
        clearCookies.className = 'buttons';
        clearCookies.id = 'clearCookies';
        settingsBar.appendChild(clearCookies);
    }

    this.getSettingsIconElm = function() {
        return settingsIconElm;
    }
}