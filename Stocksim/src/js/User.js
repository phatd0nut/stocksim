// Funktion för att skapa en användarklass
function User(name, initialBalance) {
    initialBalance = 0;
    this.name = name;
    this.balance = initialBalance;
    this.portfolio = new Portfolio();
}