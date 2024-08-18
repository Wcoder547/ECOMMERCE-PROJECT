import { User } from "../models/user.model.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.middlware.js";

export const AdminOnly=TryCatch(async(req,res,next)=>{
    const {id}=req.query;

    if(!id){
        return next(new ErrorHandler("Please Login!!",401))
    }
    const user = await User.findById(id)
    if(!user){
      return next(new ErrorHandler("invalid ID",401))
    }
    if(user.role!=="admin"){
        return next(new ErrorHandler("You Are not Admin!! ",401))
    }
    next()
})