const mongoose = require("mongoose");
const dataSc = require("../models/listening");
const datas=require("./data.js");


// MongoDB connection function

main()
.then((res)=>{
    console.log("mongoDb connection succesfull");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/prdb");
  };
  


const initDb=async ()=>{
    await dataSc.deleteMany({});
    await dataSc.insertMany(datas.data);
    console.log("data was initialized");
};

initDb();