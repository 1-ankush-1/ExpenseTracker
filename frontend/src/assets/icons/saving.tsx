import { FunctionComponent } from "react";
import "../../styles/icons/saving.css";
import Saving from "../svg/saving.svg";

const SavingIcon: FunctionComponent = () => {
  return <img className="saving-icon" alt="saving" src={Saving} />;
};

export default SavingIcon;
