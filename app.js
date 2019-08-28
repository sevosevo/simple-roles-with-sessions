const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT;
const secret = 'passwordforsecret';


const isAuthenticated = (req, res, next) => {
    console.log(req.session);
    if(req.session) {
        if(req.session.user) {
            return next();
        }
    }
    return next('Not authenticated');
};
const roles = roles => (req, res, next) => {
    const user_roles = req.session.roles;
    const i = user_roles.some(role => roles.includes(role));
    if( i ) 
        return next()
    return next('Only '+roles.join(', ')+' are allowed to access this page.');
}

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    store: new MongoDBStore({ uri: 'mongodb+srv://root:sevo1389@practice-hsewl.mongodb.net/test?retryWrites=true&w=majority', collection: 'sessions' }),
    secret,
    resave: false,
    saveUninitialized: false
}));

app.get('/login', (req, res, next) => {
    req.session.user = {
        username: 'Vukasin'
    };
    req.session.roles = ['moderator'];
    req.session.save((err) => {
        if( err ) return next(err);
        res.status(200).send('Logged in');
    });
});

app.get('/private', isAuthenticated, roles(['admin']), (req, res, next) => {
    res.send('Private area');
});

app.listen(PORT, () => console.log('Server is listening to port '+PORT));
