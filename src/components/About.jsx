import { Button, Container, Slide, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const About = () => {
  const [checked, setChecked] = useState(false);

  // Trigger the slide animation on component mount
  useEffect(() => {
    setChecked(true);
  }, []);

  return (
    <div>
      <Container className="about__container">
        <Slide direction="right" in={checked} mountOnEnter unmountOnExit>
        <img src="https://kit8.net/wp-content/uploads/edd/2022/11/food_delivery_preview.jpg" width={550} alt="Food delivery" />
        </Slide>
        <div className="about__info">
          <Slide direction="bottom" in={checked} mountOnEnter unmountOnExit>
            <div>
              <Typography variant="h3" sx={{ mb: 2 }}>
                Food Delivery in mins
              </Typography>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Ordering your favorite food online is a convenient and enjoyable way to satisfy your cravings without leaving the comfort of your home. With just a few clicks, you can browse through a variety of restaurants and cuisines, choose from an extensive menu, and customize your order to your liking.
              </Typography>
              <Link to={'/menu'}><Button variant="contained">GET STARTED</Button></Link>
            </div>
          </Slide>
        </div>
      </Container>
    </div>
  );
};

export default About;
