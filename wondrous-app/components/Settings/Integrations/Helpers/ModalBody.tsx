import palette from 'theme/palette';
import GradientHeading from 'components/GradientHeading';
import typography from 'theme/typography';
import { Grid, Typography } from '@mui/material';
import Image from 'next/image';

const ModalBody = ({ text, title, logo }) => (
  <Grid
    display="flex"
    justifyContent="center"
    alignItems="center"
    gap="10px"
    direction="column"
    sx={{
      padding: '0px 24px',
    }}
  >
    <Grid display="flex" gap="10px" justifyContent="center" alignItems="center">
      <Image
        src="/images/wonder-logo-white.svg"
        alt="Wonderverse logo"
        width={45}
        height={45}
        style={{
          borderRadius: '6px',
        }}
      />
      <Image
        src={logo}
        alt={`${title} logo`}
        width={45}
        height={45}
        style={{
          borderRadius: '6px',
        }}
      />
    </Grid>
    <GradientHeading>{title}</GradientHeading>
    <Typography
      fontFamily={typography.fontFamily}
      fontWeight={400}
      fontSize="15px"
      lineHeight="24px"
      color={palette.white}
    >
      {text}
    </Typography>
  </Grid>
);

export default ModalBody;
