import styled from 'styled-components';

import AppBar from '@mui/material/AppBar';
import { HEADER_HEIGHT } from 'utils/constants';

export const HeaderBar = styled(AppBar)`
  && {
    padding: 10px 14px 10px 14px;
    background: ${({theme}) => theme.palette.background.header};
    display: flex;
    height: ${HEADER_HEIGHT}px;
    top: 14px;
    width: calc(100% - 28px);
    right: 14px;
    border-radius: 16px;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }
`;

