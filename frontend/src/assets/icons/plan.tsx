import { FunctionComponent } from "react";
// import "../../styles/icons/saving.css";
import Plan from "../svg/plan.svg";

const PlanIcon: FunctionComponent = () => {
  return <img className="plan-icon" alt="plan" src={Plan} />;
};

export default PlanIcon;
