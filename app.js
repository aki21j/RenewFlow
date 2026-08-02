const APP_ID = "1584024947066184";
const CONFIG_ID = "36810299058616564";

const BACKEND_URL =
    "https://script.google.com/macros/s/AKfycbw8GR6kA3q60ZcSTkm-23mzE1GdfoocJoyU9FB3EBghmCNtGfwWByC5sQOOqwe7Mhqk_g/exec";

/* ---------------------------------------------------------- */
/* Facebook SDK                                                */
/* ---------------------------------------------------------- */

window.fbAsyncInit = function () {

    FB.init({
        appId: APP_ID,
        cookie: true,
        xfbml: false,
        version: "v25.0"
    });

    console.log("✅ Facebook SDK Initialised");

};

/* ---------------------------------------------------------- */
/* Embedded Signup Events                                      */
/* ---------------------------------------------------------- */

window.addEventListener("message", (event) => {

    console.log("======================================");
    console.log("POST MESSAGE");
    console.log("Origin:", event.origin);
    console.log("Raw Event:", event.data);

    if (
        event.origin !== "https://www.facebook.com" &&
        event.origin !== "https://web.facebook.com"
    ) {
        return;
    }

    try {

        const data =
            typeof event.data === "string"
                ? JSON.parse(event.data)
                : event.data;

        console.log("Parsed Event:");
        console.log(data);

    } catch (err) {

        console.log("Non JSON message.");

    }

});

/* ---------------------------------------------------------- */
/* Backend Callback                                            */
/* ---------------------------------------------------------- */

window.handleBackendResponse = function (data) {

    console.log("======================================");
    console.log("BACKEND RESPONSE");
    console.log(data);

    document.getElementById("output").textContent =
        JSON.stringify(data, null, 2);

    window.history.replaceState(
        {},
        document.title,
        window.location.pathname
    );

    const script =
        document.getElementById("jsonp-script");

    if (script) {

        script.remove();

    }

    console.log("✅ Backend Finished");

};

/* ---------------------------------------------------------- */
/* Handle Redirect                                              */
/* ---------------------------------------------------------- */

window.addEventListener("load", () => {

    console.log("======================================");
    console.log("RenewFlow Loaded");

    const params =
        new URLSearchParams(window.location.search);

    const code =
        params.get("code");

    if (!code) {

        console.log("No OAuth code present.");
        return;

    }

    console.log("OAuth Code Found");
    console.log(code);

    document.getElementById("output").textContent =
        "Exchanging authorization code...";

    const script =
        document.createElement("script");

    script.id = "jsonp-script";

    script.src =
        `${BACKEND_URL}?code=${encodeURIComponent(code)}&callback=handleBackendResponse`;

    script.onerror = () => {

        console.error("Apps Script failed.");

    };

    document.body.appendChild(script);

});

/* ---------------------------------------------------------- */
/* Launch Embedded Signup                                      */
/* ---------------------------------------------------------- */

document
    .getElementById("connectBtn")
    .addEventListener("click", () => {

        console.log("======================================");
        console.log("Launching Embedded Signup");

        FB.login(

            function (response) {

                console.log("======================================");
                console.log("FB.LOGIN CALLBACK");
                console.log(response);

                if (!response.authResponse) {

                    console.log("User cancelled.");

                    return;

                }

                console.log("Auth Response");
                console.log(response.authResponse);

            },

            {

                config_id: CONFIG_ID,

                response_type: "code",

                override_default_response_type: true,

                extras: {

                    sessionInfoVersion: 3,

                    featureType:
                        "whatsapp_business_app_onboarding",

                    setup: {}

                }

            }

        );

    });