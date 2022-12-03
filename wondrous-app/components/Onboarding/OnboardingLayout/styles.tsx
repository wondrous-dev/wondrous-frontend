import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';

export const Layout = styled.div`
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  border-radius: 6px;
  padding: 40px;
  min-height: 80vh;
  max-width: 634px;
  min-width: 578px;
  width: 100%;
  border: 1px solid #484848;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 0;

  @media (max-width: 640px) {
    min-width: 320px;
    padding: 20px;
    width: 100%;
  }
`;

export const OnboardingTitle = styled(Typography)`
  && {
    font-size: 28px;
    line-height: 32px;
    color: ${palette.white};
    margin-bottom: 18px;
    font-weight: 500;
    text-align: left;
    width: 100%;
    background: linear-gradient(89.17deg, #ccbbff 37.43%, #00baff 105.62%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const OnboardingDescription = styled(Typography)`
  && {
    font-size: 15px;
    color: ${palette.white};
    font-weight: 400;
    text-align: left;
    margin-top: 20px;
    width: 100%;
  }
`;
