import { Grid, Typography } from '@mui/material';
import { HeaderButton } from 'components/organization/wrapper/styles';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { CardWrapper, Image } from './styles';
import { PageLabel } from '../Shared/styles';

const Card = ({ index, title, body, artwork, onClick }) => (
  <CardWrapper
    display="flex"
    onClick={onClick}
    flexDirection={{
      xs: 'column',
      md: 'row',
    }}
  >
    <Grid
      display="flex"
      justifyContent="space-between"
      padding={{
        xs: '0px 0px 18px 0px',
        sm: '18px',
      }}
      flexDirection="column"
      gap="24px"
    >
      <Grid display="flex" gap="14px" direction="column">
        <Grid display="flex" gap="14px">
          <PageLabel>{index}</PageLabel>
          <Typography
            fontFamily={typography.fontFamily}
            color={palette.white}
            fontWeight={700}
            fontSize="20px"
            lineHeight="18px"
            letterSpacing="0.01em"
          >
            {title}
          </Typography>
        </Grid>
        <Typography
          fontFamily={typography.fontFamily}
          fontWeight={400}
          fontSize="15px"
          lineHeight="24px"
          color={palette.grey250}
          letterSpacing="0.01em"
        >
          {body}
        </Typography>
      </Grid>
      <HeaderButton reversed>Begin</HeaderButton>
    </Grid>
    <Grid
      display="flex"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      borderRadius="12px"
      width={{
        xs: '100%',
        sm: '50%',
      }}
    >
      <Image src={artwork} />
    </Grid>
  </CardWrapper>
);

export default Card;
