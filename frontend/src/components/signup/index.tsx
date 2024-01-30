import { FormEvent, useReducer, useState } from "react";
import "../../styles/auth/signup.css";
import registerUserDetailsReducer, {
  initialRegisterDetailState,
} from "../reducers/registerUserDetailReducer";
import ImageUploader from "./imageUploader";
import ConfirmPassword from "./confirmPassword";
import PatterMatch from "../../utils/patternMatch";
import { registerUserDetail } from "../../services/auth/signup";

const passErr =
  "password must contain atleast one uppercase,lowercase, number and a special character";

function Register({ gotoLogin }: { gotoLogin: () => void }) {
  const [state, dispatch] = useReducer(
    registerUserDetailsReducer,
    initialRegisterDetailState
  );

  const [passwordPatternError, setPasswordPatterError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    //set image
    dispatch({
      type: "CHANGE_USER_DETAILS",
      payload: { name: "image", value: file },
    });

    //show image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputUserDetails = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    if (name === "password") {
      let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
      if (PatterMatch(value, pattern)) {
        setPasswordPatterError(false);
      } else {
        setPasswordPatterError(true);
      }
    }
    dispatch({ type: "CHANGE_USER_DETAILS", payload: { name, value } });
  };

  const handelRegisterFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    registerUserDetail(state);
  };

  return (
    <>
      <h2 className="modal_head">Sign Up</h2>
      <div className="box">
        <form
          id="registerUserForm"
          className="bform"
          onSubmit={handelRegisterFormSubmit}
        >
          <ImageUploader
            selectedImage={selectedImage}
            handleImageChange={handleImageChange}
          />
          <label htmlFor="name" className="blbl">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            className="binp"
            placeholder="abc"
            value={state.name}
            onChange={handleInputUserDetails}
            title="Enter your name"
            autoComplete="off"
            required
          />
          <label htmlFor="email" className="blbl">
            Email address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={state.email}
            onChange={handleInputUserDetails}
            className="binp"
            placeholder="abc@gmail.com"
            title="Enter your email address"
            autoComplete="off"
            required
          />
          <label htmlFor="phone" className="blbl">
            Phone
          </label>
          <input
            id="phone"
            type="number"
            name="phone"
            value={state.phone}
            onChange={handleInputUserDetails}
            className="binp"
            placeholder="+918388234432"
            title="Enter your phone number"
            autoComplete="off"
          />
          <label htmlFor="password" className="blbl">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={state.password}
            onChange={handleInputUserDetails}
            className="binp"
            placeholder="Secure@1"
            title="Enter you password"
            autoComplete="off"
            required
          />
          {passwordPatternError && (
            <small className="form-err">{passErr}</small>
          )}
          <ConfirmPassword state={state} />
          <button type="submit" className="bbtn">
            Sign up
          </button>
        </form>
      </div>
      <p className="bregister">
        <span className="breg"> have an account ?</span>
        <a className="breganch cursor_pointer" onClick={gotoLogin}>
          Login here{" "}
        </a>{" "}
      </p>
    </>
  );
}

export default Register;
