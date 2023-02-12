import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { SafeImage } from 'components/Common/Image';
import palette from 'theme/palette';
import { shrinkNumber } from 'utils/helpers';

export default function Compensation({ rewards = null, ...props }) {
  const { icon, rewardAmount, symbol } = rewards?.[0] || {};
  if (!rewards || !rewardAmount) return null;
  const { style, pillStyle = {}, id } = props;
  const shrinkAmount = shrinkNumber(rewardAmount);
  return (
    <Grid
      container
      width="fit-content"
      key={id}
      style={style}
      height="28px"
      minWidth="45px"
      lineHeight="0"
      borderRadius="25px"
      padding="0"
    >
      <Grid
        container
        item
        borderRadius="inherit"
        bgcolor={palette.grey99}
        gap="4px"
        alignItems="center"
        paddingRight="8px"
        paddingLeft={icon ? '2px' : '8px'}
        style={pillStyle}
      >
        {icon && (
          <Grid container item height="100%" width="max-content" alignItems="center">
            <SafeImage
              useNextImage={false}
              src={icon}
              style={{
                width: '24px',
                height: '24px',
              }}
              alt="Icon"
            />
          </Grid>
        )}
        <Typography
          color={palette.white}
          fontWeight="600"
          fontSize="13px"
          alignItems="center"
          gap="3px"
          width="fit-content"
          lineHeight="0"
        >
          {shrinkAmount} {!icon && symbol}
        </Typography>
      </Grid>
    </Grid>
  );
}
