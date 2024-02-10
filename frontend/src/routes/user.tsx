import { Route, Routes } from "react-router-dom";
import About from "../pages/about/about";
import Home from "../pages/home/home";
import Footer from "../layouts/footer/footer";
import Header from "../layouts/header/header";
import UserContextProvider from "../contexts/userContext";
import AuthModalContextProvider from "../contexts/authModalContext";

const UserRoutes = () => {
  return (
    <>
      <UserContextProvider>
        <AuthModalContextProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </AuthModalContextProvider>
      </UserContextProvider>
      <Footer />
    </>
  );
};

export default UserRoutes;
