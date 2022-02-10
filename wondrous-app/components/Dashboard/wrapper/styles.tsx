import styled from 'styled-components';
import { Background } from '../../../theme/colors';

export const OverviewComponent = styled.section`
  width: 100vw;
  min-height: 100vh;
  height: 100%;
  background-color: #0f0f0f;
  transition: 0.15s all ease;
  padding-bottom: 40px;
`;

export const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

export const ContentContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 1037px;
`;

export const Banner = styled.div`
  width: 100vw;
  height: 230px;
  background: url(/images/dashboard-banner.png);
  background-position: center;
  background-size: cover;
`;
