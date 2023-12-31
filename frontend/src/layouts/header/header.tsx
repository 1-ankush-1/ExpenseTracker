import { useNavigate } from "react-router-dom";

const Header = () => { 

    const navigate = useNavigate();

    return (
        <div className="header">
            <div className="header__logo">
                <img  alt="logo" />
            </div>
        <div className="header__title">
            <h1>Header</h1>
        </div>
        <div>
            <ul>
                <li onClick={() => {navigate("/")}}>Home</li>
                <li onClick={() => {navigate("/about")}}>About</li>
            </ul>
        </div>
        </div>
    )
    }

export default Header;