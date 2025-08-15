import { MdError } from "react-icons/md";

const NotFound = () => {
  return (
    <div className="container not-found">
      <MdError />
      <h1>Page Not found!!</h1>
    </div>
  );
};

export default NotFound;
