import mongoose from "mongoose";
import validator from "validator";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  photo: String;
  role : "admin" | "user";
  gender : "male" | "femail";
  dob: Date;
  createdAt:Date;
  updatedAt:Date;
  // virtual age 
  age:number;

 }

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please Enter ID"],
    },
    name: {
      type: String,
      required: [true, "Please Enter name"],
    },
    email: {
      type: String,
      unique: [true, "Email already existed"],
      required: [true, "Please Enter email"],
       validate:validator.default.isEmail,
    },
    photo: {
      type: String,
      required: [true, "Please Enter photo"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Please Enter gender"],
    },
    dob: {
      type: Date,
      enum: ["male", "female"],
      required: [true, "Please Enter Date of Birth"],
    },
  },
  {
    timestamps: true,
  }
);
userSchema.virtual("age").get(function () {
  const today = new Date();
  const dob = this.dob;
  let age = today.getFullYear() - dob.getFullYear();
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  )
    age--;

  return age;
});

export const User = mongoose.model<IUser>("User", userSchema);

