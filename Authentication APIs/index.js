vvvvvvvvvvvvvconst express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// MySQL database connection
const connection = mysql.createConnection({
    host: 'your_mysql_host',
    user: 'your_mysql_user',
    password: 'your_mysql_password',
    database: 'your_database_name'
});

// Connect to MySQL
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database as id ' + connection.threadId);
});

// Endpoint to create a user
app.post('/user', [
    body('username').notEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const userData = req.body;
    connection.query('INSERT INTO users SET ?', userData, (error, results, fields) => {
        if (error) {
            console.error('Error creating user: ' + error.stack);
            res.status(500).json({ message: 'Error creating user' });
            return;
        }
        res.status(201).json({ message: 'User created successfully', user: userData });
    });
});

// Endpoint to update user data
app.put('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const userData = req.body;
    connection.query('UPDATE users SET ? WHERE id = ?', [userData, userId], (error, results, fields) => {
        if (error) {
            console.error('Error updating user: ' + error.stack);
            res.status(500).json({ message: 'Error updating user' });
            return;
        }
        res.json({ message: 'User data updated successfully', user: userData });
    });
});


// Endpoint to fetch user data
app.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    connection.query('SELECT * FROM users WHERE id = ?', userId, (error, results, fields) => {
        if (error) {
            console.error('Error fetching user data: ' + error.stack);
            res.status(500).json({ message: 'Error fetching user data' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json(results[0]);
        }
    });
});


// Endpoint to delete a user account
app.delete('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    connection.query('DELETE FROM users WHERE id = ?', userId, (error, results, fields) => {
        if (error) {
            console.error('Error deleting user: ' + error.stack);
            res.status(500).json({ message: 'Error deleting user' });
            return;
        }
        res.json({ message: 'User account deleted successfully' });
    });
});


// Endpoint to create a group
app.post('/group', (req, res) => {
    const groupData = req.body;
    connection.query('INSERT INTO groups SET ?', groupData, (error, results, fields) => {
        if (error) {
            console.error('Error creating group: ' + error.stack);
            res.status(500).json({ message: 'Error creating group' });
            return;
        }
        res.status(201).json({ message: 'Group created successfully', group: groupData });
    });
});

// Endpoint to update group data
app.put('/group/:groupId', (req, res) => {
    const groupId = req.params.groupId;
    const groupData = req.body;
    connection.query('UPDATE groups SET ? WHERE id = ?', [groupData, groupId], (error, results, fields) => {
        if (error) {
            console.error('Error updating group: ' + error.stack);
            res.status(500).json({ message: 'Error updating group' });
            return;
        }
        res.json({ message: 'Group data updated successfully', group: groupData });
    });
});





// Endpoint to fetch groups
app.get('/groups', (req, res) => {
    connection.query('SELECT * FROM groups', (error, results, fields) => {
        if (error) {
            console.error('Error fetching groups: ' + error.stack);
            res.status(500).json({ message: 'Error fetching groups' });
            return;
        }
        res.json(results);
    });
});


// Endpoint to delete a group
app.delete('/group/:groupId', (req, res) => {
    const groupId = req.params.groupId;
    connection.query('DELETE FROM groups WHERE id = ?', groupId, (error, results, fields) => {
        if (error) {
            console.error('Error deleting group: ' + error.stack);
            res.status(500).json({ message: 'Error deleting group' });
            return;
        }
        res.json({ message: 'Group deleted successfully' });
    });
});

// Endpoint to associate a user with a group
app.post('/user/:userId/group/:groupId', (req, res) => {
    const userId = req.params.userId;
    const groupId = req.params.groupId;
    connection.query('INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)', [userId, groupId], (error, results, fields) => {
        if (error) {
            console.error('Error associating user with group: ' + error.stack);
            res.status(500).json({ message: 'Error associating user with group' });
            return;
        }
        res.json({ message: 'User associated with group successfully', userId, groupId });
    });
});


// Endpoint to fetch groups associated with a user
app.get('/user/:userId/groups', (req, res) => {
    const userId = req.params.userId;
    connection.query('SELECT groups.* FROM groups INNER JOIN user_groups ON groups.id = user_groups.group_id WHERE user_groups.user_id = ?', userId, (error, results, fields) => {
        if (error) {
            console.error('Error fetching groups for user: ' + error.stack);
            res.status(500).json({ message: 'Error fetching groups for user' });
            return;
        }
        res.json(results);
    });
});

// Endpoint to disassociate a user from a group
app.delete('/user/:userId/group/:groupId', (req, res) => {
    const userId = req.params.userId;
    const groupId = req.params.groupId;
    connection.query('DELETE FROM user_groups WHERE user_id = ? AND group_id = ?', [userId, groupId], (error, results, fields) => {
        if (error) {
            console.error('Error disassociating user from group: ' + error.stack);
            res.status(500).json({ message: 'Error disassociating user from group' });
            return;
        }
        res.json({ message: 'User disassociated from group successfully', userId, groupId });
    });
});

// Endpoint to fetch members of a group
app.get('/group/:groupId/members', (req, res) => {
    const groupId = req.params.groupId;
    connection.query('SELECT users.* FROM users INNER JOIN user_groups ON users.id = user_groups.user_id WHERE user_groups.group_id = ?', groupId, (error, results, fields) => {
        if (error) {
            console.error('Error fetching members of group: ' + error.stack);
            res.status(500).json({ message: 'Error fetching members of group' });
            return;
        }
        res.json(results);
    });
});




// Endpoint to create an event
app.post('/event', (req, res) => {
    const eventData = req.body;
    connection.query('INSERT INTO events SET ?', eventData, (error, results, fields) => {
        if (error) {
            console.error('Error creating event: ' + error.stack);
            res.status(500).json({ message: 'Error creating event' });
            return;
        }
        res.status(201).json({ message: 'Event created successfully', event: eventData });
    });
});

// Endpoint to update event data
app.put('/event/:eventId', (req, res) => {
    const eventId = req.params.eventId;
    const eventData = req.body;
    connection.query('UPDATE events SET ? WHERE id = ?', [eventData, eventId], (error, results, fields) => {
        if (error) {
            console.error('Error updating event: ' + error.stack);
            res.status(500).json({ message: 'Error updating event' });
            return;
        }
        res.json({ message: 'Event data updated successfully', event: eventData });
    });
});



// Endpoint to fetch events
app.get('/events', (req, res) => {
    connection.query('SELECT * FROM events', (error, results, fields) => {
        if (error) {
            console.error('Error fetching events: ' + error.stack);
            res.status(500).json({ message: 'Error fetching events' });
            return;
        }
        res.json(results);
    });
});


// Endpoint to delete an event
app.delete('/event/:eventId', (req, res) => {
    const eventId = req.params.eventId;
    connection.query('DELETE FROM events WHERE id = ?', eventId, (error, results, fields) => {
        if (error) {
            console.error('Error deleting event: ' + error.stack);
            res.status(500).json({ message: 'Error deleting event' });
            return;
        }
        res.json({ message: 'Event deleted successfully' });
    });
});


// Endpoint to associate a user with an event
app.post('/user/:userId/event/:eventId', (req, res) => {
    const userId = req.params.userId;
    const eventId = req.params.eventId;
    connection.query('INSERT INTO user_events (user_id, event_id) VALUES (?, ?)', [userId, eventId], (error, results, fields) => {
        if (error) {
            console.error('Error associating user with event: ' + error.stack);
            res.status(500).json({ message: 'Error associating user with event' });
            return;
        }
        res.json({ message: 'User associated with event successfully', userId, eventId });
    });
});


// Endpoint to fetch events associated with a user
app.get('/user/:userId/events', (req, res) => {
    const userId = req.params.userId;
    connection.query('SELECT events.* FROM events INNER JOIN user_events ON events.id = user_events.event_id WHERE user_events.user_id = ?', userId, (error, results, fields) => {
        if (error) {
            console.error('Error fetching events for user: ' + error.stack);
            res.status(500).json({ message: 'Error fetching events for user' });
            return;
        }
        res.json(results);
    });
});


// Endpoint to disassociate a user from an event
app.delete('/user/:userId/event/:eventId', (req, res) => {
    const userId = req.params.userId;
    const eventId = req.params.eventId;
    connection.query('DELETE FROM user_events WHERE user_id = ? AND event_id = ?', [userId, eventId], (error, results, fields) => {
        if (error) {
            console.error('Error disassociating user from event: ' + error.stack);
            res.status(500).json({ message: 'Error disassociating user from event' });
            return;
        }
        res.json({ message: 'User disassociated from event successfully', userId, eventId });
    });
});


// Endpoint to fetch users associated with an event
app.get('/event/:eventId/users', (req, res) => {
    const eventId = req.params.eventId;
    connection.query('SELECT users.* FROM users INNER JOIN user_events ON users.id = user_events.user_id WHERE user_events.event_id = ?', eventId, (error, results, fields) => {
        if (error) {
            console.error('Error fetching users for event: ' + error.stack);
            res.status(500).json({ message: 'Error fetching users for event' });
            return;
        }
        res.json(results);
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
