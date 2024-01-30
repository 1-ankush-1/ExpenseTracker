import axios from "axios";
import { RegisterUserStateType } from "../../types/reducer/userDetailsReducer";

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export async function registerUserDetail(user: RegisterUserStateType) {
  console.log("return", user);
  //make it formdata
  const formData = new FormData();
  formData.append("name", user.name);
  formData.append("password", user.password);
  formData.append("phone", user.phone);
  formData.append("email", user.email);
  if (user.image) {
    formData.append("image", user.image);
  }

  //send data to backend
  try {
    const result = await axios.post(
      "http://localhost:3000/auth/signup",
      formData,
      config
    );
    localStorage.setItem("userData", result.data);
  } catch (err) {
    console.log(err);
  }
}
