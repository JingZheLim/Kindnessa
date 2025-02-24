document.addEventListener('DOMContentLoaded', () => {
    new Vue({
        el: '.create-field',
        data: {
            organisations: [],
            selectedOrg: null,
            logged_in: false,
            check_manager: false,
            check_admin: false,
        },
        created() {
            this.fetchOrganisations();
        },
        methods: {
            fetchOrganisations() {
                fetch('/manager/organisations')
                    .then(response => response.json())
                    .then(data => {
                        this.organisations = data;
                    })
                    .catch(error => {
                        console.error('Error fetching organisations:', error);
                    });
            }
        }
    });
});

// create event
function handleEventFormSubmission(event) {
    event.preventDefault();
    console.log('Form submitted');

    // Validate form fields
    var title = document.getElementById('Title').value;
    var date = document.getElementById('Date').value;
    var time = document.getElementById('Time').value;
    var location = document.getElementById('Location').value;
    var description = document.getElementById('event_detail').value;
    var org_id = document.querySelector('#manager-organisations').value;
    var image = document.getElementById('Image').files[0];

    if (!title || !date || !time || !location || !description || !org_id || !image) {
        alert('Please fill in all fields.');
        return; // Stop the form submission
    }

    var formData = new FormData();
    formData.append('name', title);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('org_id', org_id);
    formData.append('image', image);

    fetch('/manager/create_event', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                console.log('Event created successfully');
                const confirmed = window.confirm('Event created successfully!');
                if (confirmed) {
                    window.location.reload();
                }
            } else {
                console.log('Error creating event');
                alert('Error creating event');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting form.');
        });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('event-form').addEventListener('submit', handleEventFormSubmission);
});


// edit organisation
function editOrganisation(event) {
    event.preventDefault();
    console.log('Form submitted');

    // Validate form fields
    var title = document.getElementById('Title').value;
    var description = document.getElementById('Description').value;
    var image = document.getElementById('Image').files[0];

    if (!title || !description) {
        alert('Please fill in all fields.');
        return; // Stop the form submission
    }

    var formData = new FormData();
    formData.append('name', title);
    formData.append('description', description);
    formData.append('image', image);

    fetch('/manager/edit_organisation', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                alert('Organisation updated successfully');
                const confirmed = window.confirm('Organisation updated successfully!');
                if (confirmed) {
                    window.location.reload();
                }
            } else {
                console.log('Error updating organisation');
                alert('Error updating organisation');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting form.');
        });

}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('organisation-form').addEventListener('submit', editOrganisation);
});

// create post
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('post-form').addEventListener('submit', function (event) {
        event.preventDefault();
        console.log('Form submitted');

        // Validate form fields
        var title = document.getElementById('Title').value;
        var description = document.getElementById('post_description').value;
        var org_id = document.querySelector('#manager-organisations').value;
        var visibility = document.querySelector('#visibility').value;
        var image = document.getElementById('Image').files[0];

        if (!title || !description || !org_id || !visibility || !image) {
            alert('Please fill in all fields.');
            return; // Stop the form submission
        }

        var formData = new FormData();
        formData.append('event_id', document.getElementById('EventId').value);
        formData.append('title', document.getElementById('Title').value);
        formData.append('description', document.getElementById('post_description').value);
        formData.append('org_id', document.querySelector('#manager-organisations').value);
        formData.append('visibility', document.querySelector('#visibility').value);
        formData.append('image', document.getElementById('Image').files[0]);


        fetch('/manager/create_post', {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (response.ok) {
                    console.log('post created successfully');
                    const confirmed = window.confirm('Post created successfully!');
                    if (confirmed) {
                        window.location.reload();
                    }
                } else {
                    console.log('Error creating post');
                    alert('Error creating post');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error submitting form.');
            });
    });
});

function loadMyOrgs() {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            const response = JSON.parse(this.response);
            console.log(response);

            // putting it into the table
            var table = document.getElementById('org-list');
            // Clear existing content
            table.innerHTML = '';
            table.innerHTML = `<div class="org-name-box org-name-top org-button">
            <p class="org-name">Organisation Name</p>
            <p class="org-name">Edit</p>
            <p class="org-name">Manage</p>
            </div>`;
            response.forEach(function (org) {
                var rowDiv = document.createElement('div');
                // add classes
                rowDiv.classList.add('org-name-box', 'org-name-text', 'org-button');
                var name = document.createElement('p');
                name.classList.add('org-name');
                name.textContent = org.organisation_name;
                rowDiv.appendChild(name);

                // Create the buttons
                var orgId = org.organisation_id;
                var editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.onclick = function () {
                    amIManager();
                    // might need to change this
                    window.location.href = 'edit_org.html?orgId=' + orgId;
                };
                rowDiv.appendChild(editButton);

                var manageButton = document.createElement('button');
                manageButton.textContent = 'Manage';
                manageButton.onclick = function () {
                    amIManager();
                    window.location.href = 'manage_org_members.html?orgId=' + orgId;
                };
                rowDiv.appendChild(manageButton);
                table.appendChild(rowDiv);
            });
        }
    };

    // Open the AJAX request
    xhttp.open('GET', '/manager/load-my-orgs', true);

    // Send the AJAX request
    xhttp.send();
}

function loadMyEvents() {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            const response = JSON.parse(this.response);
            console.log(response);
            // putting it into the table
            var table = document.getElementById('event-list');
            // Clear existing content
            table.innerHTML = '';
            response.forEach(function (event) {


                var div = document.createElement('div');
                div.classList.add('posts-container', 'posts-container-content');

                var name = document.createElement('p');
                name.classList.add('event-box');
                name.textContent = event.event_name;
                div.appendChild(name);

                var description = document.createElement('p');
                description.classList.add('event-box-2');
                description.textContent = event.description;
                div.appendChild(description);

                var buttonContainer = document.createElement('div');
                buttonContainer.classList.add('button-container');

                // creating the buttons
                var eventId = event.event_id;
                var editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.onclick = function () {
                    amIManager();
                    window.location.href = 'edit_individual_event.html?eventId=' + eventId;
                };
                buttonContainer.appendChild(editButton);

                var manageButton = document.createElement('button');
                manageButton.textContent = 'Manage';
                manageButton.onclick = function () {
                    amIManager();
                    window.location.href = 'manage_individual_event.html?eventId=' + eventId;
                };
                buttonContainer.appendChild(manageButton);


                buttonContainer.appendChild(manageButton);

                var deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.setAttribute('onclick', `deleteEvent(${eventId})`);
                buttonContainer.appendChild(deleteButton);

                div.appendChild(buttonContainer);
                table.appendChild(div);
            });
        }
    };


    // Open the AJAX request to load-my-events
    xhttp.open('GET', '/manager/load-my-events', true);

    // Send the AJAX request
    xhttp.send();

}

function loadMyPosts() {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            const response = JSON.parse(this.response);
            console.log(response);
            // putting it into the table
            var table = document.getElementById('post-list');
            // Clear existing content
            table.innerHTML = '';
            response.forEach(function (post) {
                var postDiv = document.createElement('div');
                postDiv.classList.add('posts-container', 'posts-container-content');

                var postTitle = document.createElement('p');
                postTitle.classList.add('event-box');
                postTitle.textContent = post.title;
                postDiv.appendChild(postTitle);

                var postDescription = document.createElement('p');
                postDescription.classList.add('event-box-2');
                postDescription.textContent = post.description;
                postDiv.appendChild(postDescription);

                var buttonContainer = document.createElement('div');
                buttonContainer.classList.add('button-container');

                // creating the buttons
                var postId = post.post_id;
                var editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.onclick = function () {
                    amIManager();
                    window.location.href = 'edit_post.html?postId=' + postId;
                };
                buttonContainer.appendChild(editButton);

                var deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.setAttribute('onclick', `deletePost(${postId})`);
                buttonContainer.appendChild(deleteButton);

                postDiv.appendChild(buttonContainer);
                table.appendChild(postDiv);
            });
        }
    };


    // Open the AJAX request to load-all-posts
    xhttp.open('GET', '/manager/load-my-posts', true);

    // Send the AJAX request
    xhttp.send();

}

function deleteEvent(eventId) {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // Reload the page after successful removal
            loadMyEvents();
        }
    };
    // Open the AJAX request
    xhttp.open('POST', '/manager/delete-event', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Send the AJAX request with org ID as data
    xhttp.send(JSON.stringify({ eventId: eventId }));
}

function deletePost(postId) {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // Reload the page after successful removal
            loadMyPosts();
        }
    };
    // Open the AJAX request
    xhttp.open('POST', '/manager/delete-post', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Send the AJAX request with org ID as data
    xhttp.send(JSON.stringify({ postId: postId }));
}

function loadAllOrgMembers(orgId) {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            const response = JSON.parse(this.response);
            console.log(response);
            var titleId = document.getElementById('org-title');
            // Clear existing content
            titleId.innerHTML = '';
            // Populate org details
            var title = document.createElement('p');
            title.classList.add('title');
            title.textContent = response.organisation.organisation_name;
            titleId.appendChild(title);

            var membersList = document.getElementById('members-list');
            membersList.innerHTML = `<div class="org-name-box org-name-top org-button">
                                <p class="org-name">Members</p>
                                </div>`;
            // Populate Members List
            response.members.forEach(function (member) {
                var rowDiv = document.createElement('div');
                rowDiv.classList.add('org-name-box', 'org-name-text', 'org-button');
                var name = document.createElement('p');
                name.classList.add('org-name');
                name.textContent = member.given_name + ' ' + member.family_name + ' (' + member.user_id + ')';
                rowDiv.appendChild(name);

                // Create the button
                var removeButton = document.createElement('button');
                removeButton.classList.add('remove-button');
                removeButton.textContent = 'Remove';
                removeButton.setAttribute('onclick', `removeOrgMember(${orgId}, ${member.user_id})`);
                rowDiv.appendChild(removeButton);
                membersList.appendChild(rowDiv);

            });

            var managerList = document.createElement('div');
            managerList.classList.add('org-name-box', 'org-name-top', 'org-button');
            var pDiv = document.createElement('p');
            pDiv.classList.add('org-name');
            pDiv.textContent = 'Managers';
            managerList.appendChild(pDiv);
            membersList.appendChild(managerList);
            // Populate Manager List
            response.managers.forEach(function (member) {
                var rowDiv = document.createElement('div');
                rowDiv.classList.add('org-name-box', 'org-name-text', 'org-button');
                var name = document.createElement('p');
                name.classList.add('org-name');
                name.textContent = member.given_name + ' ' + member.family_name + ' (' + member.user_id + ')';
                rowDiv.appendChild(name);

                membersList.appendChild(rowDiv);
            });
        }
    };
    // Open the AJAX request
    xhttp.open('GET', '/manager/manage_org_members?orgId=' + orgId, true);

    // Send the AJAX request
    xhttp.send();

}

function removeOrgMember(orgId, userId) {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // Reload the RSVPs after successful removal
            loadAllOrgMembers(orgId);
        }
    };
    // Open the AJAX request
    xhttp.open('POST', '/manager/remove-org-member', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Send the AJAX request with event ID and user ID as data
    xhttp.send(JSON.stringify({ orgId: orgId, userId: userId }));
}

function loadEventRSVP(eventId, userId) {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            const response = JSON.parse(this.response);
            console.log(response);

            var titleId = document.getElementById('event-title');
            // Clear existing content
            titleId.innerHTML = '';
            // Populate event details
            var title = document.createElement('p');
            title.classList.add('title');
            title.textContent = response.event.event_name;
            titleId.appendChild(title);

            var rsvpList = document.getElementById('event-RSVP');
            rsvpList.innerHTML = `                <div class="org-name-box org-name-top org-button">
                    <p class="org-name">Full Name and ID</p>
                    <p class="org-name">Remove</p>
                </div>`;
            // Populate RSVPs
            response.rsvps.forEach(function (rsvp) {
                var rowDiv = document.createElement('div');
                rowDiv.classList.add('org-name-box', 'org-name-text', 'org-button');
                var name = document.createElement('p');
                name.classList.add('org-name');
                name.textContent = rsvp.given_name + ' ' + rsvp.family_name + ' (' + rsvp.user_id + ')';
                rowDiv.appendChild(name);

                // Create the button
                var deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.setAttribute('onclick', `removeRSVP(${eventId}, ${rsvp.user_id})`);
                rowDiv.appendChild(deleteButton);

                rsvpList.appendChild(rowDiv);

            });
        }
    };

    // Open the AJAX request
    xhttp.open('GET', '/manager/manage_individual_event?eventId=' + eventId, true);

    // Send the AJAX request
    xhttp.send();
}

function removeRSVP(eventId, userId) {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // Reload the RSVPs after successful removal
            loadEventRSVP(eventId);
        }
    };
    // Open the AJAX request
    xhttp.open('POST', '/manager/remove-rsvp', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Send the AJAX request with event ID and user ID as data
    xhttp.send(JSON.stringify({ eventId: eventId, userId: userId }));
}

function amIManager() {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            console.log("Yes I AM");
        }
    };
    // Open the AJAX request to load-all-posts
    xhttp.open('GET', '/manager/am-i-manager', true);

    // Send the AJAX request
    xhttp.send();
}

function loadEventDetails(eventId) {
    fetch(`/manager/load_event_details?eventId=${eventId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // load details in
            document.getElementById('Title').value = data.event_name;
            document.getElementById('event_detail').value = data.description;
            document.getElementById('Date').value = data.date;
            document.getElementById('Time').value = data.time;
            document.getElementById('Location').value = data.location;
            document.getElementById('preview').src = data.image; // Set image src
            document.getElementById('preview').style.display = 'block'; // Show image preview
            document.querySelector('#manager-organisations').value = data.org_id;
            document.getElementById('EventId').value = data.event_id;

        })
        .catch(error => {
            console.error('Error fetching event details:', error);
        });
}

function loadPostDetails(postId) {
    fetch(`/manager/load_post_details?postId=${postId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // load details in
            document.getElementById('Title').value = data.title;
            document.getElementById('post_description').value = data.description;
            document.querySelector('#visibility').value = data.visibility;
            document.getElementById('preview').src = data.image; // Set image src
            document.getElementById('preview').style.display = 'block'; // Show image preview
            document.getElementById('EventId').value = data.post_id;

        })
        .catch(error => {
            console.error('Error fetching event details:', error);
        });
}

