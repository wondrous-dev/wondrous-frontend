import { Grid, Typography } from '@mui/material';
import { HeaderButton } from 'components/organization/wrapper/styles';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { Image } from './styles';
import { PageLabel } from '../Shared/styles';

const Card = ({ isDue, index, title, body, artwork, onClick }) => (
  <Grid
    display="flex"
    bgcolor={palette.grey900}
    padding="14px"
    justifyContent="space-between"
    border={isDue ? `1px solid ${palette.highlightPurple}` : ''}
    sx={{
      opacity: isDue ? 1 : 0.5,
    }}
    borderRadius="12px"
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
      <HeaderButton reversed onClick={onClick} disabled={!isDue}>
        Begin
      </HeaderButton>
    </Grid>
    <Image src={artwork} />
  </Grid>
);

export default Card;
