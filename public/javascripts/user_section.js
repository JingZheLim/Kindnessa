// Initialize Vue
const vue = new Vue({
    el: '#user-section', // Target all element under id "user-section"
    data: {
        // initialise variables
        Profile: true,
        Orgs: false,
        Events: false,
    },
    methods: {
        buttonProfile: function () {
            this.Profile = true;
            this.Orgs = false;
            this.Events = false;

        },
        buttonOrgs: function () {
            this.Profile = false;
            this.Orgs = true;
            this.Events = false;

        },
        buttonEvents: function () {
            this.Profile = false;
            this.Orgs = false;
            this.Events = true;

        }
    }

  });
