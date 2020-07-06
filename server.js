/* global process */

const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const login = require('./controllers/login');
const image = require('./controllers/image');
const profile = require('./controllers/profile');
const auth = require('./controllers/authorization');

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.POSTGRES_URI,
        ssl: false        
    }
});

const app = express();

app.use(morgan('combined'));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send('Node It Works!!'); });
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfile(req, res, db); });
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db); });
app.post('/signin', (req, res) => { login.loginAuthentication(req, res, db, bcrypt); });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt); });
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db); });
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApi(req, res); });

app.listen(process.env.PORT || 3001, () => { console.log(`App is running on port ${process.env.PORT}`); });