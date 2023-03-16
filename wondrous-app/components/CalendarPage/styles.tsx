import styled from 'styled-components';

import CloseModalIcon from 'components/Icons/closeModal';
import palette from 'theme/palette';

export const BoardFiltersWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 18px;
  flex-direction: row;
  flex-wrap: wrap;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
  }
`;

export const BoardFiltersContainer = styled.div`
  width: 100%;
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  grid-row-gap: 20px;
`;

export const AppliedFiltersWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  width: 100%;
  flex-wrap: wrap;
`;

export const AppliedFiltersItem = styled.div`
  color: white;
  background: #353535;
  border: 1px solid #707070;
  border-radius: 66px;
  padding: 7px 10px;
  width: max-content;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  max-height: 32px;
  position: relative;
  &:hover {
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 66px;
      background: linear-gradient(89.86deg, #707070 49.58%, ${palette.highlightBlue} 100.28%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 1px;
    }
    border: 0;
    background: #201f1f;
  }
`;

export const AppliedFiltersIconWrapper = styled.div`
  height: 22px;
  width: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Button = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 11px;
  padding: 10px 12px;
  background: #1b1b1b;
  border-radius: 6px;
  color: white;
  height: 40px;
  cursor: pointer;
  min-width: 20%;
  &.active {
    background: #4000b3;
    border: 1px solid #7427ff;
  }
`;

export const ClearButton = styled.button`
  background: #7427ff;
  border-radius: 66px;
  padding: 7px 10px;
  color: white;
  border: 0;
  min-height: 32px;
  cursor: pointer;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  position: relative;
  &:hover {
    color: #ccbbff;
    background: #4900cd;
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 66px;
      background: linear-gradient(89.86deg, #707070 49.58%, ${palette.highlightBlue} 100.28%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 1px;
    }
  }
`;

export const CloseIcon = styled(CloseModalIcon)`
  z-index: 50;
  &:hover {
    cursor: pointer;
    background: #353535;
    border-radius: 90px;
    path {
      stroke: ${palette.highlightBlue};
    }
  }
`;
