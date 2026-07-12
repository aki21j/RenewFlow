const APP_ID = "1584024947066184";
const CONFIG_ID = "36810299058616564";

const REDIRECT_URI =
    "https://aki21j.github.io/RenewFlow/";

const BACKEND_URL =
    "https://script.google.com/macros/s/AKfycbxQKP4F-pWWrccsbSYaUNkkkdMgRVveORRqQb07mtSLnxxByD7b4Jjz8VT5qRPj8tRrwA/exec";

window.handleBackendResponse = function (data) {

    console.log("========== BACKEND RESPONSE ==========");
    console.log(data);

    document.getElementById("output").textContent =
        JSON.stringify(data, null, 2);

    // Remove OAuth code from URL
    window.history.replaceState(
        {},
        document.title,
        window.location.pathname
    );

    // Remove JSONP script
    const script = document.getElementById("jsonp-script");

    if (script) {
        script.remove();
    }

    console.log("✅ RenewFlow onboarding completed.");

};

window.addEventListener("load", () => {

    console.log("RenewFlow loaded.");

    const params = new URLSearchParams(window.location.search);

    const code = params.get("code");

    if (!code) {
        console.log("Waiting for user authentication...");
        return;
    }

    console.log("Received OAuth code.");

    document.getElementById("output").textContent =
        "Connecting to WhatsApp...";

    const script = document.createElement("script");

    script.id = "jsonp-script";

    script.src =
        `${BACKEND_URL}?code=${encodeURIComponent(code)}&callback=handleBackendResponse`;

    script.onerror = () => {

        console.error("Backend request failed.");

        document.getElementById("output").textContent =
            "Unable to reach backend.";

    };

    document.body.appendChild(script);

});

document
    .getElementById("connectBtn")
    .addEventListener("click", () => {

        console.log("Opening Meta OAuth...");

        const oauthUrl =
            "https://www.facebook.com/v25.0/dialog/oauth?" +
            "client_id=" + encodeURIComponent(APP_ID) +
            "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) +
            "&config_id=" + encodeURIComponent(CONFIG_ID) +
            "&response_type=code" +
            "&scope=whatsapp_business_management,whatsapp_business_messaging";

        window.location.href = oauthUrl;

    });