import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { PrevArrow, NextArrow } from './ArrowButton';
import ClientImage1 from 'assets/images/clients/01.png';
import ClientImage2 from 'assets/images/clients/02.png';
import ClientImage3 from 'assets/images/clients/03.png';
import ClientImage4 from 'assets/images/clients/04.png';
import ClientImage5 from 'assets/images/clients/05.png';
import ClientImage6 from 'assets/images/clients/06.png';
import ClientImage7 from 'assets/images/clients/07.png';
const StyledSlider = styled(Slider)({
  '& .slick-slide img': {
    width: '50%',
    height: 'auto'
  },
  '& .slick-prev, & .slick-next': {
    zIndex: 1,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#fff',
    background: '#e7e7e7'
  },
  '& .slick-prev': {
    left: '10px'
  },
  '& .slick-next': {
    right: '10px'
  },
  '& .slick-prev:hover, & .slick-next:hover': {
    background: '#4ac4f3',
    color: 'white'
  },
  '& .slick-prev:before, & .slick-next:before': {
    fontSize: '24px'
  },
  '& .slick-prev:before': {
    content: '"\\2190"'
  },
  '& .slick-next:before': {
    content: '"\\2192"'
  },
  '& .slick-dots': {
    bottom: '-30px'
  }
});

const clients = [ClientImage1, ClientImage2, ClientImage3, ClientImage4, ClientImage5, ClientImage6, ClientImage7];

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4
      }
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 3
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1
      }
    }
  ]
};

const ClientCarousel = () => {
  return (
    <div style={{ padding: '40px', background: 'white', borderTop: '1px solid #ededed', borderBottom: '1px solid #ededed' }}>
      <Container>
        <Grid container>
          <Grid item xs={12}>
            <StyledSlider {...settings}>
              {clients.map((client, index) => (
                <div key={index}>
                  <img src={client} alt={`Client ${index + 1}`} loading="lazy" />
                </div>
              ))}
            </StyledSlider>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ClientCarousel;
