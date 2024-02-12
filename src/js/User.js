// Funktion för att skapa en användarklass
function User(name) {
    var initialBalance = 0;
    this.name = name;
    this.balance = initialBalance;
    // this.portfolio = new Portfolio();

    window.addEventListener('load', function() {
        // Läs namnet från LocalStorage
        var name = localStorage.getItem('name');
        // Visa namnet på sidan
      console.log(name);
    });
}