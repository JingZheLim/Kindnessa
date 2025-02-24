var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const saltRounds = 10; // Define the number of salt rounds for bcrypt

var connection = require('../database_connect.js');

const multer = require('multer');

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


function checkAdmin(req, res, next) {
    const userId = req.session.user_id;
    if (userId === undefined) {
        // User not logged in
        res.sendStatus(401);
    } else {
        // User logged in
        // Set query to ask the database is that user is admin
        let query = `SELECT Role FROM Users WHERE user_Id = ?;`;
        connection.query(query, [userId], function (error, results, fields) {
            if (error) throw error;
            const role = results[0].Role;
            if (role === "admin") {
                next();
            } else {
                res.sendStatus(401);
            }
        });
    }
}


router.use('/*', checkAdmin, function (req, res, next) {
    next();
});

// GET admin page
router.get('/', function (req, res, next) {
    res.sendFile('/admin/admin_tools.html', { root: 'public' });
});

router.get('/create_org', function (req, res, next) {
    res.sendFile('/admin/create_org.html', { root: 'public' });
});


router.get('/load-all-orgs', function (req, res, next) {
    let query = `SELECT organisation_name, organisation_id FROM Organisations`;
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

router.get('/load-all-events', function (req, res, next) {
    let query = `SELECT event_id, event_name, description FROM Events`;
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

router.get('/load-all-posts', function (req, res, next) {
    let query = `SELECT title, description, post_id FROM Posts`;
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

router.get('/load-all-users', function (req, res, next) {
    let userManagers = `SELECT given_name, family_name, user_id, role FROM Users WHERE role IN ('user', 'manager');`;
    connection.query(userManagers, function (error, UMresults, fields) {
        if (error) throw error;
        let admins = `SELECT given_name, family_name, user_id, role FROM Users WHERE role IN ('admin');`;
        connection.query(admins, function (error, adminResults, fields) {
            if (error) throw error;
            const response = {
                users: UMresults,
                admins: adminResults
            };
            res.send(JSON.stringify(response));
        });
    });
});

router.post('/delete-organisation', function (req, res, next) {
    const orgId = req.body.orgId;
    if (!orgId) {
        res.status(400).send('Organisation ID is required');
        return;
    }
    // post
    let removePosts = `DELETE p FROM Posts p
                    JOIN Organisations o ON p.organisation_id = o.organisation_id
                    WHERE o.organisation_id = ?;`;
    connection.query(removePosts, [orgId], function (error, results, fields) {
        if (error) throw error;
        // event
        let removeEvents = `DELETE e FROM Events e
                    JOIN Organisations o ON e.organisation_id = o.organisation_id
                    WHERE o.organisation_id = ?;`;
        connection.query(removeEvents, [orgId], function (error, results, fields) {
            if (error) throw error;
            // users
            let removeUsers = `DELETE FROM Users_Table WHERE organisation_id = ?;`;
            connection.query(removeUsers, [orgId], function (error, results, fields) {
                if (error) throw error;
                // managers
                let removeManagers = `DELETE FROM Managers_Table WHERE organisation_id = ?;`;
                connection.query(removeManagers, [orgId], function (error, results, fields) {
                    if (error) throw error;

                    // user's joined org
                    let removeJoinOrgs = `DELETE FROM Joined_Organisations WHERE organisation_id = ?;`;
                    connection.query(removeJoinOrgs, [orgId], function (error, results, fields) {
                        if (error) throw error;

                        let removeOrg = `DELETE FROM Organisations WHERE organisation_id = ?;`;
                        connection.query(removeOrg, [orgId], function (error, results, fields) {
                            if (error) throw error;

                            if (results.affectedRows === 0) {
                                res.status(404).send('Organisation Not Found');
                            } else {
                                res.sendStatus(200);
                            }
                        });
                    });
                });
            });
        });
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

router.post('/delete-user', function (req, res, next) {
    const userId = req.body.userId;
    console.log(userId);
    if (!userId) {
        res.status(400).send('User ID is required');
        return;
    }
    // joined events
    let removeEvents = `DELETE FROM Joined_Events WHERE user_id = ?`;
    connection.query(removeEvents, [userId], function (error, results, fields) {
        if (error) throw error;
        // joined organisations
        let removeOrganisations = `DELETE FROM Joined_Organisations WHERE user_id = ?`;
        connection.query(removeOrganisations, [userId], function (error, results, fields) {
            if (error) throw error;
            // Users_Table
            let removeUser = `DELETE FROM Users_Table WHERE user_id = ?`;
            connection.query(removeUser, [userId], function (error, results, fields) {
                if (error) throw error;
                // Managers_Table
                let removeManager = `DELETE FROM Managers_Table WHERE user_id = ?`;
                connection.query(removeManager, [userId], function (error, results, fields) {
                    if (error) throw error;

                    // Admins_Table
                    let removeAdmin = `DELETE FROM Admins_Table WHERE user_id = ?`;
                    connection.query(removeAdmin, [userId], function (error, results, fields) {
                        if (error) throw error;

                        // Actual User
                        let removeUser = `DELETE FROM Users WHERE user_id = ?`;
                        connection.query(removeUser, [userId], function (error, results, fields) {
                            if (error) throw error;

                            if (results.affectedRows === 0) {
                                res.status(404).send('User Not Found');
                            } else {
                                res.sendStatus(200);
                            }
                        });
                    });
                });
            });
        });
    });
});

router.post('/set-admin', function (req, res, next) {
    const userId = req.body.userId;
    if (!userId) {
        res.status(400).send('User ID are required');
        return;
    }
    let setAdmin = `UPDATE Users SET role = 'admin' WHERE user_id = ?;`;
    connection.query(setAdmin, [userId], function (error, results, fields) {
        if (error) throw error;

        if (results.affectedRows === 0) {
            res.status(404).send('cannot set user as admin');
        } else {
            let adminTable = `INSERT INTO Admins_Table (user_id) VALUES (?);`;
            connection.query(adminTable, [userId], function (error, results, fields) {
                if (error) throw error;

                if (results.affectedRows === 0) {
                    res.status(404).send('Failed to insert to Admins_Table');
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});

router.post('/remove-admin', function (req, res, next) {
    const userId = req.body.userId;
    if (!userId) {
        res.status(400).send('User ID are required');
        return;
    }

    let updateRole = `UPDATE Users u SET u.role = (SELECT IF( EXISTS (
    SELECT 1 FROM Managers_Table WHERE user_id = ?), "manager", "user")) WHERE u.user_id = ?;`;
    connection.query(updateRole, [userId, userId], function (error, results, fields) {
        if (error) throw error;

        if (results.affectedRows === 0) {
            res.status(404).send('cannot update user Role');
        } else {
            let deleteAdmin = `DELETE FROM Admins_Table WHERE user_id = ?;`;
            connection.query(deleteAdmin, [userId], function (error, results, fields) {
                if (error) throw error;

                if (results.affectedRows === 0) {
                    res.status(404).send('Failed to delete from Admins_Table');
                } else {
                    res.sendStatus(200);
                }
            });
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

router.post('/set-manager', function (req, res, next) {
    const orgId = req.body.orgId;
    const userId = req.body.userId;
    if (!orgId || !userId) {
        res.status(400).send('Event ID and User ID are required');
        return;
    }

    let makeManager = `DELETE FROM Users_Table WHERE user_id = ? AND organisation_id = ?`;
    connection.query(makeManager, [userId, orgId], function (error, results, fields) {
        if (error) throw error;

        if (results.affectedRows === 0) {
            res.status(404).send('Org Member Not Found in Users_Table');
        } else {
            let updateManager = `INSERT INTO Managers_Table (user_id, organisation_id) VALUES (?, ?)`;
            connection.query(updateManager, [userId, orgId], function (error, results, fields) {
                if (error) throw error;

                if (results.affectedRows === 0) {
                    res.status(404).send('Failed to insert to Managers_Table');
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });


});

router.post('/remove-manager', function (req, res, next) {
    const orgId = req.body.orgId;
    const userId = req.body.userId;
    if (!orgId || !userId) {
        res.status(400).send('Event ID and User ID are required');
        return;
    }
    let makeUser = `DELETE FROM Managers_Table WHERE user_id = ? AND organisation_id = ?`;
    connection.query(makeUser, [userId, orgId], function (error, results, fields) {
        if (error) throw error;

        if (results.affectedRows === 0) {
            res.status(404).send('Org Member Not Found in Users_Table');
        } else {
            let updateUser = `INSERT INTO Users_Table (user_id, organisation_id) VALUES (?, ?)`;
            connection.query(updateUser, [userId, orgId], function (error, results, fields) {
                if (error) throw error;

                if (results.affectedRows === 0) {
                    res.status(404).send('Failed to insert to Managers_Table');
                } else {
                    res.sendStatus(200);
                }
            });
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

router.get('/am-i-admin', function (req, res, next) {
    res.sendStatus(304);
});

// POST route to create an organisation
router.post('/create_organisation', upload.single('image'), function (req, res) {
    console.log(req.body);
    console.log(req.file);

    const { name, description } = req.body;
    const image = req.file ? `../images/${req.file.filename}` : null;

    const query = `INSERT INTO Organisations (organisation_name, description, image)
                   VALUES (?, ?, ?)`;

    connection.query(query, [name, description, image], function (Qerr, results) {
        if (Qerr) {
            console.error('Query error:', Qerr);
            return res.sendStatus(500);
        }
        console.log('Organisation inserted successfully');
        res.sendStatus(200);
    });
});


// FOR MANAGING THE USER
// get request to fetch user account info
router.get('/account-info', (req, res) => {

    const userId = req.query.user_id;

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
    const { firstName, lastName, email } = req.body;
    const userId = req.query.user_id; // Use userId from session for security

    // SQL query to update the user information
    const updateSql = 'UPDATE Users SET given_name = ?, family_name = ?, email = ? WHERE user_id = ?';
    const updateParams = [firstName, lastName, email, userId];

    connection.query(updateSql, updateParams, (err, result) => {
        if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ success: false, message: 'Update error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'Profile updated successfully' });
    });
});


// Post request for the delete-account route
router.post('/delete-account', (req, res) => {
    // get user id from session
    const userId = req.query.user_id;

    // The query to delete the user account
    const deleteSql = 'DELETE FROM Users WHERE user_id = ?';

    connection.query(deleteSql, [userId], (err, result) => {
        if (err) {
            console.error('Error deleting account:', err);
            return res.status(500).json({ message: 'Error deleting account' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
        });

        res.json({ message: 'Account successfully deleted' });
    });
});

module.exports = router;