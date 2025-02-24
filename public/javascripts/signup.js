document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('signup-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting

        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confirm-pass').value;
        var firstName = document.getElementById('first-name').value;
        var lastName = document.getElementById('last-name').value;
        var errorMessage = document.getElementById('error-message');

        // Check if passwords match
        if (password !== confirmPassword) {
            errorMessage.textContent = "Passwords do not match!";
            errorMessage.style.display = 'block';
            return;
        }

        // Prepare form data
        var formData = {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        };

        // Send form data to server
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.ok) {
                    // Handle successful signup
                    window.location.href = '../index.html'; // Redirect to main page or another success page
                } else {
                    // Handle signup error
                    errorMessage.textContent = "Error during signup. Please try again.";
                    errorMessage.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                errorMessage.textContent = "An unexpected error occurred. Please try again.";
                errorMessage.style.display = 'block';
            });
    });
});
