const APP_ID = "1584024947066184";
const CONFIG_ID = "1660579938757840";

// TODO: Replace with your Apps Script URL
const BACKEND_URL = "YOUR_APPS_SCRIPT_URL";

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

    document.getElementById("output").textContent =
        "Authorization Code:\n\n" + code;

    // We'll send this code to Apps Script in the next step.
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