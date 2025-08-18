import mongoose from "mongoose";
mongoose.set('strictQuery', true)


const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter name"],
    },

    photos: [{
      public_id: {
        type: String,
        required: [true, "Please Enter photo public_id"],
      },
      url: {
        type: String,
        required: [true, "Please Enter photo url"],
      },
    }],
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
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
