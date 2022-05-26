import { Button, Portal, Popper } from '@mui/material';
import styled from 'styled-components';
import { color } from 'styled-system';
import {
  Black70,
  Black80,
  Black95,
  Black97,
  Black98,
  Grey250,
  Grey57,
  Grey65,
  Grey75,
  HighlightBlue,
  HighlightPurple,
  White,
} from '../../../theme/colors';
import Checkbox from '@material-ui/core/Checkbox';
import CircleChecked from '@material-ui/icons/CheckCircleOutline';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';

export const FilterHandle = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 40px;
  padding: 1px;
  background: ${Grey75};
  ${(props) =>
    props.open ? `background: ${Grey75};` : `background: linear-gradient(180deg, ${Black80} 0%, ${Black95} 70%);`}

  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
`;

export const FilterHandleInner = styled.div`
  display: flex;
  flex: 1 0 0;

  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  height: 38px;
  padding: 15px;

  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  background: ${Black95};
  cursor: pointer;

  ${(props) =>
    props.open
      ? `background: linear-gradient(272.34deg, ${Black95} 4.36%, ${Black97} 42.75%);`
      : `background: linear-gradient(270.93deg,  ${Black95} 3.85%, ${Black97} 101.76%);`}

  color: ${(props) => (props.open ? Grey75 : Grey250)};
  font-size: 14px;
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

  padding: 0px 1px 1px 1px;

  background: linear-gradient(180deg, ${Grey75} 3.85%, ${Black97} 101.76%);

  z-index: 100;
`;

export const FilterBoxInner = styled.div`
  position: relative;
  gap: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  padding: 12px 12px 16px;
  width: 321px;
  height: fit-content;
  overflow: hidden;

  background: ${Black95};
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
  color: ${Grey57};

  padding-left: 10px;
`;

export const FilterClear = styled(Button)`
  && {
    display: flex;
    background: ${Black70};
    color: ${White};
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
  scrollbar-color: ${HighlightPurple};
`;

export const FilterItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  width: 100%;
  height: 40px;

  background: ${Black98};
  border-radius: 4px;
  margin: 4px 0;
  padding: 8px;
  position: relative;
  cursor: pointer;

  ${({ selected, gradient }) =>
    selected
      ? `&::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 4px;
    background: ${gradient || HighlightBlue};
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 0.8px;
  }`
      : ''};
`;

export const FilterItemIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin-right: 7px;

  & svg {
    width: 24px;
    height: 24px;
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

  color: ${({ isSelected }) => (isSelected ? White : '#C4C4C4')};

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
  color: ${Grey65};
`;

export const FilterItemListShade = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;

  display: flex;

  width: 290px;
  height: 55px;

  background: linear-gradient(0deg, ${Black97} 0%, rgba(20, 20, 20, 0) 80.07%);
`;

export const InlineText = styled.span`
  ${color};
`;

export const FilterValues = styled.span`
  text-overflow: ellipsis;
  max-width: 260px;
  white-space: nowrap;
  overflow: hidden;
`;

export const FilterButton = styled.button`
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: max-content;
  background: ${({ bgColor }) => bgColor || HighlightPurple};
  border: 1px solid ${({ bgColor }) => bgColor || HighlightPurple};
  cursor: pointer;
  color: ${({ color }) => color || White};
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 15px;
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

export const FilterCheckbox = ({ checked }) => (
  <Checkbox
    checked={checked}
    icon={<CircleUnchecked style={{ width: '17px', height: '17px', color: '#474747' }} />}
    checkedIcon={<CircleChecked style={{ color: '#7427FF', width: '17px', height: '17px' }} />}
  />
);
