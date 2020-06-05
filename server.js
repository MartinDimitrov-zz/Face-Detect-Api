const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const login = require('./controllers/login');
const image = require('./controllers/image');
const profile = require('./controllers/profile');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'martin',
        password: '',
        database: 'facedetector'
    }
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send(); });
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db); });
app.post('/signin', (req, res) => { login.handleLogin(req, res, db, bcrypt); });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt); });
app.put('/image', (req, res) => { image.handleImage(req, res, db); });
app.post('/imageurl', (req, res) => { image.handleApi(req, res); });

app.listen(process.env.PORT || 3001, () => { console.log(`App is running on port ${process.env.PORT}`); });
