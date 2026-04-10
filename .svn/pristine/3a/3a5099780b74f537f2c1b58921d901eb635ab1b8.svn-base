import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import BackgroundBannerImage from 'assets/images/banner/02.png';
import BackgroundBannerImageTwo from 'assets/images/banner/banner-img2.png';
import BackgroundBannerImageThree from 'assets/images/drive/03.png';
const useStyles = makeStyles(() => ({
  banner: {
    position: 'relative',
    overflow: 'hidden',
    zIndex: 0,
    '&:after': {
      content: '""',
      bottom: '-5px',
      left: 0,
      width: '100%',
      height: '84px',
      background: `url(${BackgroundBannerImage}) no-repeat 0 0`,
      backgroundSize: 'cover',
      display: 'inline-block',
      position: 'absolute'
    },
    '& .banner-text': {
      zIndex: 9,
      position: 'relative'
    },
    '& .banner-img': {
      // width: '110%',
    }
  },
  overBlue90: {
    position: 'relative',
    '&:before': {
      content: '""',
      height: '100%',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: -1,
      background: 'rgba(74, 196, 243, 0.9)'
    }
  },
  bannerText: {
    color: '#ffffff',
    textAlign: 'justify',
    fontSize: '1.6rem',
    //lineHeight: '1.6rem',
    paddingBottom: '35px',
    '& h1': {
      textAlign: 'left'
    }
  },
  bannerTextHeading: {
    fontWeight: 'normal',
    color: '#ffffff',
    textAlign: 'left',
    fontSize: '3rem',
    lineHeight: '3rem',
    textTransform: 'uppercase'
  },
  bannerImg: {
    visibility: 'visible',
    animation: '$bounceInDown 2s',
    maxWidth: '100%',
    height: '330px',
    width: '100%'
  },
  '@keyframes bounceInDown': {
    '0%, 20%, 40%, 60%, 80%, 100%': {
      transform: 'translateY(0)'
    },
    '50%': {
      transform: 'translateY(-10px)'
    }
  },
  bannerObjects: {
    position: 'absolute',
    left: 0,
    top: 0,
    display: 'inline-block',
    width: '100%',
    height: '100%'
  },
  bannerObject01: {
    position: 'absolute',
    left: '-8%',
    bottom: '-20%',
    opacity: 0.1
  },
  bannerObject02: {
    position: 'absolute',
    bottom: '50%',
    marginBottom: '-125px',
    left: '-13%',
    border: '15px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '900px',
    height: '250px',
    width: '250px'
  },
  bannerObject03: {
    position: 'absolute',
    top: '0%',
    right: '-15%',
    border: '30px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '900px',
    height: '400px',
    width: '400px'
  },
  fadeBounce: {
    position: 'absolute',
    animation: '$fadeBounce 2s infinite'
  },
  '@keyframes fadeBounce': {
    '0%, 100%': {
      opacity: 1,
      transform: 'translateY(0)'
    },
    '50%': {
      opacity: 0.5,
      transform: 'translateY(-20px)'
    }
  }
}));

const WelcomeNsapSection = () => {
  const classes = useStyles();

  return (
    <div>
      <section className={`${classes.banner} ${classes.overBlue90}`}>
        <Container>
          <Box className={classes.bannerText} py={4}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Typography variant="h1" className={classes.bannerTextHeading} component="div">
                  Welcome to <b>NSAP</b>
                </Typography>
                <Typography variant="body1" paragraph className={classes.bannerText}>
                  The National Social Assistance Programme (NSAP) is a welfare programme being administered by the Ministry of Rural
                  Development. This programme is being implemented in rural areas as well as urban areas. NSAP represents a significant step
                  towards the fulfilment of the Directive Principles of State Policy enshrined in the Constitution of India which enjoin
                  upon the State to undertake within its means a number of welfare measures. These are intended to secure for the citizens
                  adequate means of livelihood, raise the standard of living, improve public health, provide free and compulsory education
                  for children etc.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.bannerText}>
                <img className={classes.bannerImg} src={BackgroundBannerImageTwo} alt="NSAP Banner" />
              </Grid>
            </Grid>
          </Box>
          <Box className={classes.bannerObjects}>
            <span
              className={`${classes.bannerObject01} skrollable`}
              data-bottom="transform:translatey(50px)"
              data-top="transform:translatey(-50px);"
            >
              <img src={BackgroundBannerImageThree} alt="drive02" />
            </span>
            <span className={classes.bannerObject02}></span>
            <span className={classes.bannerObject03}></span>
          </Box>
        </Container>
      </section>
    </div>
  );
};

export default WelcomeNsapSection;
