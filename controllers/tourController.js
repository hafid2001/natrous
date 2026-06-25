const APIFeatures = require('./../utils/apiFeatures');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  next();
};


exports.createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
});
});

exports.getALLTours = async (req, res) => {
  try {
    // Build the query with filter, sort, limitFields, and pagination
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
      
      


    const tours = await features.query;

    // send REsponse
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message || 'An error occurred'
    });
  }
};
const mongoose = require('mongoose');

exports.getTour = catchAsync(async (req, res, next) => {

  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new AppError('Invalid Tour ID', 400));
  }

  const tour = await Tour.findById(req.params.id).populate('reviews');

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });

});
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: { tour }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};
exports.getToursStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 1} }
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$ratingsAverage" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          numTours: { $sum: 1 }
        }
      },
      {
        $sort:{avgPrice : 1 }
      }
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message
    });
  }
};
