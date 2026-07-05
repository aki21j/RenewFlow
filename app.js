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
    // Only accept messages from trusted Meta domains
    if (!event.origin.includes("facebook.com")) return;
    console.log("MESSAGE RECEIVED:", event);
    console.log("DATA:", event.data);

    try {
        const data = (typeof event.data === 'string') ? JSON.parse(event.data) : event.data;

        if (data.type === "WA_EMBEDDED_SIGNUP") {
            console.log("WA_EMBEDDED_SIGNUP received:", data);

            // Display raw data for debugging
            document.getElementById("output").textContent = JSON.stringify(data, null, 2);

            // Trigger the backend exchange here
            if (data.code) {
                const form = new URLSearchParams();
                form.append("code", data.code);

                fetch(BACKEND_URL, {
                    method: "POST",
                    body: form
                })
                .then(r => r.json())
                .then(result => {
                    console.log("Backend Success:", result);
                    document.getElementById("output").textContent = "Success!\n" + JSON.stringify(result, null, 2);
                })
                .catch(err => {
                    console.error("Backend Error:", err);
                    document.getElementById("output").textContent = "Backend Error: " + err;
                });
            }
        }
    }
    catch(err) {
        console.log("Ignored non-JSON message");
    }
});

// Empty callback - the real work is done in the message listener
function fbLoginCallback(response) {
    console.log("FB Login state updated:", response.status);
}

document.getElementById("connectBtn").onclick = () => {
    FB.login(fbLoginCallback, {
        config_id: CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        extras: {
            sessionInfoVersion: "3"
        }
    });
};