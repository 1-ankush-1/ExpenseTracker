import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import Page from "../../types/header/page";
import { useTranslation } from "react-i18next";

const Settings = ({ allOptions }: { allOptions: Page[] }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handlePageNavigation = (goto: string) => {
    if (goto === "/logout") {
      localStorage.clear();
    }
    navigate(goto as string);
    handleCloseUserMenu();
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      {/*to give a extra information when hover*/}
      <Tooltip title={t("settings")}>
        <IconButton onClick={handleOpenUserMenu}>
          <img
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              width: " 50px",
              height: "50px",
              cursor: "pointer",
            }}
            // alt={`${data.firstname} ${data.lastname}`}
            // src={imgurl}
            alt="user"
          />
        </IconButton>
      </Tooltip>

      {/*To create a menu we need menu and menu Item*/}
      <Menu
        //save state in anchorEl
        anchorEl={anchorElUser}
        //if anchorEl is true than open Menu
        open={Boolean(anchorElUser)}
        //it is used to close the menu
        onClose={handleCloseUserMenu}
      >
        {allOptions.map((setting: Page) => (
          <MenuItem
            color="inherit"
            key={setting.name}
            onClick={() => handlePageNavigation(setting.goto)}
          >
            {t(setting.name)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default Settings;
