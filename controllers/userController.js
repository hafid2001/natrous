const User = require('../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

exports.updateMe= catchAsync( async(req,res,next)=>{
//1) Creat error if user Posts passwrod data
if(req.body.passwrod || req.body.passwrodConfirm){
  return next(new AppError('This route is not for passwrod updates. Please use /updateMyPassword',400));
}
//2 update user document 
//filer the fiel not allowd 
const filterdBody = filterObj(req.body, 'name','email');

const udpateUser = await User.findByIdAndUpdate(req.User.id,filterdBody,{
new : true,
runValidators:true
});

res.status(200).json({
status:'success',
data:{
user:this.updateUser
}


});




});
  exports.deleteMe = catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false});
    res.status(204).json({
    status:'succes',
    data:null
    });

});


exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
