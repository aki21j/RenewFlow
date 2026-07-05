const APP_ID = "1584024947066184";
// CRITICAL: Use the Configuration ID of your "General Login / User access token" config here!
const CONFIG_ID = "36810299058616564"; 
const REDIRECT_URI = "https://aki21j.github.io/RenewFlow/";
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbzk24o9h3HhvHROCYInrMMGPugZkuzj2OrFNLMWUjnHH423WO2V0q6R3txgGTD99-e-rQ/exec";

// 1. Define the Global JSONP Callback Handler
window.handleBackendResponse = function(data) {
    console.log("=== RECEIVED RESPONSE ===");
    console.log(data);
    document.getElementById("output").textContent = JSON.stringify(data, null, 2);
    
    const jsonpScript = document.getElementById("jsonp-payload");
    if (jsonpScript) jsonpScript.remove();
};

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        console.log("Found OAuth Code in URL:", code);
        document.getElementById("output").textContent = "Exchanging validation token data...";

        const jsonpUrl = `${BACKEND_URL}?code=${encodeURIComponent(code)}&callback=handleBackendResponse`;

        const script = document.createElement("script");
        script.id = "jsonp-payload";
        script.src = jsonpUrl;
        script.onerror = function() {
            document.getElementById("output").textContent = "Script payload parsing mismatch.";
        };
        
        document.body.appendChild(script);
    }
};

document.getElementById("connectBtn").onclick = () => {
    const oauthUrl = `https://www.facebook.com/v25.0/dialog/oauth?` +
                     `client_id=${APP_ID}` +
                     `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
                     `&config_id=${CONFIG_ID}` +
                     `&response_type=code` +
                     `&scope=whatsapp_business_management,whatsapp_business_messaging`;
    
    window.location.href = oauthUrl;
};