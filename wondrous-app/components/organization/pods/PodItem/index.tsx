import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import RolePill from 'components/Common/RolePill';
import PodIcon from 'components/Icons/podIcon';
import MemberIcon from 'components/Icons/Sidebar/people.svg';
import { LockedIconOutline, LockIconOutline } from 'components/Icons/userpass';
import palette from 'theme/palette';
import { useOrgBoard, useTokenGating } from 'utils/hooks';
import { PodItemContainer, PodItemStatsContainer } from './styles';

const PodItem = (props) => {
  const { podData } = props;

  const { userPermissionsContext } = useOrgBoard() || {};
  const [tokenGatingConditions] = useTokenGating(podData?.orgId);

  const podId = podData?.id;
  const bgColor = podData?.color || palette.black85;
  const podName = podData?.name;
  const podDescription = podData?.description;
  const contributorCount = podData?.contributorCount || 0;
  const isPodTokenGated =
    tokenGatingConditions?.getTokenGatingConditionsForOrg?.filter((condition) => condition.podId === podId).length > 0;
  const role = userPermissionsContext?.podRoles[podId];

  return (
    <PodItemContainer>
      <Grid sx={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '400px', overflow: 'hidden' }}>
        <Grid sx={{ background: bgColor, padding: '10px', borderRadius: '1000px', display: 'flex' }}>
          <PodIcon />
        </Grid>
        <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography sx={{ color: palette.blue20, fontWeight: 700, fontSize: '15px' }}>{podName}</Typography>
          {!!podDescription && (
            <Typography
              sx={{
                color: palette.grey250,
                fontSize: '14px',
                maxWidth: '260px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {podDescription}
            </Typography>
          )}
        </Grid>
      </Grid>
      <PodItemStatsContainer>
        <Grid
          sx={{
            padding: '4px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: palette.grey87,
            borderRadius: '4px',
          }}
        >
          <MemberIcon />
          <Typography
            sx={{
              color: palette.grey250,
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            {contributorCount}
          </Typography>
        </Grid>
        <Grid
          sx={{
            padding: '6px 7px',
            display: 'flex',
            alignItems: 'center',
            background: palette.grey87,
            borderRadius: '4px',
          }}
        >
          {isPodTokenGated ? <LockedIconOutline /> : <LockIconOutline />}
        </Grid>
        <RolePill roleName={role} />
      </PodItemStatsContainer>
    </PodItemContainer>
  );
};

export default PodItem;
