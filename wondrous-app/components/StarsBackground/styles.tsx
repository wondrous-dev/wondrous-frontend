import styled from 'styled-components';
import palette from 'theme/palette';

export const Wrapper = styled.div`
  background: radial-gradient(81.06% 81.06% at 50% 13.91%, #7427ff 0%, #141414 100%);
  opacity: 0.9;
  top: 0;
  left: 284px;
  width: 100vw;
  height: 100vh;
  position: fixed;
`;

export const Stars = styled.div`
  @keyframes zoom {
    0% {
      opacity: 0;
      transform: scale(0.5);
      animation-timing-function: ease-in;
    }
    85% {
      opacity: 1;
      transform: scale(2.8);
      animation-timing-function: linear;
    }
    100% {
      opacity: 0;
      transform: scale(3.5);
    }
  }

  overflow: hidden;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: radial-gradient(2px 2px at 20px 30px, ${palette.white}, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 40px 70px, ${palette.white}, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 50px 160px, ${palette.white}, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 90px 40px, ${palette.white}, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 130px 80px, ${palette.white}, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 160px 120px, ${palette.white}, rgba(0, 0, 0, 0));
  background-repeat: repeat;
  background-size: 200px 200px;
  animation: zoom 5s infinite;
  opacity: 0;

  &:nth-child(1) {
    background-position: 10% 10%;
    animation-delay: 0s;
  }
  &:nth-child(2) {
    background-position: 20% 60%;
    animation-delay: 1s;
  }
  &:nth-child(3) {
    background-position: -20% -30%;
    animation-delay: 2s;
  }
  &:nth-child(4) {
    background-position: 40% -80%;
    animation-delay: 3s;
  }
  &:nth-child(5) {
    background-position: -20% 30%;
    animation-delay: 4s;
  }
`;
