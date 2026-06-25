const Review= require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');


exports.creatReview = catchAsync(async (req,res,next)=>{

//Allow nested routes
if(!req.body.tour) req.body.tour = req.params.tourId;

if(!req.body.user) req.body.user = req.user.id;

const newReview = await Review.create(req.body);





})