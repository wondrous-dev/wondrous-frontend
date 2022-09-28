import Checkbox from 'components/Checkbox';
import { CheckedBoxIcon } from 'components/Icons/checkedBox';
import styled from 'styled-components';
import palette from 'theme/palette';

export const Wrapper = styled.div`
  background: ${palette.midnight};
  top: 110%;
  position: absolute;
  width: fit-content;
  min-width: 100%;
  border-radius: 6px;
  border: 1px solid ${palette.grey79};
  padding: 8px;
  display: ${({ show }) => (show ? 'block' : 'none')};
`;

export const Item = styled.div`
  border-radius: 6px;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  :hover {
    background: ${palette.black92};
  }
`;

export const IconWrapper = styled.div`
    display: flex;
    align-items: center
    justify-content: center;
    height: 24px;
    width: 24px;
    border-radius: 4px;
    ${Item}:hover & {
        background: ${palette.highlightPurple};
    }
`;

export const CheckedBox = styled((props) => <CheckedBoxIcon {...props} stroke="white" pathFill="none" />)``;
