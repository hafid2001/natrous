const mongoose = require('mongoose');

const dotenv = require('dotenv');
 process.on('uncaughException',err=>{
console.log('UNCAUGHT EXEPTION! SUHUTTING DOWN....');

console.log(err.name,err.message);

process.exit(1);





 }); 


dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch(err => {
    console.log('DB connection error:', err);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//unandled Rejection 

process.on('unhandledRejection',err=>{
  console.log(err.name,err.message);
  console.log('UNHANDLED REJECTION! SHuting down ... ');
  server.close(()=>{

process.exit(1);
  });


});

process.on('uncaughtException', err => {
  console.log(err.name, err.message);

  console.log('UNCAUGHT EXCEPTION! Shutting down...');

  process.exit(1);
});

