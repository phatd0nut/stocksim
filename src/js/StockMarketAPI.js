// Enkel klass för att hämta API-nyckeln för att använda i andra klasser som behöver den. API-nyckel är från Financial Modeling Prep (https://financialmodelingprep.com/developer/docs/).
function StockMarketAPI() {
    // Privat funktion för att returnera API-nyckeln. 2 nycklar finns i klassen. En för att använda i appen och en för att använda i testning.
    function getApiKey() {
        // return '901b884f4298a5f73b8d8176dd2c3d37';
        return '21164a115dd96718a1854b227ce334fb';
    }
    
    var getKey = getApiKey;
    return getKey
}