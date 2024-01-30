import { useState } from "react";
import { RegisterUserStateType } from "../../types/reducer/userDetailsReducer";

function ConfirmPassword({ state }: { state: RegisterUserStateType }) {
  const [confirmpassword, setConfirmPassword] = useState<string>("");
  const [confirmpasswordErr, setConfirmPasswordErr] = useState<string>("");

  const handelConfirmPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (state.password === "") {
      setConfirmPassword("");
      setConfirmPasswordErr("");
      return;
    } else if (state.password !== event.target.value) {
      setConfirmPasswordErr("confirm password doesnt match with password");
    } else {
      setConfirmPasswordErr("");
    }
    setConfirmPassword(event.target.value);
  };

  return (
    <>
      <label htmlFor="confpassword" className="blbl">
        Confirm Password
      </label>
      <input
        id="confpassword"
        type="password"
        name="confpassword"
        value={confirmpassword}
        onChange={handelConfirmPassword}
        className="binp"
        placeholder="*****"
        title="Enter you password again"
        autoComplete="off"
        required
      />
      <small className="form-err">{confirmpasswordErr}</small>
    </>
  );
}
export default ConfirmPassword;
