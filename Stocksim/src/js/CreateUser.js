function CreateUser(container) {
    this.parentContainer = container;

    this.createUserBox = function() {
        var createUserDiv = document.createElement('div');
        createUserDiv.className = 'createUserDiv';
        this.parentContainer.appendChild(createUserDiv);

        var h2 = document.createElement('h2');
        h2.innerHTML = 'Hej, fyll i ditt namn för att fortsätta';
        h2.className = 'h2instructions';
        createUserDiv.appendChild(h2);

        var inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.placeholder = 'Ange namn här';
        inputName.className = 'inputName';
        createUserDiv.appendChild(inputName);

        var createUserBtn = document.createElement('button');
        createUserBtn.className = 'createUserBtn';
        createUserBtn.innerHTML = 'Tryck för att påbörja';
        createUserDiv.appendChild(createUserBtn);

        createUserBtn.addEventListener('click', function() {
            var name = inputName.value;
            var createNewU = new User(name);
            window.location.href = '../../menu.html';
            
        });
    }

    this.createUserBox(this.parentContainer);
}