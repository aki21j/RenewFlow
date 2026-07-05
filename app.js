const APP_ID = "1584024947066184";
const CONFIG_ID = "1660579938757840";

const BACKEND_URL =
    "https://script.google.com/macros/s/AKfycbz0g6Ac7gSXoSx6dPoVS8yS6SlS-hdPzfKJ2JlpE3aSpFCCCKnFfVALoc9ZXtc5RQeaQg/exec";

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

window.addEventListener("message", (event) => {

    if (
        event.origin !== "https://www.facebook.com" &&
        event.origin !== "https://web.facebook.com"
    ) {
        return;
    }

    try {

        const data = JSON.parse(event.data);

        console.log("POST MESSAGE");
        console.log(data);

        if (data.type === "WA_EMBEDDED_SIGNUP") {

            document.getElementById("output").textContent =
                JSON.stringify(data, null, 2);

        }

    } catch (err) {
        // ignore
    }

});

function fbLoginCallback(response) {

    console.log("===== FB LOGIN RESPONSE =====");
    console.log(JSON.stringify(response, null, 2));

    if (!response.authResponse) {
        alert("Login cancelled");
        return;
    }

    const code = response.authResponse.code;

    console.log("Authorization Code:");
    console.log(code);

    const form = new URLSearchParams();
    form.append("code", code);

    fetch(BACKEND_URL, {
        method: "POST",
        body: form
    })
    .then(async (r) => {

        const text = await r.text();

        console.log("===== BACKEND RESPONSE =====");
        console.log(text);

        return JSON.parse(text);

    })
    .then(data => {

        console.log("===== PARSED RESPONSE =====");
        console.log(data);

        document.getElementById("output").textContent =
            JSON.stringify(data, null, 2);

    })
    .catch(console.error);

}

document.getElementById("connectBtn").onclick = () => {

    console.log("==================================");
    console.log("window.location.href");
    console.log(window.location.href);

    console.log("window.location.origin");
    console.log(window.location.origin);

    console.log("window.location.pathname");
    console.log(window.location.pathname);

    console.log("==================================");

    FB.login(fbLoginCallback, {
        config_id: CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        extras: {
            setup: {}
        }
    });

};