var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const saltRounds = 10; // Define the number of salt rounds for bcrypt

// check if the user has logged in or not (middleware)
router.use(function (req, res, next) {
  if (req.session.status) {
    next();
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});

var connection = require('../database_connect.js');

/* GET users listing. */
//router.get('/', function (req, res, next) {
// res.sendFile('/user/profile.html', { root: 'public' });
//});

router.use(express.json());

// to make pool accessible to routes (middleware)
router.use((req, res, next) => {
  req.pool = req.app.pool;
  next();
});

// get request to fetch user account info
router.get('/account-info', (req, res) => {

  // check if user id is available
  if (!req.session.status) {
    return res.status(401).json({ error: 'User not logged in ' });
  }

  // get user id from session
  const userId = req.session.user_id;

  // SQL query to get the info
  const sql = 'SELECT user_id, email, given_name, family_name FROM Users WHERE user_id = ?';
  connection.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error ' });
    }

    // User account information retrieved successfully
    const userData = {
      user_id: result[0].user_id,
      email: result[0].email,
      given_name: result[0].given_name,
      family_name: result[0].family_name
    };

    // Send as a JSON response
    res.json(userData);
  });
});

// Post request to update the user's profile
router.post('/update-profile', (req, res) => {
  const { firstName, lastName, email, currentPassword, newPassword } = req.body;
  const userId = req.session.user_id; // Use userId from session for security

  // First, get the current user's password from the database
  const verifyPasswordSql = 'SELECT password FROM Users WHERE user_id = ?';

  connection.query(verifyPasswordSql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    // checking if the user is found
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // compare the current password with the stored password
    bcrypt.compare(currentPassword, result[0].password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Password verification error' });
      }

      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }

      // SQL query to update the user information
      let updateSql = 'UPDATE Users SET given_name = ?, family_name = ?, email = ?';
      let updateParams = [firstName, lastName, email];

      if (newPassword) {
        // Hash new password
        bcrypt.hash(newPassword, saltRounds, (err, hash) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Password hashing error' });
          }
          // update to the new hashed password
          updateSql += ', password = ?';
          updateParams.push(hash);
          updateParams.push(userId);

          connection.query(updateSql + ' WHERE user_id = ?', updateParams, (err, result) => {
            if (err) {
              return res.status(500).json({ success: false, message: 'Update error' });
            }
            res.json({ success: true, message: 'Profile updated successfully' });
          });
        });

      } else { // updating query without new password
        updateParams.push(userId);
        connection.query(updateSql + ' WHERE user_id = ?', updateParams, (err, result) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Update error' });
          }
          res.json({ success: true, message: 'Profile updated successfully' });
        });
      }
    });
  });
});

// Post request for the delete-account route
router.post('/delete-account', (req, res) => {

  const { password } = req.body;

  // get user id from session
  const userId = req.session.user_id;

  // get password from database
  const verifyPasswordSql = 'SELECT password FROM Users WHERE user_id = ?';

  connection.query(verifyPasswordSql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    // Check if the user is found
    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // checking if the password is valid
    bcrypt.compare(password, result[0].password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Password verification error' });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect password ' });
      }

      // The query to delete the user account
      const deleteSql = 'DELETE FROM Users WHERE user_id = ?';

      connection.query(deleteSql, [userId], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error deleting account' });
        }

        req.session.destroy((err) => {
          if (err) {
            console.error('Error destroying session:', err);
          }
        });

        res.json({ message: 'Account successfully deleted' });
      });
    });
  });
});


/* THIS SECTION IS FOR THE JOINED ORGANISATIONS PAGE */
// handles fetching the list of organisations that user has joined.
router.get('/joined_organisations', (req, res) => {
  const userId = req.session.user_id;

  const sql = `
  SELECT * FROM Organisations INNER JOIN Joined_Organisations ON Organisations.organisation_id = Joined_Organisations.organisation_id WHERE user_id=?`;

  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching joined organizations:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results); // so we always return an array
  });
});


// route to leave an organization
router.post('/leave-organisation', (req, res) => {
  const { organisation_id } = req.body;
  const userId = req.session.user_id;

  if (!organisation_id) {
    return res.status(400).json({ error: 'organisation_id is required' });
  }

  const sql = 'DELETE FROM Joined_Organisations WHERE user_id = ? AND organisation_id = ?';

  connection.query(sql, [userId, organisation_id], (err, result) => {
    if (err) {
      console.error('Error leaving organisation:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Successfully left the organisation' });
    } else {
      res.status(404).json({ error: 'Organisation not found or user is not a member' });
    }
  });
});


/* THIS SECTION IS FOR THE JOINED EVENTS PAGE */
// handles fetching the list of events that user has joined.
router.get('/joined_events', (req, res) => {
  const userId = req.session.user_id;

  const sql = `
  SELECT
    *
  FROM
    Events
  INNER JOIN
    Joined_Events ON Events.event_id = Joined_Events.event_id
  WHERE
    user_id = ?`;

  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching joined events:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results); // so we always return an array
  });
});


// route to leave an organization
router.post('/leave-event', (req, res) => {
  const { event_id } = req.body;
  const userId = req.session.user_id;

  if (!event_id) {
    return res.status(400).json({ error: 'event_id is required' });
  }

  const sql = 'DELETE FROM Joined_Events WHERE user_id = ? AND event_id = ?';

  connection.query(sql, [userId, event_id], (err, result) => {
    if (err) {
      console.error('Error leaving event:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Successfully left the event' });
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  });
});


module.exports = router;
