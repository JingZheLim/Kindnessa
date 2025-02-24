var express = require('express');
var router = express.Router();
var path = require('path');


const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const saltRounds = 10; // Define the number of salt rounds for bcrypt

// middleware to parse JSON bodies
router.use(express.json());

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index.html', { title: 'Express' });
});

module.exports = router;

// Middleware to make pool accessible to routes
router.use((req, res, next) => {
  req.pool = req.app.pool;
  next();
});

// POST route for handling signup
router.post('/signup', function (req, res) {
  const { email, password, firstName, lastName } = req.body;

  // Hash the password before storing it in the database
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      console.error('Bcrypt error:', err);
      return res.sendStatus(500);
    }

    // Connect to the database
    req.pool.getConnection(function (err, connection) {
      if (err) {
        console.error('Database connection error:', err);
        return res.sendStatus(500);
      }

      // Query to insert new user
      const query = "INSERT INTO Users (email, password, given_name, family_name) VALUES (?, ?, ?, ?)";
      connection.query(query, [email, hash, firstName, lastName], function (Qerr, results) {
        connection.release(); // Release connection

        if (Qerr) {
          console.error('Database query error:', Qerr);
          return res.sendStatus(500);
        }

        // User successfully registered
        res.sendStatus(201); // Created status
      });
    });
  });
});

// POST route for handling login
router.post('/login', function (req, res) {
  const { email, password } = req.body;
  console.log(email);
  // Connect to the database
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Database connection error:', err);
      return res.sendStatus(500);
    }

    // Query to fetch user with given email
    const query = "SELECT * FROM Users WHERE email = ?";
    connection.query(query, [email], function (Qerr, results) {
      connection.release(); // Release connection

      if (Qerr) {
        console.error('Database query error:', Qerr);
        return res.sendStatus(500);
      }

      // Check if user with provided email exists
      if (results.length === 1) {
        // User found, compare hashed password
        const user = results[0];
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            console.error('Bcrypt error:', err);
            return res.sendStatus(500);
          }

          if (result) {
            // Passwords match, fetch user role
            const roleQuery = "SELECT role FROM Users WHERE user_id = ?";
            connection.query(roleQuery, [user.user_id], function (roleErr, roleResults) {

              if (roleErr) {
                console.error('Database role query error:', roleErr);
                return res.sendStatus(500);
              }

              if (roleResults.length === 1) {
                const role = roleResults[0].role;

                // Successful login, set session variables
                req.session.user_id = user.user_id;
                req.session.role = role;
                req.session.status = true;

                res.json({ success: true, role: role });
              } else {
                console.log('Role not found');
                res.sendStatus(401); // Unauthorized status
              }
            });
          } else {
            // Passwords do not match
            console.log('Incorrect password');
            res.sendStatus(401); // Unauthorized status
          }
        });
      } else {
        // No user found with given email
        console.log('Email not found');
        res.sendStatus(401); // Unauthorized status
      }
    });
  });
});

router.post('/logout', function (req, res, next) {
  // Check if user is logged in before attempting to logout
  if (req.session.user_id) {
    req.session.destroy(function (err) {
      if (err) {
        console.error('Error destroying session:', err);
        return res.sendStatus(500);
      }
      console.log('User logged out successfully');
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.sendStatus(200);
    });
  } else {
    console.log('No user session to destroy');
    res.sendStatus(400); // Bad request if no session exists
  }
});


// check if the user logged in
router.get('/check-login', function (req, res, next) {
  // Prepare the response data
  if (req.session.status) {
    res.json({ user_id: req.session.user_id, role_id: req.session.role });
  } else {
    res.sendStatus(401);
  }
});

// Middeleware function to check if the user joined an organisation
function checkMember(req, res, next) {
  const User_id = req.session.user_id;
  const Org_id = req.query.organisation_id;

  if (User_id === undefined) {
    // User not logged in
    res.sendStatus(401);
  } else {
    // User logged in
    // Query the database to check if the user is in this club
    req.pool.getConnection(function (err, connection) {
      if (err) {
        console.error('Database connection error:', err);
        return res.sendStatus(500);
      }

      let query = `SELECT * FROM Joined_Organisations WHERE User_id = ? AND Org_id =?;`;
      connection.query(query, [Org_id, User_id], function (Qerr, results, fields) {
        connection.release(); // Release connection

        if (results.length > 0) {
          // User is a member of an organisation
          next();
        } else {
          // User is not a member of an organisation
          res.sendStatus(401);
        }
      });
    });
  }
}

router.get('/load-orgs', function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Database connection error:', err);
      return res.sendStatus(500);
    }

    let query = "SELECT organisation_id, organisation_name, description, image FROM Organisations;";
    connection.query(query, function (error, results) {
      connection.release();

      if (error) {
        console.error('Database query error:', error);
        return res.sendStatus(500);
      }

      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ message: 'No organisations found' });
      }
    });
  });
});

router.get('/load-events', function (req, res) {
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Database connection error:', err);
      return res.sendStatus(500);
    }

    const query = "SELECT * FROM Events;";
    connection.query(query, function (error, results) {
      connection.release();

      if (error) {
        console.error('Database query error:', error);
        return res.sendStatus(500);
      }

      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ message: 'No events found' });
      }
    });
  });
});

router.get('/api/upcoming-events', (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Database connection error:', err);
      return res.sendStatus(500);
    }

    const query = `
      SELECT *
      FROM Events INNER JOIN Joined_Organisations ON Events.organisation_id = Joined_Organisations.organisation_id
      WHERE user_id = ?;
    `;

    connection.query(query, [userId], function (error, results) {
      connection.release();

      if (error) {
        console.error('Database query error:', error);
        return res.sendStatus(500);
      }

      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ message: 'No upcoming events found' });
      }
    });
  });
});

router.get('/api/events', (req, res) => {
  var organisationId = req.query.organisation_id;
  if (!organisationId) {
    return res.status(400).json({ error: 'organisation_id is required' });
  }
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Database connection error:', err);
      return res.sendStatus(500);
    }

    let query = "SELECT * FROM Events WHERE organisation_id = ?;";
    connection.query(query, [organisationId], function (error, results) {
      connection.release();

      if (error) {
        console.error('Database query error:', error);
        return res.sendStatus(500);
      }

      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ message: 'No event found' });
      }
    });
  });
});

// GET route for fetching event details by event_id
router.get('/api/event-details', (req, res) => {
  const eventId = req.query.event_id;
  if (!eventId) {
    return res.status(400).json({ error: 'event_id is required' });
  }

  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Database connection error:', err);
      return res.sendStatus(500);
    }

    let query = " SELECT Events.*, Organisations.organisation_name FROM Events INNER JOIN Organisations ON Events.organisation_id = Organisations.organisation_id WHERE Events.event_id = ?;";
    connection.query(query, [eventId], function (error, results) {
      connection.release();

      if (error) {
        console.error('Database query error:', error);
        return res.sendStatus(500);
      }

      if (results.length > 0) {
        res.json(results[0]); // Assuming event_id is unique and returns only one result
      } else {
        res.status(404).json({ message: 'Event not found' });
      }
    });
  });
});

router.get('/api/event-name', (req, res) => {
  const eventId = req.query.event_id;
  if (!eventId) {
    return res.status(400).json({ error: 'event_id is required' });
  }

  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Database connection error:', err);
      return res.sendStatus(500);
    }

    let query = " SELECT Organisations.organisation_name FROM Organisations INNER JOIN Events ON Events.organisation_id = Organisations.organisation_id WHERE Events.event_id = ?;";
    connection.query(query, [eventId], function (error, results) {
      connection.release();

      if (error) {
        console.error('Database query error:', error);
        return res.sendStatus(500);
      }

      if (results.length > 0) {
        res.json(results[0]); // Assuming event_id is unique and returns only one result
      } else {
        res.status(404).json({ message: 'Event not found' });
      }
    });
  });
});

// return if a user is a member of an organisation given an organisation_id
router.get('/api/check-organisation-status', function (req, res) {
  var organisation_id = req.query.organisation_id;
  console.log("Query organisation ID: " + organisation_id);
  const user_id = req.session.user_id; // Assuming user_id is stored in session

  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Database connection error:', err);
      return res.sendStatus(500);
    }

    const query = "SELECT * FROM Joined_Organisations WHERE user_id = ? AND organisation_id = ?";
    connection.query(query, [user_id, organisation_id], function (Qerr, results) {
      connection.release();

      if (Qerr) {
        console.error('Database query error:', Qerr);
        return res.sendStatus(500);
      }

      if (results.length > 0) {
        res.json({ joined: true });
      } else {
        res.json({ joined: false });
      }
    });
  });
});

router.get('/api/check-event-status', function (req, res) {
  const { event_id } = req.query;
  const user_id = req.session.user_id;

  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Database connection error:', err);
      return res.sendStatus(500);
    }

    const query = "SELECT * FROM Joined_Events WHERE user_id = ? AND event_id = ?";
    connection.query(query, [user_id, event_id], function (Qerr, results) {
      connection.release();

      if (Qerr) {
        console.error('Database query error:', Qerr);
        return res.sendStatus(500);
      }

      if (results.length > 0) {
        res.json({ joined: true });
      } else {
        res.json({ joined: false });
      }
    });
  });
});

// POST route for joining an organisation
router.post('/api/join-organisation', function (req, res) {
  var organisation_id = req.query.organisation_id;
  const user_id = req.session.user_id; // Assuming user_id is stored in session

  // Connect to the database
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Database connection error:', err);
      return res.sendStatus(500);
    }

    // Query to insert into Joined_Organisations table
    const query = "INSERT INTO Joined_Organisations (user_id, organisation_id) VALUES (?, ?)";
    connection.query(query, [user_id, organisation_id], function (Qerr, results) {
      const addUserQuery = "INSERT INTO Users_Table (user_id, organisation_id) VALUES (?, ?)";
      connection.query(addUserQuery, [user_id, organisation_id], function (Qerr2, results2) {
        connection.release(); // Release connection

        if (Qerr) {
          console.error('Database query error:', Qerr);
          return res.sendStatus(500);
        }

        // Successfully joined organisation
        res.sendStatus(200);
      });
    });
  });
});


// POST route for joining an event
router.post('/api/join-event', function (req, res) {
  const { event_id } = req.query;
  const user_id = req.session.user_id;

  if (user_id === null) {
    alert('Please login to register for this event!');
  }

  // Connect to the database
  req.pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Database connection error:', err);
      return res.sendStatus(500);
    }

    // Query to insert into Joined_Event table
    const query = "INSERT INTO Joined_Events (user_id, event_id) VALUES (?, ?)";
    connection.query(query, [user_id, event_id], function (Qerr, results) {
      connection.release(); // Release connection

      if (Qerr) {
        console.error('Database query error:', Qerr);
        return res.sendStatus(500);
      }

      // Successfully joined Event
      res.sendStatus(200);
    });
  });
});


