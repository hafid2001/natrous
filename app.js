const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorhandling = require('./controllers/errorController');
const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
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
