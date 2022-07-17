import { ButtonBase, Typography } from '@mui/material';
import LeftArrowIcon from 'components/Icons/leftArrow';
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Button = styled(({ children, ...props }) => (
  <ButtonBase {...props}>
    <div>{children}</div>
  </ButtonBase>
))`
  && {
    align-items: center;
    background: ${({ borderColor }) => borderColor};
    border-radius: 35px;
    display: flex;
    height: 38px;
    justify-content: space-between;
    padding: 1px;
    width: 280px;
    > div {
      align-items: center;
      background: ${({ theme }) => theme.palette.background.default};
      border-radius: inherit;
      display: flex;
      gap: 12px;
      height: 100%;
      justify-content: space-between;
      padding: 0 12px;
      width: 100%;
    }
  }
`;

export const ButtonIconTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ButtonText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    color: ${({ theme }) => theme.palette.white};
  }
`;

export const RightArrow = styled((props) => (
  <div {...props}>
    <LeftArrowIcon />
  </div>
))`
  align-items: center;
  display: flex;
  justify-content: center;
  justify-self: end;
  transform: rotate(180deg);
  svg {
    width: 16px;
    height: 16px;
    path {
      stroke: ${({ theme }) => theme.palette.highlightPurple};
    }
  }
`;

export const ButtonCSVTemplate = styled(ButtonBase)`
  && {
    align-items: center;
    background: #313131;
    border-radius: 6px;
    color: ${({ theme }) => theme.palette.white};
    display: flex;
    flex-direction: row;
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    height: 38px;
    justify-content: center;
    padding: 10px;
    width: 113px;
  }
`;
