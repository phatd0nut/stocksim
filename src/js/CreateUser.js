function CreateUser(container) {
    this.parentContainer = container;

    this.createUserBox = function() {
        var createUserDiv = document.createElement('div');
        createUserDiv.className = 'createUserDiv';
        this.parentContainer.appendChild(createUserDiv);

        var h2 = document.createElement('h2');
        h2.innerHTML = 'Fyll i ditt namn för att fortsätta';
        h2.className = 'h2instructions';
        createUserDiv.appendChild(h2);

        var inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.placeholder = 'Ange namn här';
        inputName.className = 'inputBars inputName';
        inputName.name = 'name';
        createUserDiv.appendChild(inputName);

        var createUserBtn = document.createElement('button');
        createUserBtn.className = 'buttons createUserBtn';
        createUserBtn.innerHTML = 'Tryck för att påbörja';
        createUserDiv.appendChild(createUserBtn);

        createUserBtn.addEventListener('click', () => {
            var name = inputName.value;
            var createNewU = new User(name, this.parentContainer);
            createNewU.userInterface();
            createUserDiv.remove();
        });
    }
}