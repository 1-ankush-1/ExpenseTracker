import { Route, Routes} from "react-router-dom"
import About from "../pages/about/about"
import Home from "../pages/home/home"
import Footer from "../layouts/footer/footer"
import Header from "../layouts/header/header"

const UserRoutes = () => {
    return (
        <>
            <Header/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
            <Footer/>
        </>
    )
}

export default UserRoutes;
