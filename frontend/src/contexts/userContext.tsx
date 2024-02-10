import React, { useState } from "react";

interface User {
  id: string;
  name: string;
  phone: Number;
  profile: string;
  ispremiumuser: boolean;
  totalexpenses: Number;
  totalincome: Number;
}

interface UserContextValue {
  user: User;
  onChangeUser: (newUser: User) => void;
}

export const UserContext = React.createContext<UserContextValue>({
  user: {
    id: "",
    name: "",
    phone: 0,
    profile: "",
    ispremiumuser: false,
    totalexpenses: 0,
    totalincome: 0,
  },
  onChangeUser: () => {},
});

const UserContextProvider = (props: React.PropsWithChildren<{}>) => {
  const [user, setUser] = useState<User>({
    id: "",
    name: "",
    phone: 0,
    profile: "",
    ispremiumuser: false,
    totalexpenses: 0,
    totalincome: 0,
  });

  const onChangeUser = (newUser: User) => {
    setUser({ ...newUser });
  };

  return (
    <UserContext.Provider value={{ user, onChangeUser }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
