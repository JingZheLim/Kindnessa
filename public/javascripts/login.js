document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('login-form');
    var errorMessage = document.querySelector('.error-message');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting

        // Get the values from the input fields
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        // Create new AJAX request
        var xhttp = new XMLHttpRequest();
        // Open connection
        xhttp.open("POST", "/login", true);

        // Set up the data to send with the request
        const data = {
            email: email,
            password: password
        };

        // Convert data to JSON format
        const jsonData = JSON.stringify(data);

        // Set headers
        xhttp.setRequestHeader("Content-Type", "application/json");

        // Send request
        xhttp.send(jsonData);

        // Define function that runs on response
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    // Successful login
                    window.location.href = '../index.html'; // Redirect to homepage or dashboard
                } else if (this.status === 401) {
                    // Unauthorized - handle error
                    console.error("Incorrect email or password.");
                    errorMessage.style.display = 'block'; // Display error message
                } else {
                    // Handle other status codes (optional)
                    console.error("Login error:", this.status);
                }
            }
        };
    });
});