// Klass för att skapa logotypen för appen.
function Logo() {
    this.createLogo = function (container) {
        this.appLogo = document.createElement('img');
        this.appLogo.src = 'src/img/stocksim_cropped3.png';
        this.appLogo.id = 'appLogo';
        container.appendChild(this.appLogo);
        this.backToStart();
    }

    // Metod för att ladda om appen när användaren klickar på loggan.
    this.backToStart = function () {
        this.appLogo.addEventListener('click', () => {
            location.reload();
        });
    }
}