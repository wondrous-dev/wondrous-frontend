import styled from 'styled-components';
import { Typography } from '@material-ui/core';

import { Grey85, White } from '../../../../theme/colors';

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 25px;
  width: 100%;
  border-bottom: 1px solid ${Grey85}; ;
`;

export const Wonder = styled.div`
  display: flex;
  align-items: center;
`;

export const LogoText = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 24px;
    color: ${White};
    margin-left: 12px;
  }
`;
