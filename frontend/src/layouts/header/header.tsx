import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../../types/header/page";
import UserType from "../../types/header/user-types";
import { AppBar, Container, IconButton, Toolbar } from "@mui/material";
import HeaderItems from "./header_items";
import Settings from "./settings";

const homePages: Page[] = [
  { name: "home", goto: "/" },
  { name: "price", goto: "/" },
  { name: "about", goto: "/about" },
  { name: "register", goto: "/" },
];

const regularUserPages: Page[] = [
  { name: "home", goto: "/" },
  { name: "expense", goto: "/" },
  { name: "income", goto: "/" },
];

const premiumUserPages: Page[] = [
  { name: "home", goto: "/" },
  { name: "expense", goto: "/" },
  { name: "income", goto: "/" },
  { name: "leaderBoard", goto: "/" },
  { name: "reports", goto: "/" },
];

const settings = [
  { name: "profile", goto: "/user/profile" },
  { name: "logout", goto: "/logout" },
];

function Header() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>(UserType.Empty);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/*Imported Icon*/}
          <IconButton
            sx={{ display: { xs: "none", md: "flex" } }}
            onClick={() => navigate("/")}
          >
            <img
              src="../../../public/images/expense.png"
              alt="expender"
              height={"40px"}
              width={"40px"}
            />
          </IconButton>

          {userType === UserType.Empty ? (
            <>
              <HeaderItems Options={homePages} />
            </>
          ) : (
            <>
              <HeaderItems Options={regularUserPages} />
              <Settings allOptions={settings} />
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
