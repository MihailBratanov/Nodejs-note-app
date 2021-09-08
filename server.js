require('rootpath')();

const app = require('./app');
const db= require('./db/index')

// start server
const port = process.env.PORT || 4000;
db.connect()
    .then(() => {app.listen(port,  () => {
    console.log('Server listening on port ' + port);
    });
})
.catch(err=>console.log(err));
