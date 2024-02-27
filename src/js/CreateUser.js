function CreateUser(container, settings) {
    this.parentContainer = container;
    this.settings = settings;

    this.createUserBox = function() {
        this.createUserDiv = document.createElement('div');
        this.createUserDiv.className = 'createUserDiv';
        this.parentContainer.insertBefore(this.createUserDiv, this.settings.getSettingsIconElm());

        this.h2 = document.createElement('h2');
        this.h2.innerHTML = 'Fyll i ditt namn för att fortsätta';
        this.h2.className = 'h2instructions';
        this.createUserDiv.appendChild(this.h2);

        this.inputName = document.createElement('input');
        this.inputName.type = 'text';
        this.inputName.placeholder = 'Ange namn här';
        this.inputName.className = 'inputBars inputName';
        this.inputName.name = 'name';
        this.createUserDiv.appendChild(this.inputName);

        this.createUserBtn = document.createElement('button');
        this.createUserBtn.className = 'buttons createUserBtn';
        this.createUserBtn.innerHTML = 'Tryck för att påbörja';
        this.createUserDiv.appendChild(this.createUserBtn);

        this.createUserBtn.addEventListener('click', () => {
            var name = this.inputName.value;
            if (name !== '') { // Check if input is not empty
                var createNewU = new User(name, this.parentContainer, this.settings);
                createNewU.userInterface();
                this.createUserDiv.remove();
            } else {
                this.h2.innerHTML = 'Namn saknas, försök igen';
            }
        });
    }
}
