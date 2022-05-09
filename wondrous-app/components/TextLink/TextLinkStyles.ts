import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import { Blue20 } from 'theme/colors';

export const StyledLink = styled.a`
  && {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    margin-left: 6px;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: ${Blue20};
  }
`;
