import { Grid, Typography } from '@mui/material';
import PodIcon from 'components/Icons/podIcon';
import palette from 'theme/palette';

interface PodIconNameProps {
  color?: string;
  name: string;
  onClick?: (e: any) => void;
  IconComponent?: () => JSX.Element;
}

const PodIconName = ({
  color = palette.grey900,
  name,
  onClick = null,
  IconComponent = () => (
    <PodIcon
      color={color}
      style={{
        width: '26px',
        height: '26px',
      }}
    />
  ),
}: PodIconNameProps) => (
  <Grid
    container
    bgcolor={palette.grey99}
    borderRadius="64px"
    padding="2px 8px 2px 2px"
    width="fit-content"
    gap="4px"
    height="28px"
    onClick={onClick}
    alignItems="center"
    sx={{
      cursor: 'pointer',
    }}
  >
    <IconComponent />
    <Typography fontFamily="Space Grotesk" color={palette.white} fontSize="13px" fontWeight="500">
      {name}
    </Typography>
  </Grid>
);

export default PodIconName;
