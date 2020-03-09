const crypt= require('bcryptjs')
const helpers = {}; 

helpers.encrypt_pass = async(password) =>{

    const salt = await crypt.genSalt(10);
    const hash = await crypt.hash(password,salt);
    return hash;
};

helpers.decrypt_pass = async(box, data) =>{
    try{
         return await crypt.compare(box,data);
    }catch(err){
        console.log(err);
    }
};

module.exports = helpers;