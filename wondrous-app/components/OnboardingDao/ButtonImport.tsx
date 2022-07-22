import { ButtonBase, Typography } from '@mui/material';
import LeftArrowIcon from 'components/Icons/leftArrow';
import styled from 'styled-components';

const ButtonImportWrapper = styled(({ children, ...props }) => (
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

const ButtonIconTextWrapper = styled.div`
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

export const ButtonImport = ({ borderColor, Icon, children, className = '' }) => {
  return (
    <ButtonImportWrapper borderColor={borderColor} className={className}>
      <ButtonIconTextWrapper>
        <Icon />
        <ButtonText>{children}</ButtonText>
      </ButtonIconTextWrapper>
      <RightArrow />
    </ButtonImportWrapper>
  );
};

export default ButtonImport;
