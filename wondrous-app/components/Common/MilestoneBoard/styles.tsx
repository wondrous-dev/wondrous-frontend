import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import FlagIcon from 'components/Icons/flag';
import { HighlightBlue, White, Background } from 'theme/colors';

const IconWrapper = styled.div`
  border-radius: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  border: 1px solid ${HighlightBlue};
  background: ${Background};
`;

export const MilestoneIcon = () => (
  <IconWrapper>
    <FlagIcon />
  </IconWrapper>
);

export const MilestonesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 18px;
  margin-top: 32px;
`;

export const MilestoneCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  flex-grow: 0;
  color: ${White};
  padding: 14px;
  height: fit-content;
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  position: relative;
  border: 1px solid transparent;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 5px;
    background: linear-gradient(132.7deg, #00baff 0%, #7000ff 98.92%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
  }
`;

export const MilestoneCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
`;

export const MilestoneSubheader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 18px;
`;

export const MilestoneCardBody = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MilestoneCardFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

export const MilestonePrivacyType = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 8px;
  gap: 10px;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
  display: flex;
  align-items: center;
  background: #363636;
  border-radius: 4px;
  color: ${White};
`;

export const MilestoneCardTitle = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 700;
    font-size: 13px;
    line-height: 17px;
    background: linear-gradient(270deg, #ffffff -40.65%, #00baff 109.64%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

export const MilestoneCardPrice = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  gap: 6px;
  background: #363636;
  border-radius: 35px;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 14px;
  color: ${White};
  letter-spacing: 0.01em;
`;

export const MilestoneBodyTitle = styled(Typography)`
  && {
    color: ${White};
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 23px;
  }
`;

export const MilestoneBodyDescription = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
    letter-spacing: 0.01em;
    color: #828282;
  }
`;

export const MilestoneProgress = styled.div``;
