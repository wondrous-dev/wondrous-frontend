import styled from 'styled-components';
import { Typography } from '@mui/material';
import FlagIcon from 'components/Icons/flag';
import palette from 'theme/palette';

const IconWrapper = styled.div`
  border-radius: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  border: 1px solid ${palette.highlightBlue};
  background: ${palette.background.default};
`;

export function MilestoneIcon() {
  return (
    <IconWrapper>
      <FlagIcon />
    </IconWrapper>
  );
}

export const MilestonesContainer = styled.div`
  ${({ isFullWidth }) =>
    isFullWidth
      ? `display: block; width: 100%;`
      : `display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 18px;
  ;`};
  margin-top: 32px;
`;

export const MilestoneCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  flex-grow: 0;
  color: ${palette.white};
  cursor: pointer;
  padding: 14px;
  height: fit-content;
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  position: relative;
  border: 0px solid transparent;
  border-radius: 5px;
  &::before {
    border-radius: 5px;
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(132.7deg, #00baff 0%, #7000ff 98.92%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
  }
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

export const MilestoneProgressWrapper = styled.div`
  margin-top: 10px;
`;
