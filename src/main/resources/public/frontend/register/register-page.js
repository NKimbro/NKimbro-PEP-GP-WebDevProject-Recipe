/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
var registerButton = document.getElementById("register-button");
var usernameInput = document.getElementById("username-input");
var emailInput = document.getElementById("email-input");
var passwordInput = document.getElementById("password-input");
var repeatPasswordInput = document.getElementById("repeat-password-input");

/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
registerButton.onclick = processRegistration;


/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration() {
    if (usernameInput == "" || emailInput == "" || passwordInput == "") alert("Fill all input fields!");
    else if ( passwordInput != repeatPasswordInput) alert("Ensure repeated password is correct!");
    else {
        const registerBody = { usernameInput, emailInput, passwordInput };

        const requestOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(registerBody)
        };
        try {
            const response = await fetch('${BASE_URL}/register', requestOptions);
        l
            if (response.status == 201) {
                window.location.href = "../login/login-page.html";
            } else if (response.status == 409) {
              alert("An account with that username or email already exists.");
            } else {
                alert("Unknown registration error occured.");
            }
          } catch (error) {
            // Handle network or other errors
            console.error('Error:', error);
          }
    }
    
}
