import { service } from "../../../types/home/service";
import "../../../styles/pages/home/service.css";
import { Card } from "@mui/material";

const Service = (props: service) => {
  return (
    <Card>
      <div className="service">
        <img
          alt={props.title}
          className="service-image"
          height="200"
          src={props.image}
          width="200"
        />
        <div className="service-body">
          <h3 className="service-head">{props.title}</h3>
          <p className="service-description">{props.description}</p>
        </div>
      </div>
    </Card>
  );
};

export default Service;
