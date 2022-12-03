import styled from 'styled-components';
import Typography from '@mui/material/Typography';
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
  align-items: flex-start;
  background: linear-gradient(54.27deg, ${palette.grey79} 20.18%, ${palette.highlightBlue} 130.2%);
  border-radius: 6px;
  border: 0px solid transparent;
  color: ${palette.white};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: fit-content;
  padding: 14px;
  position: relative;
  z-index: 1;
  min-width: 365px;
  &::before {
    background: ${palette.grey900};
    border-radius: 6px;
    content: '';
    height: calc(100% - 2px);
    left: 0;
    position: absolute;
    top: 0;
    transform: translate(1px, 1px);
    width: calc(100% - 2px);
    z-index: -1;
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
