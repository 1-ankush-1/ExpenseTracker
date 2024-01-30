import { Reducer } from "redux";
import {
  RegisterUserStateType,
  RegisterUserActionType,
} from "../../types/reducer/userDetailsReducer";

export const initialRegisterDetailState: RegisterUserStateType = {
  name: "",
  password: "",
  phone: "",
  email: "",
  image: undefined,
};

const registerUserDetailsReducer: Reducer<
  RegisterUserStateType,
  RegisterUserActionType
> = (
  state: RegisterUserStateType = initialRegisterDetailState,
  action: RegisterUserActionType
) => {
  // reducer logic here
  switch (action.type) {
    case "CHANGE_USER_DETAILS":
      return {
        ...state,
        [action.payload?.name as string]: action.payload?.value,
      }; //update the state
    default:
      throw new Error();
  }
};

export default registerUserDetailsReducer;
