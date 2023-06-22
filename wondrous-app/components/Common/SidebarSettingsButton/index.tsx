import Box from '@mui/material/Box';
import { toolTipStyle } from 'components/Common/SidebarStyles';
import OrgSettingsIcon from 'components/Icons/OrgSettingsIcon';
import Tooltip from 'components/Tooltip';
import Link from 'next/link';
import { useMemo } from 'react';
import palette from 'theme/palette';
import { useGlobalContext } from 'utils/hooks';

const SidebarSettingsButton = () => {
  const { pageData, orgsList } = useGlobalContext();
  const activeOrg = useMemo(
    () => orgsList.find((org) => org.isActive || org.id === pageData?.pod?.orgId),
    [orgsList, pageData?.pod?.orgId]
  );
  const podId = pageData?.pod?.id;
  const href = podId ? `/pod/settings/${podId}/general` : `/organization/settings/${activeOrg?.id}/general`;
  return (
    <Tooltip style={toolTipStyle} title="Settings" placement="right">
      <Box
        bgcolor={palette.grey87}
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="8px"
        height="36px"
        width="36px"
        sx={{
          ':hover': {
            bgcolor: palette.grey78,
          },
        }}
      >
        <Link
          href={href}
          style={{
            display: 'flex',
            height: '36px',
            width: '36px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <OrgSettingsIcon width="24px" height="100%" />
        </Link>
      </Box>
    </Tooltip>
  );
};

export default SidebarSettingsButton;
