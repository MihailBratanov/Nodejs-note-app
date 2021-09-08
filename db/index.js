const config = require('../config.json');
const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: false};


function connect(){
    return new Promise((resolve, reject)=> {

    if(process.env.NODE_ENV==='test'){
        const Mockgoose= require('mockgoose').Mockgoose;
        const mockgoose = new Mockgoose(mongoose);

        mockgoose.prepareStorage()
        .then(() =>{
           
            mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions)
            .then((res, err)=>{
               if(err) return reject(err);
               resolve(); 
            })
        })
    }
    else{

            mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions)
            .then((res, err)=>{
               if(err) return reject(err);
               resolve(); 
            })    
    }
});
}


function close(){
   return mongoose.disconnect()
}

module.exports = {
    User: require('../users/user.model'), 
    connect, 
    close
};