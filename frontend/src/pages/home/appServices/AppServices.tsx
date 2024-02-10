import { service } from "../../../types/home/service";
import AppService from "./AppService";
import "../../../styles/pages/home/service.css";

const AppServices = (props: { services: service[] }) => {
  return (
    <div className="services">
      {props.services.map((fet, idx) => (
        <AppService
          key={idx}
          title={fet.title}
          image={fet.image}
          description={fet.description}
        />
      ))}
    </div>
  );
};

export default AppServices;
