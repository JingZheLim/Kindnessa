function loadAllOrgs() {
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
            <p class="org-name">Manage</p>
            <p class="org-name">Delete</p>
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

                var manageButton = document.createElement('button');
                manageButton.textContent = 'Manage';
                manageButton.onclick = function () {
                    amIAdmin();
                    window.location.href = 'manage_org_members.html?orgId=' + orgId;
                };
                rowDiv.appendChild(manageButton);

                var deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.setAttribute('onclick', `deleteOrg(${orgId})`);
                rowDiv.appendChild(deleteButton);

                table.appendChild(rowDiv);
            });
        }
    };

    // Open the AJAX request
    xhttp.open('GET', '/admin/load-all-orgs', true);

    // Send the AJAX request
    xhttp.send();
}

function loadAllEvents() {
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

                var manageButton = document.createElement('button');
                manageButton.textContent = 'Manage';
                manageButton.onclick = function () {
                    amIAdmin();
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


    // Open the AJAX request to load-all-events
    xhttp.open('GET', '/admin/load-all-events', true);

    // Send the AJAX request
    xhttp.send();

}

function loadAllPosts() {
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
    xhttp.open('GET', '/admin/load-all-posts', true);

    // Send the AJAX request
    xhttp.send();

}

function loadAllUsers() {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            const response = JSON.parse(this.response);
            console.log(response);
            // putting it into the table
            var table = document.getElementById('user-list');
            // Clear existing content
            table.innerHTML = '';
            table.innerHTML = `<div class="org-name-box org-name-top org-button">
                                <p class="org-name">Users</p>
                                </div>`;
            response.users.forEach(function (user) {
                var rowDiv = document.createElement('div');
                rowDiv.classList.add('org-name-box', 'org-name-text', 'org-button');
                var name = document.createElement('p');
                name.classList.add('org-name');
                name.textContent = user.given_name + ' ' + user.family_name + ' (' + user.user_id + ')';
                rowDiv.appendChild(name);

                // Create Edit buttons
                var userId = user.user_id;
                var editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.onclick = function () {
                    // take to user RAWR
                    window.location.href = `/admin/manage_edit_users.html?user_id=${userId}`;

                };
                rowDiv.appendChild(editButton);

                // Create set Admin button
                var setManagerButton = document.createElement('button');
                setManagerButton.classList.add('manager-button');
                setManagerButton.textContent = 'Set as Admin';
                setManagerButton.setAttribute('onclick', `setAdmin(${userId})`);
                rowDiv.appendChild(setManagerButton);

                // Create Delete button
                var deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.setAttribute('onclick', `deleteUser(${userId})`);
                rowDiv.appendChild(deleteButton);

                table.appendChild(rowDiv);
            });

            // BELOW IS ADMIN
            var managerList = document.createElement('div');
            managerList.classList.add('org-name-box', 'org-name-top', 'org-button');
            var pDiv = document.createElement('p');
            pDiv.classList.add('org-name');
            pDiv.textContent = 'Admins';
            managerList.appendChild(pDiv);
            table.appendChild(managerList);

            response.admins.forEach(function (admin) {
                var rowDiv = document.createElement('div');
                rowDiv.classList.add('org-name-box', 'org-name-text', 'org-button');
                var name = document.createElement('p');
                name.classList.add('org-name');
                name.textContent = admin.given_name + ' ' + admin.family_name + ' (' + admin.user_id + ')';
                rowDiv.appendChild(name);

                // Create Edit buttons
                var adminId = admin.user_id;
                var editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.onclick = function () {
                    window.location.href = `/admin/manage_edit_users.html?user_id=${adminId}`;
                };
                rowDiv.appendChild(editButton);

                // Create Remove Admin button
                var setManagerButton = document.createElement('button');
                setManagerButton.classList.add('manager-button');
                setManagerButton.textContent = 'Remove Admin';
                setManagerButton.setAttribute('onclick', `removeAdmin(${adminId})`);
                rowDiv.appendChild(setManagerButton);

                // Create Delete button
                var deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.setAttribute('onclick', `deleteUser(${adminId})`);
                rowDiv.appendChild(deleteButton);

                table.appendChild(rowDiv);
            });
        }
    };

    // Open the AJAX request to load-all-users
    xhttp.open('GET', '/admin/load-all-users', true);

    // Send the AJAX request
    xhttp.send();
}

function deleteOrg(orgId) {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // Reload the page after successful removal
            loadAllOrgs();
        }
    };
    // Open the AJAX request
    xhttp.open('POST', '/admin/delete-organisation', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Send the AJAX request with org ID as data
    xhttp.send(JSON.stringify({ orgId: orgId }));
}

function deleteEvent(eventId) {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // Reload the page after successful removal
            loadAllEvents();
        }
    };
    // Open the AJAX request
    xhttp.open('POST', '/admin/delete-event', true);
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
            loadAllPosts();
        }
    };
    // Open the AJAX request
    xhttp.open('POST', '/admin/delete-post', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Send the AJAX request with org ID as data
    xhttp.send(JSON.stringify({ postId: postId }));
}

function setAdmin(userId) {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // Reload after successful removal
            loadAllUsers();
        }
    };
    // Open the AJAX request
    xhttp.open('POST', '/admin/set-admin', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Send the AJAX request with and user ID as data
    xhttp.send(JSON.stringify({ userId: userId }));
}

function removeAdmin(userId) {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // Reload after successful removal
            loadAllUsers();
        }
    };
    // Open the AJAX request
    xhttp.open('POST', '/admin/remove-admin', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Send the AJAX request with user ID as data
    xhttp.send(JSON.stringify({ userId: userId }));
}

function deleteUser(userId) {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // Reload the page after successful removal
            loadAllUsers();
        }
    };
    // Open the AJAX request
    xhttp.open('POST', '/admin/delete-user', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Send the AJAX request with org ID as data
    xhttp.send(JSON.stringify({ userId: userId }));
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

                // Create the button
                var setManagerButton = document.createElement('button');
                setManagerButton.classList.add('manager-button');
                setManagerButton.textContent = 'Set as Manager';
                setManagerButton.setAttribute('onclick', `setManager(${orgId}, ${member.user_id})`);
                rowDiv.appendChild(setManagerButton);

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

                // Create the button
                var removeButton = document.createElement('button');
                removeButton.classList.add('remove-button');
                removeButton.textContent = 'Remove';
                removeButton.setAttribute('onclick', `removeOrgMember(${orgId}, ${member.user_id})`);
                rowDiv.appendChild(removeButton);

                // Create the button
                var setManagerButton = document.createElement('button');
                setManagerButton.classList.add('manager-button');
                setManagerButton.textContent = 'Remove Manager';
                setManagerButton.setAttribute('onclick', `removeManager(${orgId}, ${member.user_id})`);
                rowDiv.appendChild(setManagerButton);

                membersList.appendChild(rowDiv);
            });



        }
    };
    // Open the AJAX request
    xhttp.open('GET', '/admin/manage_org_members?orgId=' + orgId, true);

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
    xhttp.open('POST', '/admin/remove-org-member', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Send the AJAX request with event ID and user ID as data
    xhttp.send(JSON.stringify({ orgId: orgId, userId: userId }));
}

function setManager(orgId, userId) {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // Reload the RSVPs after successful removal
            loadAllOrgMembers(orgId);
        }
    };
    // Open the AJAX request
    xhttp.open('POST', '/admin/set-manager', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Send the AJAX request with event ID and user ID as data
    xhttp.send(JSON.stringify({ orgId: orgId, userId: userId }));
}

function removeManager(orgId, userId) {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            // Reload the RSVPs after successful removal
            loadAllOrgMembers(orgId);
        }
    };
    // Open the AJAX request
    xhttp.open('POST', '/admin/remove-manager', true);
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
    xhttp.open('GET', '/admin/manage_individual_event?eventId=' + eventId, true);

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
    xhttp.open('POST', '/admin/remove-rsvp', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Send the AJAX request with event ID and user ID as data
    xhttp.send(JSON.stringify({ eventId: eventId, userId: userId }));
}

function amIAdmin() {
    // make AJAX Request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            console.log("Yes I AM");
        }
    };
    // Open the AJAX request to load-all-posts
    xhttp.open('GET', '/manager/am-i-admin', true);

    // Send the AJAX request
    xhttp.send();
}

// For creating a new organisation
function handleOrganisationFormSubmission(organisation) {
    event.preventDefault();
    console.log('Form submitted');

    // Validate form fields
    var name = document.getElementById('Title').value;
    var description = document.getElementById('event_detail').value;
    var image = document.getElementById('Image').files[0];

    if (!name || !description || !image) {
        alert('Please fill in all fields.');
        return; // Stop the form submission
    }

    var formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', image);

    fetch('/admin/create_organisation', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                console.log('Organisation created successfully');
                const confirmed = window.confirm('Organisation created successfully!');
                if (confirmed) {
                    window.location.reload();
                }
            } else {
                console.log('Error creating organisation');
                alert('Error creating organisation');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting form.');
        });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('organisation-form').addEventListener('submit', handleOrganisationFormSubmission);
});

// to preview the image if chosen
function previewImage(event) {
    const input = event.target;
    const preview = document.getElementById('preview');
    const previewText = document.getElementById('preview-text');

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            previewText.style.display = 'none';
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.src = '#';
        preview.style.display = 'none';
        previewText.style.display = 'block';
        previewText.textContent = 'None selected';
    }
}

