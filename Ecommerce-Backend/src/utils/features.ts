import mongoose from "mongoose";
mongoose.set('strictQuery', true);//The warning is just a heads-up about the upcoming change in Mongoose 7. By setting strictQuery explicitly now, you can control whether you want to use the strict or non-strict query mode, avoiding any surprises when you eventually upgrade to Mongoose 7

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      "mongodb://localhost:27017",{
        dbName:"ecommerce24"
      }
    );
    console.log(
      `\n MONGODB CONNECTD !! HOST DB:${connectionInstance.connection.host}`
    ),
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true };
  } catch (error) {
    console.log("MONGO DB CONNECTION Error:", error);
    process.exit(1);
  }
};

export default connectDb;