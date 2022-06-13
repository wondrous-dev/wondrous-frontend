import styled from 'styled-components';
import { White } from "../../../theme/colors";
import {Typography} from "@material-ui/core";

export const Layout = styled.div`
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  border-radius: 6px;
  padding: 40px;
  min-height: 80vh;
  max-width: 634px;
  min-width: 578px;

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
    color: ${White};
    margin-bottom: 18px;
    font-weight: 500;
    text-align: left;
    margin-top: 30px;
    width: 100%;
    background: linear-gradient(90deg, rgba(204,187,255,1) 0%, rgba(0,186,255,1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const OnboardingDescription = styled(Typography)`
  && {
    font-size: 15px;
    color: ${White};
    font-weight: 400;
    text-align: left;
    margin-top: 20px;
    width: 100%;
  }
`;
