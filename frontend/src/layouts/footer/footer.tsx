// Footer.tsx
import React from "react";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import "./css/footer.css";
import { useTranslation } from "../../contexts/Translate/translate";

const FooterNavigationOptions = [
  { name: "home", goto: "/home" },
  { name: "contact", goto: "/contact" },
  { name: "about", goto: "/about" },
];

const socialMediaLinks = [
  {
    name: <LinkedInIcon />,
    goto: import.meta.env.VITE_LINKED_IN,
  },
  { name: <GitHubIcon />, goto: import.meta.env.VITE_GITHUB },
  { name: <TwitterIcon />, goto: import.meta.env.VITE_TWITTER },
];

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <footer>
      <Container className="footer_body">
        <div className="footer_logo">
          <div className="footer_logo_child_1">
            <img
              src="../../../public/images/expense.png"
              alt="logo"
              height={"30px"}
              width={"30px"}
            />
            <Typography variant="h6" className="logo_name">
              Expendere
            </Typography>
          </div>
          <div className="footer_logo_child_2">
            <h6 className="company-name">
              &copy; {new Date().getFullYear()} Ankush
            </h6>
          </div>
        </div>
        <div className="footer_info">
          <div>
            <ul className="list_style">
              {socialMediaLinks.map((item, i) => (
                <li key={i} className="cursor_pointer">
                  <a href={item.goto}>{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <ul className="list_style">
              {FooterNavigationOptions.map((item) => (
                <li
                  onClick={() => navigate(item.goto)}
                  key={item.name}
                  className="cursor_pointer"
                >
                  {t(item.name)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
