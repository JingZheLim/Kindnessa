var express = require('express');
var router = express.Router();
const multer = require('multer');

var connection = require('../database_connect.js');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Middleware to check if the user has logged in or is a manager
router.use((req, res, next) => {
    if (req.session.status) {
        console.log("The current user is: " + req.session.user_id);
        console.log("The current status: " + req.session.role);
        next();
    } else {
        res.sendStatus(401);
    }
});

function checkManager(req, res, next) {
    const userId = req.session.user_id;
    if (userId === undefined) {
        // User not logged in
        res.sendStatus(401);
    } else {
        // User logged in
        // Set query to ask the database is that user is admin or manager
        let query = `SELECT Role FROM Users WHERE user_Id = ?;`;
        connection.query(query, [userId], function (error, results, fields) {
            if (error) throw error;
            const role = results[0].Role;
            if (role === "admin" || role === "manager") {
                next();
            } else {
                res.sendStatus(401);
            }
        });
    }
}

router.use('/*', checkManager, function (req, res, next) {
    next();
});

// GET manager page
router.get('/', function (req, res, next) {
    res.sendFile('/manager/manager_tools.html', { root: 'public' });
});

// Route to get organisations for a manager
router.get('/organisations', function (req, res) {
    const userId = req.session.user_id;

    const query = `SELECT Organisations.organisation_id, Organisations.organisation_name
                   FROM Managers_Table
                   INNER JOIN Organisations ON Managers_Table.organisation_id = Organisations.organisation_id
                   WHERE Managers_Table.user_id = ?`;


    connection.query(query, [userId], function (Qerr, results) {

        if (Qerr) {
            console.error('Query error:', Qerr);
            return res.sendStatus(500);
        }
        res.json(results);
    });
});


// Route to create an event or update event
router.post('/create_event', upload.single('image'), function (req, res) {
    console.log(req.body);
    console.log(req.file);
    const { name, description, date, time, location, org_id } = req.body;
    const image = req.file ? `../images/${req.file.filename}` : null;

    const query = `INSERT INTO Events (event_name, description, date, time, location, image, organisation_id)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;

    connection.query(query, [name, description, date, time, location, image, org_id], function (Qerr, results) {

        if (Qerr) {
            console.error('Query error:', Qerr);
            return res.sendStatus(500);
        }
        console.log('Event inserted successfully');
        res.sendStatus(200);
    });
});


// Route to update event
router.post('/edit_event', upload.single('image'), function (req, res) {
    const { event_id, name, description, date, time, location, org_id } = req.body;
    const image = req.file ? `../images/${req.file.filename}` : null;

    if (!req.file) {
        const query = `UPDATE Events SET event_name = ?, description = ?, date = ?, time = ?, location = ?, organisation_id = ?
        WHERE event_id = ?`;

        connection.query(query, [name, description, date, time, location, org_id, event_id], function (Qerr, results) {

            if (Qerr) {
                console.error('Query error:', Qerr);
                return res.sendStatus(500);
            }
            console.log('Event updated successfully');
            res.sendStatus(200);
        });
    } else {
        const query = `UPDATE Events SET event_name = ?, description = ?, date = ?, time = ?, location = ?, image = ?, organisation_id = ?
        WHERE event_id = ?`;

        connection.query(query, [name, description, date, time, location, image, org_id, event_id], function (Qerr, results) {

            if (Qerr) {
                console.error('Query error:', Qerr);
                return res.sendStatus(500);
            }
            console.log('Event updated successfully');
            res.sendStatus(200);
        });
    }


});

// Route to update post
router.post('/edit_post', upload.single('image'), function (req, res) {
    const postId = req.query.postId;
    const { title, description, org_id, visibility } = req.body;
    const image = req.file ? `../images/${req.file.filename}` : null;

    if (!req.file) {
        const query = `UPDATE Posts SET title = ?, description = ?, organisation_id = ?, visibility = ?
        WHERE post_id = ?`;

        connection.query(query, [title, description, org_id, visibility, postId], function (Qerr, results) {

            if (Qerr) {
                console.error('Query error:', Qerr);
                return res.sendStatus(500);
            }
            console.log('Event updated successfully');
            res.sendStatus(200);
        });
    } else {
        const query = `UPDATE Posts SET title = ?, description = ?, organisation_id = ?, image = ?, visibility = ?
        WHERE post_id = ?`;

        connection.query(query, [title, description, org_id, image, visibility, postId], function (Qerr, results) {

            if (Qerr) {
                console.error('Query error:', Qerr);
                return res.sendStatus(500);
            }
            console.log('Event updated successfully');
            res.sendStatus(200);
        });
    }

});

// edit organisation
// Route to update organization
router.post('/edit_organisation', upload.single('image'), function (req, res) {
    console.log(req.body);
    console.log(req.file);
    const { organisation_id, name, description } = req.body;
    const image = req.file ? `../images/${req.file.filename}` : null;

    const query = `UPDATE Organisations SET organisation_name = ?, description = ?, image = ? WHERE organisation_id = ?`;

    connection.query(query, [name, description, image, organisation_id], function (Qerr, results) {
        if (Qerr) {
            console.error('Query error:', Qerr);
            return res.sendStatus(500);
        }
        console.log('Organisation updated successfully');
        res.sendStatus(200);
    });
});

//get event information
router.get('/load_event_details', (req, res) => {
    const eventId = req.query.eventId;

    // Query the database to retrieve the event details
    const query = 'SELECT * FROM Events WHERE event_id = ?';
    connection.query(query, [eventId], function (error, results) {
        if (error) {
            console.error('Error fetching event details:', error);
            res.status(500);
        } else if (results.length === 0) {
            console.error('Event not found');
            res.status(404);
        } else {
            const eventDetails = results[0];
            res.json(eventDetails);
        }
    });
});

// get post details
router.get('/load_post_details', (req, res) => {
    const postId = req.query.postId;

    // Query the database to retrieve the event details
    const query = 'SELECT * FROM Posts WHERE post_id = ?';
    connection.query(query, [postId], function (error, results) {
        if (error) {
            console.error('Error fetching post details:', error);
            res.status(500);
        } else if (results.length === 0) {
            console.error('Post not found');
            res.status(404);
        } else {
            const eventDetails = results[0];
            res.json(eventDetails);
        }
    });
});

// Route to create an post
router.post('/create_post', upload.single('image'), function (req, res) {
    console.log(req.body);
    console.log(req.file);
    const { title, description, org_id, visibility } = req.body;
    const image = req.file ? `../images/${req.file.filename}` : null;

    const query = `INSERT INTO Posts (title, description, organisation_id, image, visibility)
               VALUES (?, ?, ?, ?, ?)`;

    connection.query(query, [title, description, org_id, image, visibility], function (Qerr, results) {
        if (Qerr) {
            console.error('Query error:', Qerr);
            return res.sendStatus(500);
        }
        console.log('post inserted successfully');
        res.sendStatus(200);
    });
});

router.get('/load-my-orgs', function (req, res, next) {
    var userId = req.session.user_id;
    let query = `SELECT o.organisation_id, o.organisation_name, o.description, o.image
    FROM
    Managers_Table mt
    JOIN
    Organisations o ON mt.organisation_id = o.organisation_id
    WHERE
    mt.user_id = ?;`;
    connection.query(query, [userId], function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

router.get('/load-my-events', function (req, res, next) {
    var userId = req.session.user_id;
    let query = `SELECT e.event_id, e.event_name, e.description FROM Events e
        JOIN
        Organisations o ON e.organisation_id = o.organisation_id
        JOIN
        Managers_Table mt ON o.organisation_id = mt.organisation_id
        WHERE
        mt.user_id = ?`;
    connection.query(query, [userId], function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

router.get('/load-my-posts', function (req, res, next) {
    var userId = req.session.user_id;
    let query = `SELECT p.post_id, p.title, p.description FROM Posts p
        JOIN
        Organisations o ON p.organisation_id = o.organisation_id
        JOIN
        Managers_Table mt ON o.organisation_id = mt.organisation_id
        WHERE
        mt.user_id = ?;`;
    connection.query(query, [userId], function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

router.post('/delete-event', function (req, res, next) {
    const eventId = req.body.eventId;
    if (!eventId) {
        res.status(400).send('Event ID is required');
        return;
    }

    let removeData = `DELETE FROM Joined_Events WHERE event_id = ?;`;
    connection.query(removeData, [eventId], function (error, results, fields) {
        if (error) throw error;
        let removeEvent = `DELETE FROM Events WHERE event_id = ?;`;
        connection.query(removeEvent, [eventId], function (error, results, fields) {
            if (error) throw error;

            if (results.affectedRows === 0) {
                res.status(404).send('Event Not Found');
            } else {
                res.sendStatus(200);
            }
        });
    });
});

router.post('/delete-post', function (req, res, next) {
    const postId = req.body.postId;
    if (!postId) {
        res.status(400).send('Post ID is required');
        return;
    }
    let removePosts = `DELETE FROM Posts WHERE post_id = ?`;
    connection.query(removePosts, [postId], function (error, results, fields) {
        if (error) throw error;

        if (results.affectedRows === 0) {
            res.status(404).send('Event Not Found');
        } else {
            res.sendStatus(200);
        }
    });
});

router.get('/manage_org_members', function (req, res, next) {
    const orgId = req.query.orgId;
    if (!orgId) {
        res.status(400).send('Organisation ID is required');
        return;
    }

    let orgQuery = `SELECT organisation_name FROM Organisations WHERE organisation_id = ?;`;
    connection.query(orgQuery, [orgId], function (error, orgResults, fields) {
        if (error) throw error;
        if (orgResults.length === 0) {
            res.status(404).send('Organisation not found');
            return;
        }
        const name = orgResults[0];

        let membersQuery = `
        SELECT user.given_name, user.family_name, user.user_id
        FROM Users user
        JOIN Users_Table member ON user.user_id = member.user_id
        WHERE member.organisation_id = ?;
    `;

        connection.query(membersQuery, [orgId], function (error, membersResults, fields) {
            if (error) throw error;

            let managersQuery = `
            SELECT user.given_name, user.family_name, user.user_id
            FROM Users user
            JOIN Managers_Table manager ON user.user_id = manager.user_id
            WHERE manager.organisation_id = ?;`;

            connection.query(managersQuery, [orgId], function (error, managerResults, fields) {
                if (error) throw error;
                const response = {
                    organisation: name,
                    members: membersResults,
                    managers: managerResults
                };
                res.send(JSON.stringify(response));
            });
        });
    });
});

router.post('/remove-org-members', function (req, res, next) {
    const orgId = req.body.orgId;
    const userId = req.body.userId;
    if (!orgId || !userId) {
        res.status(400).send('Event ID and User ID are required');
        return;
    }

    let query = `DELETE FROM Joined_Organisations WHERE user_id = ? AND organisation_id = ?`;
    connection.query(query, [userId, orgId], function (error, results, fields) {
        if (error) throw error;

        if (results.affectedRows === 0) {
            res.status(404).send('Org Member Not Found');
        } else {
            res.sendStatus(200);
        }
    });
});

router.get('/manage_individual_event', function (req, res, next) {
    const eventId = req.query.eventId;

    if (!eventId) {
        res.status(400).send('Event ID is required');
        return;
    }

    let eventQuery = `SELECT event_name FROM Events WHERE event_id = ?`;
    connection.query(eventQuery, [eventId], function (error, eventResults, fields) {
        if (error) throw error;
        if (eventResults.length === 0) {
            res.status(404).send('Event not found');
            return;
        }

        const event = eventResults[0];

        let rsvpQuery = `
            SELECT Users.given_name, Users.family_name, Users.user_id
            FROM Joined_Events
            JOIN Users ON Joined_Events.user_id = Users.user_id
            WHERE Joined_Events.event_id = ?
        `;
        connection.query(rsvpQuery, [eventId], function (error, rsvpResults, fields) {
            if (error) throw error;

            const response = {
                event: event,
                rsvps: rsvpResults
            };
            res.send(JSON.stringify(response));
        });
    });
});

router.post('/remove-rsvp', function (req, res, next) {
    const eventId = req.body.eventId;
    const userId = req.body.userId;

    if (!eventId || !userId) {
        res.status(400).send('Event ID and User ID are required');
        return;
    }

    let query = `DELETE FROM Joined_Events WHERE user_id = ? AND event_id = ?`;
    connection.query(query, [userId, eventId], function (error, results, fields) {
        if (error) throw error;

        if (results.affectedRows === 0) {
            res.status(404).send('RSVP not found');
        } else {
            res.sendStatus(200);
        }
    });
});

router.get('/am-i-manager', function (req, res, next) {
    res.sendStatus(304);
});


module.exports = router;