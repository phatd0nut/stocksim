// Funktion för att skapa en aktieklass
function Stock(stockPrice, symbol, name, price, quantity) {
    this.priceData = stockPrice;
    this.symbol = symbol;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.historicalPrice = []; // Array för att lagra aktiens pris över tid
    this.amountInvested = this.price * this.quantity;
}


Stock.prototype.setClosingPrice = function () {
    // Beräkna change och changePercent
    var change = this.price - this.priceData.lastClosingPrice;
    var changePercent = (change / this.priceData.lastClosingPrice) * 100;

    // Om change eller changePercent är NaN, sätt dem till 'N/A'
    if (isNaN(change)) {
        change = 'N/A';
    }
    if (isNaN(changePercent)) {
        changePercent = 'N/A';
    }

    // Skapa ett nytt objekt med stängningspriset och lägg till det i this.historicalPrice arrayen
    var closingPriceObj = {
        date: new Date().toISOString().split('T')[0],
        name: this.name,
        close: this.priceData.lastClosingPrice,
        change: change,
        changePercent: changePercent,
        label: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };
    this.historicalPrice.push(closingPriceObj);

    // Begränsa storleken på this.historicalPrice till 365 priser
    while (this.historicalPrice.length > 365) {
        this.historicalPrice.shift();
    }
};

Stock.prototype.startUpdatingClosingPrice = function () {
    // Sätt timmen och minuten för när amerikanska börsen stänger
    var closingHour = 22; // 5 PM
    var closingMinute = 0;

    // Skapa en Date-objekt för nuvarande tid
    var now = new Date();

    // Skapa en Date-objekt för när börsen stänger idag
    var closingTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), closingHour, closingMinute);

    // Om börsen redan har stängt idag, sätt closingTime till imorgon
    if (now.getTime() > closingTimeToday.getTime()) {
        closingTimeToday.setDate(closingTimeToday.getDate() + 1);
    }

    // Om börsen är öppen, uppdatera stängningspriset direkt
    var openingHour = 15; // 3 PM
    var openingTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), openingHour, 0);
    if (now.getTime() > openingTimeToday.getTime() && now.getTime() < closingTimeToday.getTime()) {
        this.setClosingPrice();
    }

    // Beräkna hur många millisekunder det är kvar till closingTime
    var msUntilClosingTime = closingTimeToday.getTime() - now.getTime();

    // Sätt en timer för att börja uppdatera stängningspriset vid closingTime
    setTimeout(() => {
        // Uppdatera stängningspriset
        this.setClosingPrice();

        // Sätt en intervall för att uppdatera stängningspriset varje 24 timmar
        setInterval(() => {
            this.setClosingPrice();
        }, 24 * 60 * 60 * 1000);
    }, msUntilClosingTime);
};

