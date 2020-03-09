const express = require('express');
const Route = express.Router();
const db= require('../database');
const moment = require('moment');

Route.get('/',(req,res)=>{
    res.send('Apartado Reportes');
})

module.exports = Route;