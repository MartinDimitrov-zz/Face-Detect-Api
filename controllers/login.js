const jwt = require('jsonwebtoken');
const redis = require('redis');
const { response } = require('express');

const redisClient = redis.createClient(process.env.REDIS_URI);

const handleLogin = (req, res, db, bcrypt) => {
    
    const { email, password } = req.body;
    if(!email || !password) {
        return Promise.reject('bad form submission');
    }

    return db.select('email', 'hash')
        .from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users').where('email', '=', req.body.email)
                        .then(user => user[0])
                        .catch(err => Promise.reject('unable to get user'));
            } else {
                Promise.reject('wrong credentials');
            }
        })
        .catch(err => Promise.reject('wrong credentials'));
};

const getAuthTokenId = (req, res) => {
    const { authorization } = req.headers;

    return redisClient.get(authorization, (err, replay) => {
        if(err || !replay) {
            return res.status(400).json('Unauthorize');
        }
        return res.json({id: replay});
    });
};

const signToken = (email) => {
    const jwtPayload = { email };

    return jwt.sign(jwtPayload, 'JWT-ST', { expiresIn: '2 days'});
};

const setToken = (token, id) => {
    return Promise.resolve(redisClient.set(token, id));
};

const createSessions = user => {
    const { email, id } = user;
    const token = signToken(email);

    return setToken(token, id)
    .then(() => { 
        return {success: 'true', userId: id, token};
    })
    .catch(console.log());
};

const loginAuthentication = (db, bcrypt) => (req, res) => {
    const { authorization } = req.headers;

    return authorization ? getAuthTokenId(req, res) : handleLogin(db, bcrypt, req, res).then(
        data => {
            return data.id && data.email ? createSessions(data) : Promise.reject('Reject');
        })
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err));
};

module.exports = {    
    loginAuthentication: loginAuthentication,
    redisClient: redisClient
};