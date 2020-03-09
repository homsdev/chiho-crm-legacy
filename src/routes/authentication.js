const express = require('express');
const db = require('../database');
const passport = require('passport');
const {isLoggedIn, isLogged}= require('../lib/aut');
const Route= express.Router();

///Peticiones Tipo Get

Route.get('/signup', isLogged, (req,res)=>{

    res.render('authentication/signup.hbs');
});

Route.get('/signin', isLogged, (req,res)=>{
    res.render('authentication/signin.hbs')
});

Route.get('/profile', isLoggedIn,(req,res)=>{
        res.render('profile.hbs')
});

Route.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/signin');
});

///Peticones Tipo Post

Route.post('/signup',passport.authenticate('local.signup',{
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

Route.post('/signin',(req, res, next)=>{
    passport.authenticate('local.signin',{
        successRedirect: '/clients',
        failureRedirect: '/signin',
        failureFlash: true
    })(req,res,next);
});


//Route.post('/signup',passport.authenticate('local.signup',{
    //successRedirect: '/profile',
    //failureRedirect: '/signin',
  //  failureFlash: true
//}));



module.exports = Route;