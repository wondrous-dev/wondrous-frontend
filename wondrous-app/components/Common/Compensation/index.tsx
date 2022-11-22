import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { SafeImage } from 'components/Common/Image';
import palette from 'theme/palette';
import { shrinkNumber } from 'utils/helpers';

export default function Compensation(props) {
  if (!props?.rewards?.[0].rewardAmount) return null;
  const { rewards, style, pillStyle = {}, id } = props;
  const { icon, rewardAmount, symbol } = rewards[0] || {};
  const shrinkAmount = shrinkNumber(rewardAmount);
  return (
    <Grid container width="fit-content" key={id} style={style}>
      <Grid
        container
        bgcolor={palette.grey99}
        borderRadius="25px"
        gap="4px"
        alignItems="center"
        paddingRight="8px"
        paddingLeft={icon ? '1px' : '8px'}
        height="28px"
        minWidth="45px"
        justifyContent="space-between"
        lineHeight="0"
        style={pillStyle}
        width="fit-content"
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
