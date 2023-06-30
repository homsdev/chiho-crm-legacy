const express = require('express');
const Route = express.Router();
const db= require('../database');
const moment = require('moment');

Route.get('/',async(req,res)=>{
    const Reports = await db.query('SELECT *FROM Reports')
    Reports.forEach(Reports => {
        Reports.created_at = moment(Reports.created_at).format('DD/MM/YYYY');
    });
    res.render('Reports/view_report.hbs',{Reports})
})

Route.get('/add',(req,res)=>{
    res.render('Reports/add');
})

Route.post('/add',async(req,res)=>{
    //res.send('Datos Recibidos'); // Prueba
    //console.log(req.body); Muestra por consola
    const {status,description,incident} = req.body;
    const now = new Date();
    const newreport = {
        status,
        description,
        incident,
        created_at : now 
    } 
    await db.query('INSERT INTO Reports SET ?', [newreport]);
    res.redirect('/Reports')
})

Route.get('/edit',(req,res)=>{
})

Route.get('/delete',(req, res)=>{
    res.send('Elija el reporte a eliminar')
})

Route.get('/peticion',(req, res)=>{
    res.send('Respuesta a peticion')
})

module.exports = Route;