const APP_ID = "1584024947066184";
const CONFIG_ID = "1660579938757840";
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbz0g6Ac7gSXoSx6dPoVS8yS6SlS-hdPzfKJ2JlpE3aSpFCCCKnFfVALoc9ZXtc5RQeaQg/exec";

window.fbAsyncInit = function () {
    FB.init({
        appId: APP_ID,
        autoLogAppEvents: true,
        cookie: true,
        xfbml: true,
        version: "v25.0"
    });
    console.log("Facebook SDK initialized-----!!!!");
};

// This listener handles the data from the Embedded Signup popup
window.addEventListener("message", function(event) {
    // 1. Only accept messages from trusted Meta domains
    if (!event.origin.includes("facebook.com")) return;

    // 2. The data is a URL-encoded string, not JSON
    if (typeof event.data !== 'string') return;

    console.log("Raw Message Data:", event.data);

    // 3. Use URLSearchParams to extract the code from the query string
    const params = new URLSearchParams(event.data);
    const code = params.get("code");

    console.log("CODE:", code);

    if (code) {
        console.log("Extracted Code successfully:", code);

        // 4. Send to backend
        fetch(BACKEND_URL, {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ code: code })
        })
        .then(r => r.json())
        .then(result => {
            console.log("Backend Success:", result);
            document.getElementById("output").textContent = JSON.stringify(result, null, 2);
        })
        .catch(err => {
            console.error("Backend Error:", err);
            document.getElementById("output").textContent = "Backend Error: " + err;
        });
    } else {
        console.log("Message received but no code found in params.");
    }
});

// Empty callback - the real work is done in the message listener
function fbLoginCallback(response) {
    console.log("FB Login state updated:", response.status);
}

document.getElementById("connectBtn").onclick = () => {
    // Use FB.ui instead of FB.login
    FB.ui({
        display: 'popup',
        method: 'whatsapp_embedded_signup',
        config_id: CONFIG_ID,
        callback: (response) => {
            console.log("Embedded Signup Response:", response);
            if (response.status === 'success') {
                // The signup was successful. 
                // You do NOT need to exchange a code for a token manually.
                // Meta handles the linkage on their backend.
                document.getElementById("output").textContent = "Successfully connected! Phone number ID: " + response.phone_number_id;
            } else {
                console.log("Signup failed or cancelled:", response);
            }
        }
    });
};