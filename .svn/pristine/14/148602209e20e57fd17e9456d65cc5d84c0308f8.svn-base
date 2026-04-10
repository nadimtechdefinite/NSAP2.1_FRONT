import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import './Gallery.css';
import GalleryImage1 from 'assets/images/gallery/01.jpg';
import GalleryImage2 from 'assets/images/gallery/02.jpg';
import GalleryImage3 from 'assets/images/gallery/03.jpg';
import GalleryImage4 from 'assets/images/gallery/04.jpg';
import GalleryImage5 from 'assets/images/gallery/05.jpg';
import GalleryImage6 from 'assets/images/gallery/06.jpg';
import GalleryImage7 from 'assets/images/gallery/07.jpg';

const images = [GalleryImage1, GalleryImage2, GalleryImage3, GalleryImage4, GalleryImage5, GalleryImage6, GalleryImage7];

const HomePageSectionPhotoGallery = () => {
  const [activeIndex, setActiveIndex] = useState(4);

  const goToPreviousSlide = () => {
    const index = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    setActiveIndex(index);
  };

  const goToNextSlide = () => {
    const index = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(index);
  };

  return (
    <section
      id="gallery"
      className="overview-block-ptb iq-bg-over iq-over-blue-80 iq-screenshots iq-parallax"
      data-jarallax='{"speed": 0.6}'
      style={{ background: `url(${GalleryImage1})`, zIndex: 0 }}
      data-jarallax-original-styles='{"background": "url(assets/images/bg/07.jpg)"}'
    >
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="heading-title white">
              <h3 className="title iq-tw-7">Photo Gallery</h3>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-sm-12">
            <div className="screenshots-slider popup-gallery">
              <div className="slider-container">
                <div className="slider-content">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`slider-single ${index === activeIndex ? 'active' : ''} ${
                        index < activeIndex ? 'preactive' : 'proactive'
                      }`}
                    >
                      <a href={image} className="popup-img">
                        <img className="slider-single-image" src={image} alt={`Gallery ${index + 1}`} loading="lazy" />
                      </a>
                    </div>
                  ))}
                </div>
                <IconButton className="slider-left" onClick={goToPreviousSlide}>
                  <ArrowBackIos />
                </IconButton>
                <IconButton className="slider-right" onClick={goToNextSlide}>
                  <ArrowForwardIos />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center iq-pt-40">
          <a href="/nsap/gallery" className="button bt-black">
            More
          </a>
        </p>
      </div>
    </section>
  );
};

export default HomePageSectionPhotoGallery;
