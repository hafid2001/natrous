const mongoose = require('mongoose');
const slugify= require('slugify');
const User = require('./userModel');


const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true
    },

    slug: String,

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty']
    },

    ratingAverage: {
      type: Number,
      default: 4.5
    },

    ratingQuantity: {
      type: Number,
      default: 0
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },

    priceDiscount: Number,

    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },

    description: {
      type: String,
      trim: true
    },

    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },

    images: [String],

    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },

    startDates: [Date],

    secretTour: {
      type: Boolean,
      default: false
    },

    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: Array
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


tourSchema.virtual('durationweeks').get(function(){
  return this.duration / 7
});

//Virtual populate
tourSchema.virtual('reviews',{
  ref:'Review',
  foreignField:'tour',
  localField:'_id'
});



//documtn middleware : runs before .save() and .create() , and not noooot before .insertMany()
tourSchema.pre('save',function(next){
this.slug= slugify(this.name,{lower:true});
next();
   
});




/*
tourSchema.post('save',function(doc,next){(
  console.log(doc);
  next();
});
*/
//query middleware
tourSchema.pre(/^find/,function(next){
  this.populate({
    path:'guides',
    select:'-__v -passwordChangedAt'
  }
  );
  next()
});



const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
