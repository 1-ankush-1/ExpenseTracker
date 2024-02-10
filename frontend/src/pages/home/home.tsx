import "../../styles/pages/home/home.css";
import ReportIcon from "../../assets/icons/report";
import SavingIcon from "../../assets/icons/saving";
import HomeHead from "./homeHead";
import heroImageNDescription from "../../types/home/heroHome";
import { service } from "../../types/home/service";
import AppServices from "./appServices/AppServices";
import AppAccordians from "./appAccordians/appAccordians";

const serviceList: service[] = [
  {
    title: "Manage Expense",
    image: "https://picsum.photos/seed/picsum/200/300",
    description: "Track and manage your expenses effectively",
  },
  {
    title: "Download Expense Report",
    image: "https://picsum.photos/seed/picsum/200/300",
    description: "Download your expense details in Excel format",
  },
  {
    title: "Chat with AI",
    image: "https://picsum.photos/seed/picsum/200/300",
    description: "Get personalized investment suggestions from AI",
  },
];

const HeroImageNDescription: heroImageNDescription[] = [
  {
    title: "Gain total control of your money",
    description: "Become your own money manager and make every cent count",
    image: <SavingIcon />,
  },
  {
    title: "Know where your money goes",
    description:
      "Track your transaction easily, with categories and financial report",
    image: <ReportIcon />,
  },
];

const Home = () => {
  return (
    <div className="home-all-parent">
      <HomeHead HeroImageNDescription={HeroImageNDescription} />
      <AppServices services={serviceList} />
      <AppAccordians />
    </div>
  );
};

export default Home;
