const express = require('express');
const Route= express.Router();
const moment = require('moment');
const db = require('../database');
const {isLoggedIn,isLogged} = require('../lib/aut')

Route.post('/add', isLoggedIn, async (req,res)=>{
    
    const now = new Date();
    
    const {name,email,phone_number,lead_status} = req.body;

    const dato = {
        name,
        email,
        phone_number,
        lead_status,
        created_at: now,
        user_id:req.user.user_id
    };
    const resultado = await db.query('INSERT INTO Clients SET ?',[dato]);
    req.flash('success','Operacion completada con exito');
    res.redirect('/clients');

});

Route.post('/edit/:client_id',isLoggedIn ,async(req,res )=>{

    const { client_id } = req.params;
    const { name, email, phone_number ,lead_status, last_activity,notes} = req.body; 
    const newClient = {
        name,
        email,
        phone_number,
        lead_status,
        last_activity,
        notes
    };
    await db.query('UPDATE Clients set ? WHERE client_id = ?', [newClient, client_id]);
    req.flash('success','Cambios guardados correctamente');
    res.redirect('/clients');
});

Route.get('/', isLoggedIn, async(req,res)=>{
        const client = await db.query('SELECT * FROM Clients WHERE user_id = ?',[req.user.user_id]);
        const section = 'Vista';
        
        client.forEach(client => {
            client.created_at = moment(client.created_at).format('DD / MM / YYYY');
            
            if(client.last_activity != null){
                client.last_activity = moment(client.last_activity).format('DD/MM/YYYY');
            }
            
        });    
        res.render('Clients/list.hbs', {client}); 
    });

Route.get('/prueba', isLoggedIn,(req,res)=>{
    res.render('./Clients/prueba.hbs')
})


Route.get('/add', isLoggedIn, (req,res)=>{
    res.render('./Clients/Add.hbs');
});

Route.get('/delete/:client_id', isLoggedIn, async (req,res)=>{
    
    const {client_id} = req.params;

    await db.query('DELETE FROM Clients WHERE client_id = ?',[client_id]);
    req.flash('success','Operacion completada con exito');
    res.redirect('/clients');
});

Route.get('/edit/:client_id', isLoggedIn, async (req,res)=>{

    const { client_id } = req.params;
    const client = await db.query("SELECT * FROM Clients WHERE client_id = ? ",[client_id]);
    res.render('./Clients/edit.hbs', {client: client[0]});
});

module.exports = Route;