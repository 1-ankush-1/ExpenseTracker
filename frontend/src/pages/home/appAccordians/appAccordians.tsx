import AppAccordian from "./appAccordian";
import "../../../styles/pages/home/accordian.css";

const questionAnswers = [
  { question: "Question 1", answer: "Answer 1" },
  { question: "Question 2", answer: "Answer 2" },
  { question: "Question 3", answer: "Answer 3" },
];

const AppAccordians = () => {
  return (
    <div className="accordians-parent">
      <div className="accordians">
        {questionAnswers.map((qa, index) => (
          <AppAccordian quesans={qa} key={index} />
        ))}
      </div>
    </div>
  );
};

export default AppAccordians;
