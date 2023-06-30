import { FC } from "react";
import { Link } from "react-router-dom";

const NotFoundPage: FC = () => {
  return (
    <>
      <h1 className="mb-3">Page not found</h1>
      <Link to={"/"}>Go home</Link>
    </>
  );
};

export default NotFoundPage;
