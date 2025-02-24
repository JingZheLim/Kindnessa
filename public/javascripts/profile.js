const vueInst = new Vue({
  el: '#account-info',
  data: {
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    showPasswordDiv: false,
    editMode: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    organisations: [],
  },
  created() {
    // Make AJAX request to fetch user account info
    fetch('/users/account-info')
      .then(response => response.json())
      .then(data => {
        // Update Vue data with fetched user account info
        this.userId = data.user_id;
        this.firstName = data.given_name;
        this.lastName = data.family_name;
        this.email = data.email;
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });

    // to fetch org preferences
    this.fetchOrganisationPreferences();
  },

  methods: {
    toggleEdit() {
      this.editMode = !this.editMode;
      this.showPasswordDiv = this.editMode;
      if (!this.editMode) {
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      }
    },

    saveChanges() {
      if (this.newPassword !== this.confirmPassword) {
        alert("New password and confirm password do not match!");
        return;
      }

      // Make AJAX POST request to update user profile
      fetch('/users/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: this.userId,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          currentPassword: this.currentPassword,
          newPassword: this.newPassword
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert("Profile successfully updated!");
            this.editMode = false;
            this.showPasswordDiv = false;
            // Reset password fields
            this.currentPassword = '';
            this.newPassword = '';
            this.confirmPassword = '';
          } else {
            alert(data.message || "Failed to update profile!");
          }
        })
        .catch((error) => {
          console.error('Error: ', error);
          alert("Error!");
        });
    },

    async deleteAccount() {
      if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        try {
          const response = await fetch('/users/delete-account', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: this.userId,
              password: this.currentPassword
            }),
          });

          if (response.ok) {
            alert("Your account has been successfully deleted.");
            window.location.href = '/';
          } else {
            const errorData = await response.json();
            alert(`Failed to delete account: ${errorData.message}`);
          }
        } catch (error) {
          console.error('Error deleting account:', error);
          alert("An error occurred while trying to delete your account. Please try again later.");
        }
      }
    },


    fetchOrganisationPreferences() {
      fetch('/users/organisation-preferences')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Received data:', data); // Add this line for debugging
          if (!Array.isArray(data)) {
            console.error('Received non-array data:', data);
            this.organisations = [];
            return;
          }
          this.organisations = data.map(org => ({
            organisation_id: org.organisation_id,
            name: org.name,
            event_notifications: Boolean(org.event_notifications),
            post_notifications: Boolean(org.post_notifications),
          }));
        })
        .catch(error => {
          console.error('Error getting organisation preferences:', error);
          this.organisations = [];
        });
    },


    updatePreference(organisationId, type, checked) {
      fetch('/users/update-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organisation_id: organisationId,
          type: type,
          checked: checked
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log('Preferences updated successfully');
            // Optionally refresh the preferences after successful update
            this.fetchOrganisationPreferences();
          } else {
            console.log('Failed to update preferences', data.message);
          }
        })
        .catch(error => {
          console.error('Error updating preferences:', error);
        });
    }
  }
});
