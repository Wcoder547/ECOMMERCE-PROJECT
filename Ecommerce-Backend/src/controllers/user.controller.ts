import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model.js";
import { newRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.middlware.js";



export const getAllUser =TryCatch(async(req,res,next)=>{

    const users= await User.find({})
   
    return res.status(200).json({
        success:true,
        users
    })

})
export const newUser = TryCatch(
    async (
        req: Request<{}, {}, newRequestBody>,
        res: Response,
        next: NextFunction
      ) => {
        
          
          const { name, email, gender, _id, photo, dob } = req.body;
          // console.log(name, email, gender, _id, photo, dob);


          let user = await User.findById(_id);

          if(user){
            return res.status(200).json({
                success:true,
                message:`Welcome ${user.name}`
            })
          }

          if(!_id || !name || !email || !gender || !photo || !dob){
            return next(new ErrorHandler("all fields are required",400))
          }
           user = await User.create({
            name,
            email,
            gender,
            _id,
            photo,
            dob: new Date(dob),
          });
          return res.status(201).json({
            success: true,
            message: `welcome ,${user.name}`,
          });
        
});
      




export const getUser =TryCatch(async(req,res,next)=>{
const id = req.params.id
if(!id){
    return next(new ErrorHandler("please provide ID ",400))
}
    const user= await User.findById(id)
    if(!user){
        return res.status(404).json({
            success:false,
            message:"Invalid ID"
        })
    }
    return res.status(200).json({
        success:true,
        user
    })

})
export const deleteUser =TryCatch(async(req,res,next)=>{
const id = req.params.id
// console.log(id)
if(!id){
    return next(new ErrorHandler("invalid id ",400))
}
    const user= await User.findById(id)
    if(!user){
        return next(new ErrorHandler("user not existed",400))
    }
     await user.deleteOne()
    return res.status(200).json({
        success:true,
        message:"User deleted successfully",
        
    })

})
