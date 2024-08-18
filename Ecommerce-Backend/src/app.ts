
import express from 'express';
import userRouter from "./routes/user.route.js"
import productRoute from "./routes/product.route.js"

const port=4000;
const app = express();

app.get("/",(req,res)=>{
    res.send('API working with/api/v1')
})
app.use(express.json())
app.use('/uploads',express.static("uploads"))


import connectDb from "./utils/features.js";
connectDb()
  .then(() => {
    app.on("Erorr", (err) => {
      console.error("Error:", err);
      throw err;
    });

    app.listen(port|| 8000, () => {
      console.log(`Server is running on PORT:${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB CONNECTION FAILED !! ", err);
  });


//using Routes
app.use("/api/v1/user",userRouter)
app.use("/api/v1/product",productRoute)


