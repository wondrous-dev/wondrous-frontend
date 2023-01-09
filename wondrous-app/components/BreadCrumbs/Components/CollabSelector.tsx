import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Separator } from 'components/Collaboration/SharedOrgHeader/styles';
import { useMemo } from 'react';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { useGlobalContext } from 'utils/hooks';
import { OrgComponent } from './OrgSelector';

const CollabSelector = () => {
  const { pageData } = useGlobalContext();
  const activePodOrg = useMemo(() => pageData?.pod?.org, [pageData?.pod]);

  const activeOrg = pageData?.orgData;

  const collab = activeOrg || activePodOrg || {};

  return (
    <Grid display="flex" gap="14px" justifyContent="center" alignItems="center">
      {collab.parentOrgs?.map((org, idx) => (
        <>
          <OrgComponent username={org.username} profilePicture={org.profilePicture} />
          {idx < collab?.parentOrgs.length - 1 && (
            <Typography
              sx={{
                transform: 'scale(1.4, 1)',
              }}
              fontSize="14px"
              color={palette.grey57}
              fontFamily={typography.fontFamily}
            >
              X
            </Typography>
          )}
        </>
      ))}
    </Grid>
  );
};

export default CollabSelector;
