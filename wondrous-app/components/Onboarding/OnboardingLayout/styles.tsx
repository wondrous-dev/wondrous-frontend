import styled from 'styled-components';
import {Grey85, White} from "../../../theme/colors";
import {Typography} from "@material-ui/core";

export const Layout = styled.div`
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  border-radius: 6px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
  min-height: 80vh;
  max-width: 634px;

  @media (max-width: 640px) {
    min-width: 320px;
    padding: 20px;
  }
`;

export const OnboardingTitle = styled(Typography)`
  && {
    font-size: 28px;
    color: ${White};
    margin-bottom: 18px;
    font-weight: 500;
    text-align: left;
    margin-top: 36px;
    width: 100%;
  }
`;
