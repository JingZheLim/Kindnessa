// Initialize Vue
const vue = new Vue({
    el: '#manager-section', // Target all element under id "managerW-section"
    data: {
        // initialise variables
        Orgs: true,
        Events: false,
        Posts: false,
    },
    methods: {
        buttonOrgs: function () {
            this.Orgs = true;
            this.Events = false;
            this.Posts = false;

        },
        buttonEvents: function () {
            this.Orgs = false;
            this.Events = true;
            this.Posts = false;

        },
        buttonPosts: function () {
            this.Orgs = false;
            this.Events = false;
            this.Posts = true;

        }
    }

});