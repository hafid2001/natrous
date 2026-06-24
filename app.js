const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorhandling = require('./controllers/errorController');
const ratelimit = require('express-rate-limit');
const helmet = require('helmet');
const { whitelist } = require('validator');
const hpp = require('hpp');


const app = express();
//set security Http headers
app.use(helmet());

// 1) Globale   MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = ratelimit({
max: 100,
windowMs : 60 * 60* 1000,
message : 'too many req from this ip , please try again in an hour'
});

app.use('/api',limiter);
//Body pareser, reading data from body into req.body 
app.use(express.json({limit : '10kb'}));
//Data snitization against Nosql query injection
//app.use(mongoSanitize());
//Data sanitization
//app.use(xss());
// prevet parameter pollution 
app.use(
hpp({


  whitelist:['duration ']
})



);


//serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// Route to serve Mapbox token to frontend
app.get('/api/v1/config/mapbox', (req, res) => {
  res.json({ token: process.env.MAPBOX_TOKEN });
});



app.all('*',(req,res,next)=>{
  next(new AppError(`cant find ${req.originalUrl} on this server`,404));

});
app.use(globalErrorhandling);

module.exports = app;
