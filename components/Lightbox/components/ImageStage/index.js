/* eslint-disable no-shadow */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ImagePager from './components/ImagePager';

const ImageStage = ({
  images,
  currentIndex,
  onClickPrev,
  onClickNext,
  onClose,
  toggleControls,
  controlsAreHidden,
  renderPagerButton: ArrowButton
}) => {
  // Extra sanity check that the next/prev image exists before moving to it
  const canPrev = currentIndex > 0;
  const canNext = currentIndex + 1 < images.length;
  const prev = () => canPrev && onClickPrev();
  const next = () => canNext && onClickNext();

  return (
    <ImageContainer>
      <ArrowButton
        onClick={prev}
        position="left"
        disabled={!canPrev}
        controlsAreHidden={controlsAreHidden}
      />

      <ImagePager
        images={images}
        currentIndex={currentIndex}
        onClose={onClose}
        onClickNext={next}
        onClickPrev={prev}
        toggleControls={toggleControls}
      />

      <ArrowButton
        onClick={next}
        position="right"
        disabled={!canNext}
        controlsAreHidden={controlsAreHidden}
      />
    </ImageContainer>
  );
};

ImageStage.propTypes = {
  toggleControls: PropTypes.func.isRequired,
  controlsAreHidden: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClickPrev: PropTypes.func.isRequired,
  onClickNext: PropTypes.func.isRequired,
  currentIndex: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      caption: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
      width: PropTypes.number,
      height: PropTypes.number
    })
  ).isRequired,
  renderPagerButton: PropTypes.func.isRequired
};

export default ImageStage;

const ImageContainer = styled.div`
  flex-grow: 1;
  margin: 25px 0;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
