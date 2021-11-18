import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import figureRocketImg from 'assets/img/FigureRocket.png';
import starsBackImg from 'assets/img/StarsBack.png';
import starsFrontImg from 'assets/img/StarsFront.png';

const Flyby = keyframes`
  100% {
    background-position: -480px 480px;
  }
`;
const Container = styled.div`
  margin: auto;
  margin-top: 80px;
  height: 300px;
  width: 300px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
`;
const FrontStars = styled.div`
  animation: ${Flyby} 30s linear infinite;
  animation-direction: normal;
  background-image: url(${starsFrontImg});
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
`;
const BackStars = styled.div`
  animation: ${Flyby} 60s linear infinite;
  animation-direction: normal;
  background-image: url(${starsBackImg});
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;
const Rocking = keyframes`
  0% {
    transform: translate(-5px, -5px);
  }
  100% {
    transform: translate(5px, 5px);
  }
`;
const RocketImg = styled.img`
  animation: ${Rocking} 3s ease-in-out infinite;
  animation-direction: alternate;
  transform-origin: center;
  position: relative;
  z-index: 5;
`;

const RocketLogo = ({ className }) => (
  <Container className={className}>
    <FrontStars />
    <RocketImg src={figureRocketImg} alt="Figure Technologies to the moon." />
    <BackStars />
  </Container>
);

RocketLogo.propTypes = {
  className: PropTypes.string,
};
RocketLogo.defaultProps = {
  className: '',
};

export default RocketLogo;
