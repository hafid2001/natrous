const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// name,email,photo ,password, passwrodConfirme
const userSchema = new mongoose.Schema({
name:{
type: String,
require: [true,'Pleas tell use your name!']
},
email:{
type : String,
require :[true,'Please provide your email'],
unique:true,
lowercase: true,
validate:[validator.isEmail,'Pleas pricde a valid email']

},
photo : String,  
password:{
    type:String,
    required: [true,'Pleas provide a password'],
    minlength:8
},
passwordConfirm:{
type:String,
rquired:[true,'Please confirm you password'],
validate:{
//This only  works on SAVE!!
validator:function(el){
    return el === this.password;
 },
 message:'Password are not the same '


}

}

});
userSchema.pre('save',async function(next){
//only run this function if password was actully modified
if(!this.isModified('password'))return next();
//Hash the password with cost of 12
this.password = await bcrypt.hash(this.password,12);

//Delete passwordConfirm field 
this.passwordConfirm = undefined;
next();


});




const User= mongoose.model('User',userSchema);

module.exports = User;






















