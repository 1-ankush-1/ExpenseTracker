import React, { useState } from "react";

export const AuthModalContext = React.createContext({
  openAuth: false,
  handleCloseAuth: () => {},
  handleOpenAuth: () => {},
});

const AuthModalContextProvider = (props: React.PropsWithChildren<{}>) => {
  const [openAuth, setOpenAuth] = useState<boolean>(false);

  const handleOpenAuth = () => {
    setOpenAuth(true);
  };
  
  const handleCloseAuth = () => setOpenAuth(false);

  return (
    <AuthModalContext.Provider
      value={{ openAuth, handleCloseAuth, handleOpenAuth }}
    >
      {props.children}
    </AuthModalContext.Provider>
  );
};

export default AuthModalContextProvider;
