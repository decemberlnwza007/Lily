const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const userRoute = require('./route/user.route');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}))

app.get('/', (req, res) => {
    res.json('Hello Node')
})

app.use('/', userRoute);

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
})