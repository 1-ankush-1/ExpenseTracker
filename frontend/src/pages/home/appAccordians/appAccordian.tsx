import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";

const AppAccordian = (props: {
  quesans: { question: String; answer: String };
}) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{props.quesans.question}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{props.quesans.answer}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default AppAccordian;
