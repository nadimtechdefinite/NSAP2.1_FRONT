import React, { useState } from 'react';
import { Box, Grid, Modal, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import Image1 from 'assets/images/gallery/gallerypage/image1.jpg';
import Image2 from 'assets/images/gallery/gallerypage/image2.jpg';
import Image3 from 'assets/images/gallery/gallerypage/image3.jpg';
import Image4 from 'assets/images/gallery/gallerypage/image4.jpg';
import Image5 from 'assets/images/gallery/gallerypage/image5.jpg';
import Image6 from 'assets/images/gallery/gallerypage/image6.jpg';

const images = [Image1, Image2, Image3, Image4, Image5, Image6];

const ImageBox = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
  paddingTop: '50%',
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
  },
  '& img': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    objectFit: 'cover'
  }
});

const ModalContent = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '800px',
  backgroundColor: 'white',
  padding: '24px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  outline: 'none',
  borderRadius: '8px',
  overflow: 'hidden'
});

const CloseButton = styled(IconButton)({
  position: 'absolute',
  top: '8px',
  right: '8px',
  color: '#333'
});

const GalleryPage = () => {
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const handleOpen = (image) => {
    setCurrentImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentImage(null);
  };

  return (
    <Box sx={{ flexGrow: 1, padding: '16px' }}>
      <Typography sx={{ mt: 2, mb: 4 }} variant="h1">
        Gallery
      </Typography>

      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ImageBox onClick={() => handleOpen(image)}>
              <img src={image} alt={`Gallery ${index + 1}`} loading="lazy" />
            </ImageBox>
          </Grid>
        ))}
      </Grid>
      <Modal open={open} onClose={handleClose} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
        <ModalContent>
          <CloseButton onClick={handleClose}>
            <CloseIcon />
          </CloseButton>
          {currentImage && <img src={currentImage} alt="Current" style={{ width: '100%', borderRadius: '8px' }} />}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default GalleryPage;
