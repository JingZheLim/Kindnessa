document.addEventListener('DOMContentLoaded', function () {
    /* 1. Create new AJAX request */
    var xhttp = new XMLHttpRequest();
    /* 4. Handle response (callback function) */
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = '../index.html';
        }
    };
    /* 2. Open connection */
    xhttp.open("GET", "/logout", true);
    /* 3. Send request */
    xhttp.send();
});