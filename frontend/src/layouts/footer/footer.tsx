// Footer.tsx
import React from "react";
import { Container, Typography, Link } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <footer>
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom>
          Your App Name
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary">
          © {new Date().getFullYear()} Your Company Name
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          {"Built by "}
          <Link color="inherit" href="https://mui.com/">
            Ankush Sharma
          </Link>
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
