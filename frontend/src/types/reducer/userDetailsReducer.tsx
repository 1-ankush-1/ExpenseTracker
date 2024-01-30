export type RegisterUserStateType = {
  name: string;
  password: string;
  phone: string;
  email: string;
  image: File | undefined;
};

export type RegisterUserActionType = {
  type: string;
  payload?: {
    //it is optional
    name: string;
    value: string | File | undefined;
  };
};
