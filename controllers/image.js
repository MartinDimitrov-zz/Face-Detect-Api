const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '301c610023e540bf9c5554abf72f76b5'
});

const handleApi = (req, res) => { 
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('unable to work with API')); 
};

const handleImage = (req, res, db) => {
    const { id } = req.body;
    
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('Unable to get entries'));
};

module.exports = {
    handleImage: handleImage,
        handleApi: handleApi
};