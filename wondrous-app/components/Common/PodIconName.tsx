import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PodIcon from 'components/Icons/podIcon';
import Tooltip from 'components/Tooltip';
import palette from 'theme/palette';

interface PodIconNameProps {
  color?: string;
  name: string;
  onClick?: (e: any) => void;
  IconComponentProps?: object;
}

const PodIconName = ({ color = palette.grey900, name, onClick = null, IconComponentProps }: PodIconNameProps) => (
  <Tooltip title={name}>
    <Grid
      container
      bgcolor={palette.grey99}
      borderRadius="64px"
      padding="2px 8px 2px 2px"
      flex="1"
      maxWidth="fit-content"
      gap="4px"
      height="28px"
      onClick={onClick}
      alignItems="center"
      sx={{
        cursor: 'pointer',
      }}
    >
      <PodIcon
        color={color}
        style={{
          width: '26px',
          height: '26px',
        }}
        {...IconComponentProps}
      />
      <Typography
        fontFamily="Space Grotesk"
        color={palette.white}
        fontSize="13px"
        fontWeight="500"
        width="fit-content"
        flex="1"
        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {name}
      </Typography>
    </Grid>
  </Tooltip>
);

export default PodIconName;
