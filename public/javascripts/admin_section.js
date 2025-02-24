// Initialize Vue
const vue = new Vue({
    el: '#admin-section', // Target all element under id "admin-section"
    data: {
        // initialise variables
        Orgs: true,
        Events: false,
        Posts: false,
        Users: false,
        CreateOrgs: false,
    },
    methods: {
        buttonOrgs: function () {
            this.Orgs = true;
            this.Events = false;
            this.Posts = false;
            this.Users = false;
            this.CreateOrgs = false;

        },
        buttonEvents: function () {
            this.Orgs = false;
            this.Events = true;
            this.Posts = false;
            this.Users = false;
            this.CreateOrgs = false;

        },
        buttonPosts: function () {
            this.Orgs = false;
            this.Events = false;
            this.Posts = true;
            this.Users = false;
            this.CreateOrgs = false;

        },
        buttonUsers: function () {
            this.Orgs = false;
            this.Events = false;
            this.Posts = false;
            this.Users = true;
            this.CreateOrgs = false;

        },
        buttonCreateOrgs: function () {
            this.Orgs = false;
            this.Events = false;
            this.Posts = false;
            this.Users = false;
            this.CreateOrgs = true;

        }
    }

});