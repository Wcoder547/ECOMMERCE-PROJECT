import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface props {
  children?: ReactElement;
  isAuthenticated?: boolean;
  isAdmin?: boolean;
  adminRoute?: boolean;
  redirect?: string;
}

const ProtectedRoute = ({
  children,
  isAuthenticated,
  isAdmin,
  adminRoute,
  redirect = "/",
}: props) => {
  if (!isAuthenticated) return <Navigate to={redirect} />;

  if (adminRoute && !isAdmin) {
    return <Navigate to="/" />;
  }
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
