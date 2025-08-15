import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";

interface propType {
  user: User | null;
}

const Header = ({ user }: propType) => {
  const [isOpen, setisOpen] = useState<boolean>(false);
  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("user is logout successfully");
      setisOpen(false);
    } catch (error) {
      toast.error("error signout fail");
    }
  };
  return (
    <nav className="header">
      <Link onClick={() => setisOpen(false)} to={"/"}>
        HOME
      </Link>
      <Link onClick={() => setisOpen(false)} to={"/search"}>
        <FaSearch />
      </Link>
      <Link onClick={() => setisOpen(false)} to={"/cart"}>
        <FaShoppingBag />
      </Link>

      {user?._id ? (
        <>
          <button onClick={() => setisOpen((prev) => !prev)}>
            <FaUser />
          </button>
          <dialog open={isOpen}>
            <div>
              {user.role === "admin" && (
                <Link onClick={() => setisOpen(false)} to={"/admin/dashboard"}>
                  Admin
                </Link>
              )}
              <Link onClick={() => setisOpen(false)} to={"/orders"}>
                Orders
              </Link>
              <button onClick={logoutHandler}>
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to={"/login"}>
          <FaSignInAlt />
        </Link>
      )}
    </nav>
  );
};

export default Header;
