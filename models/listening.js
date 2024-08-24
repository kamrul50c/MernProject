const mongoose = require("mongoose");

// Define the schema for the image field
const ImageSchema = new mongoose.Schema({
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
    }
});

// Create the model from the schema
const sampleDAta = mongoose.model("sampleDAta", Dataschema);

module.exports = sampleDAta;
