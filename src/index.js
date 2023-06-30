const express = require ('express');
const morgan = require('morgan');
const hbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const sqlsession = require('express-mysql-session');
const passport = require('passport');

const {database} =require('./keys');
//Inicializando
const app = express(); //Aplicacion principal
require('./lib/passport');

///configuraciones

app.set('port',process.env.PORT || 4000);

app.set('views',path.join(__dirname,'views'));

app.engine('.hbs',hbs({
            defaultLayout: 'Main',
            layoutDir: path.join(app.get('views'),'layouts'),
            partialsDir: path.join(app.get('views'),'partials'),
            extname: 'hbs',
            helpers: require('./lib/handlebars')
}));

app.set('view engine', '.hbs');


///middleware
app.use(session({
    secret: 'mi session',
    resave: false,
    saveUninitialized: false,
    store: new sqlsession(database)
}));
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})); ///para aceptar datos desde los formularios
app.use(flash());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
///Variables Globales

app.use((req,res,next)=>{
    app.locals.success = req.flash('success');
    app.locals.danger = req.flash('danger');
    app.locals.SesionUser = req.user;
    next();
});

///rutas
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/clients',require('./routes/clients'));
app.use('/Reports',require('./routes/report'));
///publico
app.use(express.static(path.join(__dirname,'public')));

///Inializando servidor

app.listen(app.get('port'), ()=>{
    console.log('Servidor en el puerto',app.get('port'));
});



