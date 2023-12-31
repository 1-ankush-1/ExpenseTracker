import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../../types/header/page";
import UserType from "../../types/header/user-types";
import { AppBar, Container, IconButton, Toolbar } from "@mui/material";
import HeaderItems from "./header_items";
import Settings from "./settings";

const homePages: Page[] = [
  { name: "Home", goto: "/" },
  { name: "Pricing", goto: "/" },
  { name: "About", goto: "/about" },
  { name: "Register", goto: "/" },
];

const regularUserPages: Page[] = [
  { name: "Home", goto: "/" },
  { name: "expense", goto: "/" },
  { name: "income", goto: "/" },
];

const premiumUserPages: Page[] = [
  { name: "Home", goto: "/" },
  { name: "expense", goto: "/" },
  { name: "income", goto: "/" },
  { name: "leaderBoard", goto: "/" },
  { name: "reports", goto: "/" },
];

const settings = [
  { name: "Profile", goto: "/user/profile" },
  { name: "Logout", goto: "/logout" },
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
            <img src="../../assets/images/expense.png" alt="expender" />
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
