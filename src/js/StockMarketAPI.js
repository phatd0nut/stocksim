// Enkel klass för att hämta API-nyckeln för att använda i andra klasser som behöver den. API-nyckel är från Financial Modeling Prep (https://financialmodelingprep.com/developer/docs/).
function StockMarketAPI() {
    // Privat funktion för att returnera API-nyckeln
    function getApiKey() {
        return '901b884f4298a5f73b8d8176dd2c3d37';
    }

    var getKey = getApiKey;
    return getKey
}