const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { promisify } = require('util');


const signToken = id => {
   
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password were provided
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2. Find the user and include the password field
  const user = await User.findOne({ email }).select('+password');

  // 3. Verify that the user exists and the password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 4. Generate a JWT
  const token = signToken(user._id);

  // 5. Send the token back to the client
  res.status(200).json({
    status: 'success',
    token
  });
});


exports.protect = catchAsync(async (req,res,next)=>{
//1) Gtting token and check  if its there
let token;
if(
req.headers.authorization && 
req.headers.authorization.startsWith('Beearer')
){
token = req.headers.authorization.splite(' ')[1];

}
console.log(token);
if(!token){
return next(
    new AppError('You are not logged in! Pleas log in to get acess.',401)
);

}
// 2 verificaiton Token 
const decoded = await promisify(jwt.verify)(
  token,
  process.env.JWT_SECRET
);

// 3 check if user still exists
const fershUser = await User.findById(decoded.id);
if(!ifreshUser){
  return next(
new AppError(
  'the user belogning ot his  tokne does no longer exist.',
  401
)

  );
}

// 4 check if user changed password after the token was issued
if(fershUser.changedPasswordAfter(decoded.iat)){
  return next(
    new AppError('User ercently changed password! Please log in again.',401)
  );
}
// Grant Acces To protected rout 
req. user = fershUser;
next();
})
exports.restrictTo = (...roles)=>{
return (req,res,next)=>{
//roues['admin','lead-guide']
if(!roles.includes(req.user.role)){
  return next(
new AppError('You do not have permission to perform this action',403)
  );
}
next();

}

exports.forgotPassword = catchAsync(async(req,res,next)=>{
//1 get user basd on posted email
const  user = await User.findOne({email : req.body.email});
if(!user){
  return next(new AppError('There is no user with email address',404));

}
//2) Generate the random rest token 
const resetToken = user.creatPasswordRestToken();
await user.save({validateBeforSave: false});




});







}

