import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { greyColors } from 'utils/theme/colors';
import { ButtonBase } from '@mui/material';

export const DefaultLink = styled(Link)`
  && {
    color: ${greyColors.grey10};
    font-size: 14px;
    font-weight: 500;
  }
`;

export const SharedButton = styled(ButtonBase)`
  && {
    background: #000000;
    border-radius: 35px;
    padding: 8px 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    color: #ffffff;
  }
`;
