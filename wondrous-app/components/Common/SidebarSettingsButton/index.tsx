import Box from '@mui/material/Box';
import { toolTipStyle } from 'components/Common/SidebarStyles';
import OrgSettingsIcon from 'components/Icons/OrgSettingsIcon';
import Tooltip from 'components/Tooltip';
import Link from 'next/link';
import palette from 'theme/palette';
import { useSettingsLink } from 'utils/hooks';

const SidebarSettingsButton = () => {
  const { href, activePod } = useSettingsLink();
  if (!href) return null;
  return (
    <Tooltip style={toolTipStyle} title={activePod ? `Pod Settings` : `Organization Settings`} placement="right">
      <Box
        bgcolor={palette.grey87}
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="8px"
        height="36px"
        width="36px"
        maxWidth="36px"
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
