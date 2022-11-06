import styled from 'styled-components';
import StarIcon from 'components/Icons/starIcon';
import palette from 'theme/palette';

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
  align-items: flex-start;
  background: linear-gradient(54.27deg, #424242 20.18%, #06ffa5 130.2%);
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
  width: 360px;
  &::before {
    background: #1d1d1d;
    border-radius: 4px;
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

export const BountyCardType = styled.div`
  color: ${palette.blue20};
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  line-height: 17px;
  text-transform: capitalize;
`;

export const SubtasksWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StatusIconWrapper = styled.div`
  height: 24px;
  width: 24px;
  svg {
    width: 24px !important;
    height: 24px !important;
  }
`;
