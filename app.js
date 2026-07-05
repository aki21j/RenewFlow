const APP_ID = "1584024947066184";
// CRITICAL: Use the Configuration ID of your "General Login / User access token" config here!
const CONFIG_ID = "36810299058616564"; 
const REDIRECT_URI = "https://aki21j.github.io/RenewFlow/";
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbz0g6Ac7gSXoSx6dPoVS8yS6SlS-hdPzfKJ2JlpE3aSpFCCCKnFfVALoc9ZXtc5RQeaQg/exec";

// 1. Check if the URL contains an OAuth code on page load
window.onload = function() {
    console.log("WINDOW LOADED-----!!!!!!!!!");
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log("CODE:", code);

    if (code) {
        console.log("Found OAuth Code in URL:", code);
        document.getElementById("output").textContent = "Exchanging code with backend...";

        const form = new URLSearchParams();
        form.append("code", code);

        // Send code to Google Apps Script
        fetch(BACKEND_URL, {
            method: "POST",
            body: form
        })
        .then(r => r.json())
        .then(data => {
            console.log("Backend Response:", data);
            document.getElementById("output").textContent = JSON.stringify(data, null, 2);
        })
        .catch(err => {
            console.error("Fetch Error:", err);
            document.getElementById("output").textContent = "Error: " + err;
        });
    }
};

// 2. Trigger a clean web redirect instead of using unstable popups
document.getElementById("connectBtn").onclick = () => {
    console.log("CONNECT BTN CLICKED-----!!!!!!!!!");
    const oauthUrl = `https://www.facebook.com/v25.0/dialog/oauth?` +
                     `client_id=${APP_ID}` +
                     `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
                     `&config_id=${CONFIG_ID}` +
                     `&response_type=code` +
                     `&scope=whatsapp_business_management,whatsapp_business_messaging`;
    
    console.log("Redirecting to Meta OAuth...");
    window.location.href = oauthUrl;
};