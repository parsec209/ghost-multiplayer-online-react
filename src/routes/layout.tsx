import { FC } from "react";
import NavbarTop from "../components/navbar-top";
import Footer from "../components/footer";
import { Outlet } from "react-router-dom";
import Loader from "../components/loader";
import { useAuth0 } from "@auth0/auth0-react";

const Layout: FC = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <NavbarTop />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
