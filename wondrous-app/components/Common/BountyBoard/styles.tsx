import styled from 'styled-components';
import StarIcon from 'components/Icons/starIcon';
import palette from 'theme/palette';

import { Typography } from '@mui/material';

import EmptyStateArt from 'components/EmptyStateGeneric/EmptyStateArt';

export const IconWrapper = styled.div`
  border-radius: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background: ${palette.background.default};
`;

export const BountyBoardEmptyWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${palette.white};
  padding: 10px;
  border-radius: 3px;
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  gap: 14px;
  border: 0px solid transparent;
  border-radius: 6px;
  position: relative;
  height: fit-content;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 5px;
    background: linear-gradient(169.47deg, rgba(75, 75, 75, 0.6) 7.84%, rgba(35, 35, 35, 0.6) 108.71%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
    pointer-events: none;
  }
`;

const SUB_BACKGROUND_MAP = {
  blue: 'linear-gradient(180deg, #FFFFFF 0%, #00BAFF 100%);',
  green: 'linear-gradient(180deg, #FFFFFF 0%, #06FFA5 100%);',
};

export function BountyIcon() {
  return (
    <IconWrapper>
      <StarIcon />
    </IconWrapper>
  );
}

export function BountyBoardEmpty() {
  return (
    <BountyBoardEmptyWrapper>
      No results found
      <EmptyStateArt />
    </BountyBoardEmptyWrapper>
  );
}

export const BountyContainer = styled.div`
  ${({ isFullWidth }) =>
    isFullWidth
      ? `display: block; width: 100%;`
      : `display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 18px;
  ;`};
  margin-top: 32px;
`;

export const BountyCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: ${palette.white};
  padding: 10px;
  cursor: pointer;
  border-radius: 3px;
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  gap: 14px;
  border: 0px solid transparent;
  border-radius: 6px;
  position: relative;
  height: fit-content;
  align-items: flex-start;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 5px;
    background: linear-gradient(169.47deg, rgba(75, 75, 75, 0.6) 7.84%, rgba(35, 35, 35, 0.6) 108.71%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
    pointer-events: none;
  }
`;

export const BountyCardType = styled.div`
  color: ${palette.blue20};
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  line-height: 17px;
  text-transform: capitalize;
`;

export const BountyCardSubmissionsCount = styled.div`
  background: ${palette.background.default};
  color: ${palette.white};
  width: 45%;
  border-radius: 6px;
  padding: 8px;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
`;

export const BountyCardSubmissionsCountWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

export const SubmissionCount = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    background: ${({ gradient = 'blue' }) => SUB_BACKGROUND_MAP[gradient]};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

export const SubtasksWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BountyCommentsIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-right: 18px;
`;
