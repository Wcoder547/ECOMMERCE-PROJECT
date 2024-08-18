import mongoose from "mongoose";


 
const productSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      required: [true, "Please Enter name"],
    },
   
    photo: {
      type: String,
      required: [true, "Please Enter photo"],
    },
    price: {
      type: Number,
      required: [true, "Please Enter price"],
    },
    stock: {
      type: Number,
      required: [true, "Please Enter stock"],
    },
    category: {
      type: String,
      required: [true, "Please Enter category"],
      trim:true
    },
  
  },
  {
    timestamps: true,
  }
);


export const Prodcut = mongoose.model("Prodcut", productSchema);


