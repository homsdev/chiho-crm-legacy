const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypt = require('../lib/helpers');
const db = require('../database');


passport.use('local.signin',new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req,username,password, done)=>{
    console.log(req.body);
    //console.log(username);
    //console.log(password);
    result= await db.query('SELECT *FROM Users WHERE BINARY username like ?',[username]);
    console.log(result);
    if(result.length >0){
        const user = result[0];
        
        const match=await crypt.decrypt_pass(password,user.password);
        if(match){
            console.log(user);
            done(null,user,req.flash('sucess','Bienvenido'+user.username));   
        }
        else{
            done(null,false,req.flash('danger','Contraseña Incorrecta'));
            console.log('password no correcto');
        }
    }

    else{
        return done(null,false,req.flash('danger','No existe el usuario'));
    }

}));

passport.use('local.signup',new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},async(req,username,password,done)=>{

    const {name, lastname,company_name,email,charge} = req.body;
    const newUser= {
        username,
        password,
        name,
        lastname,
        company_name,
        email,
        charge
    };

    newUser.password = await crypt.encrypt_pass(password);

    const result = await db.query('INSERT INTO Users SET ?',[newUser]);
    console.log(result);
    newUser.user_id = result.insertId;
    return done(null,newUser);
}));

passport.serializeUser((user,done)=>{
    console.log(user.user_id);
    done(null,user.user_id);
});

passport.deserializeUser(async(id,done)=>{
    const rows = await db.query('SELECT *FROM Users WHERE user_id = ?',[id]);
    done(null,rows[0]); 
});