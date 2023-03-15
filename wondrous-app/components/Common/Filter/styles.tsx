import styled from 'styled-components';
import { color } from 'styled-system';

import { Button, Checkbox, Portal } from '@mui/material';
import CircleChecked from '@mui/icons-material/CheckCircleOutline';
import CircleUnchecked from '@mui/icons-material/RadioButtonUnchecked';

import palette from 'theme/palette';

export const FilterHandle = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 40px;
  padding: 1px;
  background: #1b1b1b;
  border-radius: 6px;
  border: 0.5px solid #4b4b4b;
`;

export const FilterHandleInner = styled.div`
  display: flex;
  flex: 1 0 0;
  gap: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  height: 38px;
  padding: 10px;
  cursor: pointer;
  color: white;
  font-size: 14px;
  &.disabled {
    pointer-events: none;
    opacity: 0.4;
  }
`;
export const FilterChevronContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: flext-end;

  transition: transform 0.2s;

  &.active {
    transform: rotate(180deg);
  }
`;

export const FilterHandleContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 19px;
`;

export const FilterBoxPortal = styled(Portal)``;

export const FilterBox = styled.div`
  position: absolute;
  top: 120%;
  display: flex;
  ${({ renderDirection }) => (renderDirection === 'right' ? 'right: 0' : 'left: 0')};
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  max-width: 323px;
  height: fit-content;
  border-radius: 6px;
  background: #1d1d1d;
  z-index: 100;
`;

export const FilterBoxInner = styled.div`
  position: relative;
  gap: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border-radius: 6px;
  padding: 12px 12px 16px;
  width: 321px;
  height: fit-content;
  overflow: hidden;
  background: ${palette.black95};
  border: 1px solid ${palette.grey75};
`;

export const FilterStatus = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;

  width: 100%;
  height: 28px;
  line-height: 28px;

  height: 28px;
  margin: 15px 0 20px 0;
`;

export const FilterCount = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  font-size: 13px;
  color: ${palette.grey57};

  padding-left: 10px;
`;

export const FilterClear = styled(Button)`
  && {
    display: flex;
    background: ${palette.black70};
    color: ${palette.white};
    border-radius: 4px;

    font-size: 13px;
  }
`;

export const FilterItemsContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
`;

export const FilterItemList = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 6px;
  width: 100%;
  max-height: 286px;

  overflow-y: auto;
  scrollbar-color: ${palette.highlightPurple};
`;

export const FilterItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  height: 40px;

  background: ${palette.black98};
  border-radius: 4px;
  margin: 4px 0;
  padding: 8px;
  position: relative;
  cursor: pointer;
  border: 1px solid ${(props) => props.borderColor};

  ${({ selected, gradient }) => `&::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 4px;
    background: ${selected ? gradient : ''};
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
  }`}
  &:hover {
    background: none;
  }
`;

export const FilterItemIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 7px;

  svg {
    width: 13px;
    height: 13px;
    
    path {
      stroke: white;
    }
  }
`;

export const FilterItemOrgIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin-right: 7px;

  & svg {
    width: 19px;
    height: 19px;
  }
`;

export const FilterItemName = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  color: ${({ isSelected }) => (isSelected ? palette.white : '#C4C4C4')};

  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: ${({ isSelected }) => (isSelected ? '500' : '400')};
  font-size: 14px;
  line-height: 18px;
`;

export const FilterItemCount = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  min-width: 30px;

  font-size: 14px;
  color: ${palette.grey65};
`;

export const FilterItemListShade = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;

  display: flex;

  width: 290px;
  height: 55px;

  background: linear-gradient(0deg, ${palette.black97} 0%, rgba(20, 20, 20, 0) 80.07%);
`;

export const InlineText = styled.span`
  ${color};
`;

export const FilterValues = styled.span`
  text-overflow: ellipsis;
  max-width: 260px;
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

export const FilterButton = styled.button`
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: max-content;
  background: ${({ bgColor }) => bgColor || palette.highlightPurple};
  border: 1px solid ${({ bgColor }) => bgColor || palette.highlightPurple};
  cursor: pointer;
  color: ${({ color }) => color || palette.white};
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  margin-right: 10px;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-top: 0.5px dashed #4b4b4b;
  padding-top: 12px;
`;

export function FilterCheckbox({ checked }) {
  return (
    <Checkbox
      checked={checked}
      icon={<CircleUnchecked style={{ width: '17px', height: '17px', color: '#474747' }} />}
      checkedIcon={<CircleChecked style={{ color: '#7427FF', width: '17px', height: '17px' }} />}
    />
  );
}

export const FilterIconWrapper = styled.div`
  background: #0f0f0f;
  opacity: 1;
  border-radius: 6px;
  padding: 8.5px;
`;
