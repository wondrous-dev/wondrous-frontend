import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

import { IHeaderTitleProps } from './types';

const HeaderText = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    color: ${palette.blue20};
  }
`;

const HeaderTitle = ({ text, IconComponent }: IHeaderTitleProps) => (
  <Grid container width="fit-content" height="36px" gap="8px" alignItems="center" justifyContent="center">
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      bgcolor={palette.grey950}
      borderRadius="36px"
      height="36px"
      width="36px"
    >
      <IconComponent />
    </Grid>
    <HeaderText>{text}</HeaderText>
  </Grid>
);

export default HeaderTitle;
