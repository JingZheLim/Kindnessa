function route_to_event(org_id, event_id) {

    // Make an AJAX request
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            window.location.href = this.responseURL;
        }
    };
    // Open the AJAX request
    xhttp.open('GET', '/organisation/event?org_id=' + org_id + '&event_id=' + event_id, true);

    // Send the AJAX request
    xhttp.send();
}

// Make a request to org home page using org_id
function route_to_org_homepage(id) {
    // Make an AJAX request
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            window.location.href = this.responseURL;
        }
    };
    // Open the AJAX request
    xhttp.open('GET', '/organisation/?org_id=' + id, true);

    // Send the AJAX request
    xhttp.send();
}

