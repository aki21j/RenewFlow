const APP_ID = "1584024947066184";
const CONFIG_ID = "1660579938757840";

// TODO: Replace with your Apps Script URL
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbz0g6Ac7gSXoSx6dPoVS8yS6SlS-hdPzfKJ2JlpE3aSpFCCCKnFfVALoc9ZXtc5RQeaQg/exec";

window.fbAsyncInit = function () {
    FB.init({
        appId: APP_ID,
        autoLogAppEvents: true,
        cookie: true,
        xfbml: true,
        version: "v25.0"
    });

    console.log("Facebook SDK initialized");
};

// Receive Embedded Signup events
window.addEventListener("message", (event) => {

    if (
        event.origin !== "https://www.facebook.com" &&
        event.origin !== "https://web.facebook.com"
    ) {
        return;
    }

    try {
        const data = JSON.parse(event.data);

        if (data.type === "WA_EMBEDDED_SIGNUP") {
            console.log("Embedded Signup Event:", data);

            document.getElementById("output").textContent =
                JSON.stringify(data, null, 2);
        }

    } catch (e) {
        // Ignore non-JSON messages
    }
});

function fbLoginCallback(response) {

    console.log(response);

    if (!response.authResponse) {
        alert("Login cancelled");
        return;
    }

    const code = response.authResponse.code;

    console.log("Authorization Code:", code);

    // We'll send this code to Apps Script in the next step.
    const form = new URLSearchParams();
    form.append("code", code);
    
    fetch(BACKEND_URL, {
        method: "POST",
        body: form
    })
    .then(async (r) => {
        const text = await r.text();
        console.log("Raw response:", text);
        return JSON.parse(text);
    })
    .then(data => {
        console.log(data);
        document.getElementById("output").textContent =
            JSON.stringify(data, null, 2);
    })
    .catch(console.error);
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