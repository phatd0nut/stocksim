function Portfolio() {
    this.stocks = [];
}

// Metod för att köpa aktier
Portfolio.prototype.buyStock = function(stock, quantity) {
    // Implementera logiken för att köpa aktier här
    // T.ex. lägg till aktien i portföljen och uppdatera användarens kontosaldo
};

// Metod för att sälja aktier
Portfolio.prototype.sellStock = function(stock, quantity) {
    // Implementera logiken för att sälja aktier här
    // T.ex. ta bort aktien från portföljen och uppdatera användarens kontosaldo
};

// Metod för att visa portföljen
Portfolio.prototype.displayPortfolio = function() {
    // Implementera logiken för att visa portföljen här
    // T.ex. skapa och fyll en HTML-tabell med användarens aktier och deras prestanda
};
