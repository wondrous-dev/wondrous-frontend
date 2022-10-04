import { ButtonBase } from '@mui/material';
import { DAOIcon } from 'components/Icons/dao';
import styled, { css } from 'styled-components';

const styles = {
  hotkeyBadge: {
    '& .MuiBadge-badge': {
      zIndex: '10',
    },
  },
};
export default styles;

export const NoLogoDAO = styled((props) => (
  <div {...props}>
    <DAOIcon
      stroke="#787878"
      encircled={false}
      style={{
        width: '36px',
        height: '36px',
      }}
    />
  </div>
))`
  display: flex;
  width: 36px;
  height: 36px;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
  background: transparent;
`;

const ButtonIconBefore = css`
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-2px, -2px);
    height: 40px;
    width: 40px;
    background: ${({ theme }) => theme.palette.black92};
    outline: ${({ theme }) => `2px solid ${theme.palette.highlightPurple}`};
    border-radius: 50%;
    z-index: -1;
  }
`;

export const ButtonIcon = styled(ButtonBase)`
  && {
    align-items: center;
    background-color: ${({ theme }) => theme.palette.grey87};
    border-radius: 50%;
    display: flex;
    height: 36px;
    justify-content: center;
    position: relative;
    width: 36px;
    z-index: 2;
    :hover {
      ${ButtonIconBefore}
    }
    ${({ isActive }) => isActive && ButtonIconBefore}
  }
`;

export const DaoIconWrapper = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.palette.grey87};
  border-radius: 50%;
`;
