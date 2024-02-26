function Settings(parent, detectMode) {
    var mode = detectMode;
    var overlay = document.createElement('div');
    overlay.id = 'overlay';
    parent.appendChild(overlay);

    this.settingsIcon = function () {
        var settingsIcon = document.createElement('img');
        settingsIcon.src = '../src/img/settings_icon_2.png';
        settingsIcon.id = 'settingsIcon';
        parent.appendChild(settingsIcon);
        settingsIcon.style.visibility = 'visible'; // Make the settings icon visible initially
        setTimeout(() => {
            settingsIcon.classList.add('show'); // Fade in the settings icon
        }, 0);

        var closeSettings = document.createElement('p');
        closeSettings.innerHTML = '🗙';
        closeSettings.id = 'closeSettings';
        parent.appendChild(closeSettings);
        closeSettings.style.visibility = 'hidden'; // Hide the closeSettings icon initially

        settingsIcon.addEventListener('click', () => {
            settingsIcon.classList.remove('show'); // Start the fade out transition for settings icon
            setTimeout(() => {
                settingsIcon.style.visibility = 'hidden'; // Hide the settings icon after the transition
                closeSettings.style.visibility = 'visible'; // Show the closeSettings icon
                closeSettings.classList.add('show'); // Fade in the closeSettings icon
            }, 200); // The duration of your transition
            this.createSettingsBar();
        });

        closeSettings.addEventListener('click', () => {
            closeSettings.classList.remove('show'); // Start the fade out transition for closeSettings icon
            var settingsBar = document.getElementById('settingsBar');
            // Hide the bar
            settingsBar.classList.remove('show');
            // Wait for the transition to finish before removing the bar and hiding the closeSettings icon
            setTimeout(() => {
                closeSettings.style.visibility = 'hidden'; // Hide the closeSettings icon after the transition
                settingsIcon.style.visibility = 'visible'; // Show the settings icon
                settingsIcon.classList.add('show'); // Fade in the settings icon
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
            closeSettings.classList.remove('show');
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

            var closeMode = document.createElement('p');
            closeMode.innerHTML = '🗙';
            closeMode.id = 'closeMode';
            modeDiv.appendChild(closeMode);

            closeMode.addEventListener('click', () => {
                closeSettings.classList.add('show'); // Start the fade out transition for closeMode icon
                modeDiv.classList.remove('show');
                setTimeout(() => {
                    modeDiv.style.visibility = 'hidden'; // Hide the modeDiv after the transition
                    modeDiv.remove();
                    closeMode.remove();
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
}