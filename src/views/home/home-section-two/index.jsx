import React from 'react';
import { Grid } from '@mui/material';
import './BackgroundShape.css';
import './ImageSlideshow.css';
import BackgroundImage from 'assets/images/home2.png';
import sliderImg1 from 'assets/images/slider-3d/01.jpg';
import sliderImg2 from 'assets/images/slider-3d/02.jpg';
import sliderImg3 from 'assets/images/slider-3d/03.jpg';
import sliderImg4 from 'assets/images/slider-3d/04.jpg';
import sliderImg5 from 'assets/images/slider-3d/05.jpg';
import sliderImg6 from 'assets/images/slider-3d/06.jpg';
import sliderImg7 from 'assets/images/slider-3d/07.jpg';
import sliderImg8 from 'assets/images/slider-3d/08.jpg';
import sliderImg9 from 'assets/images/slider-3d/09.jpg';
import sliderImg10 from 'assets/images/slider-3d/10.jpg';

const images = [sliderImg1, sliderImg2, sliderImg3, sliderImg4, sliderImg5, sliderImg6, sliderImg7, sliderImg8, sliderImg9, sliderImg10];
const HomePageSectionTwo = () => {
  return (
    <section className="overview-block-pb how-works" style={{ padding: '20px', backgroundColor: 'white' }}>
      <div className="animation-shap">
        <div className="shap-bg"></div>
      </div>

      <Grid container justifyContent="center" spacing={2} className="shap-content">
        <Grid item xl={6} lg={6} xs={12}>
          <img src={BackgroundImage} alt="drive01" style={{ width: '100%' }} />
        </Grid>
        <Grid item xl={6} lg={6} xs={12}>
          <section className="slideshow img-fluid">
            <div className="content">
              <div className="slider-content-3d">
                {images.map((image, index) => (
                  <figure className="shadow" key={index}>
                    <img src={image} alt={`slider ${index + 1}`} loading="lazy" />
                  </figure>
                ))}
              </div>
            </div>
          </section>
        </Grid>
      </Grid>
    </section>
  );
};

export default HomePageSectionTwo;
