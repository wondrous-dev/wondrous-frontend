import styled from 'styled-components';
import palette from 'theme/palette';
import Typography from '@mui/material/Typography';
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

export const Banner = styled.div`
  width: 100%;
  height: 149px;
  background: url('images/contrib.png');
  position: relative;
  margin-top: 70px;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DashboardHeader = styled(Typography)`
  && {
    color: ${palette.white};
    font-weight: 700;
    font-size: 40px;
  }
`;
