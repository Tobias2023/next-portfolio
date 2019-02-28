import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ImageGallery from 'react-image-gallery';

const PortfolioListItem = ({ projectTitle, images, description }) => (
  <PortfolioListItemContainer>
    <div>
      <ProjectTitle>{projectTitle}</ProjectTitle>
      <ProjectDescription>{description}</ProjectDescription>
    </div>

    <GalleryContainer>
      <ImageGallery
        items={images}
        showThumbnails
        thumbnailPosition="right"
        showPlayButton={false}
        showBullets
      />
    </GalleryContainer>
  </PortfolioListItemContainer>
);

PortfolioListItem.propTypes = {
  projectTitle: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      original: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ).isRequired
};

export default PortfolioListItem;

const mobileBreakpoint = '1000px';

const GalleryContainer = styled.div`
  max-width: 700px;

  .image-gallery-content:not(.fullscreen) .image-gallery-slide-wrapper.right {
    width: 100%;
  }
  .image-gallery-content:not(.fullscreen) .image-gallery-thumbnails {
    display: none;
  }
  .image-gallery-content:not(.fullscreen) .image-gallery-thumbnails-wrapper {
    display: none;
  }

  .image-gallery-slide img {
    max-height: 100vh;
  }
`;

const ProjectDescription = styled.div`
  max-width: 700px;
  margin-right: 25px;
  @media (max-width: ${mobileBreakpoint}) {
    margin-right: 0;
    margin-bottom: 25px;
  }
`;

const ProjectTitle = styled.h2`
  margin-top: 0;
`;

const PortfolioListItemContainer = styled.li`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: black;
  margin: 30px 0;
  padding: 15px 0;
  display: flex;
  justify-content: space-between;
  @media (max-width: ${mobileBreakpoint}) {
    flex-direction: column;
    align-items: center;
  }
`;
