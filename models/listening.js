const mongoose = require("mongoose");
const { type, max, $ } = require("../validateSchema/productSchema.js");
const review=require("./review.js");
const User=require("./user.js")

// Define the schema for the image field
const ImageSchema = new mongoose.Schema({
    _id:false,
    filename: {
        type: String,
    },
    url: {
        type: String,
        set: (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1661908377130-772731de98f6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG91c2V8ZW58MHx8MHx8fDA%3D" : v,
    }
});

// Define the main schema for the property
const Dataschema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: ImageSchema,
    },
    price: {
        type: Number,
        required: true,
    
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    review:[{ 
        type:  mongoose.Schema.Types.ObjectId,
        ref:"review"
    }
    ],

    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    Geolocation:{
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
        
    }
});


Dataschema.post("findOneAndDelete", async(product)=>{
    await review.deleteMany({_id:{$in:product.review}});
});

// Create the model from the schema
const sampleDAta = mongoose.model("sampleDAta", Dataschema);

module.exports = sampleDAta;
