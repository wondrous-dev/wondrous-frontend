import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';

const HeaderText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    color: #ccbbff;
  }
`;

export interface IHeaderTitleProps {
  text: string;
  IconComponent: React.ElementType;
}

const HeaderTitle = ({ text, IconComponent }: IHeaderTitleProps) => (
  <Grid container width="fit-content" height="36px" gap="8px" alignItems="center" justifyContent="center">
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      bgcolor="#212121"
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
