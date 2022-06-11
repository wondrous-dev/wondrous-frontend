import styled from 'styled-components';
import { Typography } from '@material-ui/core';

import { Grey85, White } from '../../../../theme/colors';

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
  width: 100%;
  border-bottom: 1px solid ${Grey85};
  flex-wrap: wrap;
`;

export const Wonder = styled.div`
  display: flex;
  align-items: center;
  margin: 0 20px 20px 0;
`;

export const LogoText = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 24px;
    color: ${White};
    margin-left: 12px;
  }
`;
