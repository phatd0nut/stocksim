function DetectMode(container) {
    this.container = container;
    this.lightMode = function () {
        this.container.style.backgroundColor = '#278664';
    }

    this.darkMode = function () {
        this.container.style.backgroundColor = '#4e594a';
    }

    this.detect = function () {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.darkMode();
        } else {
            this.lightMode();
        }
    }
}