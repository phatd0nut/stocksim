// Funktion för att skapa en användarklass
function User(name) {
    var initialBalance = 0;
    this.name = name;
    this.balance = initialBalance;
    // this.portfolio = new Portfolio();

  console.log('User created: ' + this.name + ' with balance: ' + this.balance);
}