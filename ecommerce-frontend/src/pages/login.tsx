import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { messageResponse } from "../types/api-types";

function Login() {
  const [gender, setGender] = useState("");
  const [date, setdate] = useState("");
  const [login] = useLoginMutation();
  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      if (!user.displayName || !user.email || !user.photoURL) {
        throw new Error("Missing user information from Google provider");
      }

      const res = await login({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        gender,
        role: "user",
        dob: date,
        _id: user.uid,
      });

      if ("data" in res) {
        toast.success(res.data?.message!);
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as messageResponse).message;
        toast.error(message);
      }
    } catch (error: any) {
      toast.error("Sign-in failed: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>

        <div>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male"> Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setdate(e.target.value)}
          />
        </div>

        <div>
          <p>
            Not have an Acount? <Link to={"/signup"}>SignUp</Link>
          </p>
          <button onClick={loginHandler}>
            <FcGoogle /> <span>Login with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default Login;
