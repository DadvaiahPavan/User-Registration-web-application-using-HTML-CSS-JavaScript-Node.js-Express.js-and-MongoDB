const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect("mongodb://0.0.0.0:27017/tutorial", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('mongodb connected');
    })
    .catch(() => {
        console.log('error');
    });

const tutSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('tan', tutSchema);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/register', async (req, res) => {
    const newUser = new User({
        Username: req.body.username,
        Email: req.body.email,
        Password: req.body.password
    });

    try {
        await newUser.save();
        // Respond with a new HTML page upon successful registration
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Registration Successful</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        margin-top: 100px;
                    }
                    h1 {
                        font-size: 36px;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <h1>Thank You for Registration!</h1>
            </body>
            </html>
        `);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
