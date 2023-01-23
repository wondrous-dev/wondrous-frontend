import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import { HEADER_HEIGHT } from 'utils/constants';

export const OverviewComponent = styled.section`
  width: 100%;
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
`;

export const Banner = styled.img`
  width: 100%;
  height: 149px;
  object-fit: cover;
  background: url(${({ img }) => `${img}`});
  position: relative;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DashboardHeader = styled(Typography)`
  && {
    background: ${({ gradient }) => gradient};
    position: absolute;
    font-weight: 900;
    font-size: 40px;
    transform: scale(1.1, 1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;

    ${({ theme }) => theme.breakpoints.down('md')} {
      font-size: 28px;
    }
  }
`;

export const BannerWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
