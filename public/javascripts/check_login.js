const vueinst = new Vue({
    el: '#app',
    data: {
        logged_in: false,
        check_manager: false,
        check_admin: false,
    },
    mounted() {
        this.check_login();
    },
    methods: {
        check_login() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        const response = JSON.parse(xhttp.responseText);
                        this.logged_in = true;
                        this.check_manager = response.role_id === 'manager';
                        this.check_admin = response.role_id === 'admin';
                    } else {
                        this.logged_in = false;
                        this.check_manager = false;
                        this.check_admin = false;
                    }
                }
            };
            xhttp.open('GET', '/check-login', true);
            xhttp.send();
        },
        logout() {
            fetch('/logout', {
                method: 'POST',
                credentials: 'same-origin'
            })
                .then(response => {
                    if (response.ok) {
                        console.log('Logout successful'); // Log success
                        this.logged_in = false;
                        window.location.href = '../index.html';
                    } else {
                        console.error('Logout failed'); // Log failure
                    }
                })
                .catch(error => {
                    console.error('Error during logout:', error);
                });
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    vueinst.check_login();
});

const vueinst2 = new Vue({
    el: '#app2',
    data: {
        logged_in: false,
        check_manager: false,
        check_admin: false,
    },
    mounted() {
        this.check_login();
    },
    methods: {
        check_login() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        const response = JSON.parse(xhttp.responseText);
                        this.logged_in = true;
                        this.check_manager = response.role_id === 'manager';
                        this.check_admin = response.role_id === 'admin';
                    } else {
                        this.logged_in = false;
                        this.check_manager = false;
                        this.check_admin = false;
                    }
                }
            };
            xhttp.open('GET', '/check-login', true);
            xhttp.send();
        },
        logout() {
            fetch('/logout')
                .then(() => {
                    this.logged_in = false;
                    window.location.href = '../index.html';
                });
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    vueinst.check_login();
});

