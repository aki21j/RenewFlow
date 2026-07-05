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

    console.log("================================");
    console.log("Facebook SDK initialized!!!!");
    console.log("================================");
};

window.addEventListener("message", function(event) {

    console.log("========== MESSAGE ==========");
    console.log("Origin:");
    console.log(event.origin);

    console.log("Raw Data:");
    console.log(event.data);

    try {

        const data = JSON.parse(event.data);

        console.log("Parsed:");
        console.log(data);

        if (data.type === "WA_EMBEDDED_SIGNUP") {

            console.log("WA_EMBEDDED_SIGNUP EVENT");

            document.getElementById("output").textContent =
                JSON.stringify(data, null, 2);

        }

    }
    catch(err) {

        console.log("Not JSON");

    }

});

function fbLoginCallback(response) {

    console.log("========== FB LOGIN ==========");
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

    console.log("FORM code:", code);

    fetch(BACKEND_URL, {

        method: "POST",
        body: form

    })
    .then(async r => {

        const text = await r.text();

        console.log("========== BACKEND ==========");
        console.log(text);

        return JSON.parse(text);

    })
    .then(data => {

        console.log("========== PARSED ==========");
        console.log(data);

        document.getElementById("output").textContent =
            JSON.stringify(data, null, 2);

    })
    .catch(console.error);

}

document.getElementById("connectBtn").onclick = () => {

    console.log("================================");
    console.log("Current URL");
    console.log(window.location.href);

    console.log("Origin");
    console.log(window.location.origin);

    console.log("Path");
    console.log(window.location.pathname);
    console.log("================================");

    FB.login(fbLoginCallback, {
        config_id: CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        redirect_uri: "https://aki21j.github.io/RenewFlow", // Explicitly set it here
        extras: { sessionInfoVersion: "3" }
    });

};