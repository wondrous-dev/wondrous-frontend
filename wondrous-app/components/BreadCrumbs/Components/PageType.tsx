import GitHubIcon from '@mui/icons-material/GitHub';
import { SmallDao2DaoIcon } from 'components/Icons/Dao2Dao';
import GrantIcon from 'components/Icons/GrantIcon';
import HomeIcon from 'components/Icons/home';
import OrgSettingsIcon from 'components/Icons/OrgSettingsIcon';
import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import ContentPaste from 'components/Icons/Sidebar/contentPaste.svg';
import FlagIcon from 'components/Icons/Sidebar/flag.svg';
import FolderIcon from 'components/Icons/Sidebar/folder.svg';
import GroupIcon from 'components/Icons/Sidebar/group.svg';
import PieChartIcon from 'components/Icons/Sidebar/pieChart.svg';
import PodIcon from 'components/Icons/Sidebar/pods.svg';
import StackIcon from 'components/Icons/Sidebar/stack.svg';
import StartIcon from 'components/Icons/Sidebar/star.svg';
import { LockIconOutline } from 'components/Icons/userpass';
import { ENTITIES_TYPES } from 'utils/constants';

import { IconTextWrapper, ItemButtonIcon, ItemButtonText } from 'components/Common/SidebarItem/styles';
import { useGlobalContext } from 'utils/hooks';

import FileDownloadIcon from 'components/Icons/Sidebar/fileDownload.svg';
import HexagonIcon from 'components/Icons/Sidebar/hexagon.svg';
import NotificationsIcon from 'components/Icons/Sidebar/notifications.svg';
import ReceiptIcon from 'components/Icons/Sidebar/receipt.svg';
import WrenchIcon from 'components/Icons/wrench';
import palette from 'theme/palette';
import { PageTypeItemButton } from './styles';

export const PAGE_TYPES = {
  HOMEPAGE: 'HOMEPAGE',
  SETTINGS: 'SETTINGS',
  DOCUMENTATION: 'DOCUMENTATION',
  LEADERBOARD: 'LEADERBOARD',
  MEMBERS: 'MEMBERS',
  ACTIVITIES: 'ACTIVITIES',
  SETTINGS_CONFIGURE_WALLET: 'SETTINGS_CONFIGURE_WALLET',
  SETTINGS_TOKEN_GATING: 'SETTINGS_TOKEN_GATING',
  SETTINGS_INTEGRATIONS_SETTINGS: 'SETTINGS_INTEGRATION_SETTINGS',
  SETTINGS_PAYMENT_LEDGER: 'SETTINGS_PAYMENT_LEDGER',
  SETTINGS_PAYMENT_METHOD: 'SETTINGS_PAYMENT_METHOD',
  SETTINGS_MEMBERS: 'SETTINGS_MEMBERS',
  SETTINGS_ROLES: 'SETTINGS_ROLES',
  SETTINGS_NOTIFICATIONS: 'SETTINGS_NOTIFICATIONS',
  SETTINGS_TASK_IMPORT: 'SETTINGS_TASK_IMPORT',
  SETTINGS_GITHUB: 'SETTINGS_GITHUB',
};

const PAGE_TYPES_MAP = {
  [PAGE_TYPES.HOMEPAGE]: {
    label: 'Project Home',
    Icon: () => <HomeIcon height="12px" width="12px" />,
  },
  [PAGE_TYPES.SETTINGS]: {
    label: 'Settings',
    Icon: () => <OrgSettingsIcon height="12px" width="12px" />,
  },
  [PAGE_TYPES.DOCUMENTATION]: {
    label: 'Documentation',
    Icon: FolderIcon,
  },
  [PAGE_TYPES.LEADERBOARD]: {
    label: 'Leaderboard',
    Icon: PieChartIcon,
  },
  [PAGE_TYPES.MEMBERS]: {
    label: 'Members',
    Icon: GroupIcon,
  },
  [ENTITIES_TYPES.TASK]: {
    label: 'Tasks',
    Icon: CheckBoxIcon,
  },
  [ENTITIES_TYPES.PROPOSAL]: {
    label: 'Proposals',
    Icon: ContentPaste,
  },
  [ENTITIES_TYPES.BOUNTY]: {
    label: 'Bounties',
    Icon: StartIcon,
  },
  [ENTITIES_TYPES.GRANT]: {
    label: 'Grants',
    Icon: GrantIcon,
  },
  [ENTITIES_TYPES.POD]: {
    label: 'Pods',
    Icon: PodIcon,
  },
  [ENTITIES_TYPES.ORG]: {
    label: 'Organizations',
    Icon: StackIcon,
  },
  [ENTITIES_TYPES.COLLAB]: {
    label: 'Collaborations',
    Icon: SmallDao2DaoIcon,
  },
  [ENTITIES_TYPES.MILESTONE]: {
    label: 'Milestones',
    Icon: FlagIcon,
  },
  [PAGE_TYPES.SETTINGS_CONFIGURE_WALLET]: {
    label: 'General Settings',
    Icon: HexagonIcon,
  },
  [PAGE_TYPES.SETTINGS_CONFIGURE_WALLET]: {
    label: 'Configure Wallet',
    Icon: WrenchIcon,
  },
  [PAGE_TYPES.SETTINGS_TOKEN_GATING]: {
    label: 'Token Gating',
    Icon: LockIconOutline,
  },
  [PAGE_TYPES.SETTINGS_INTEGRATIONS_SETTINGS]: {
    label: 'Integrations Settings',
    Icon: HexagonIcon,
  },
  [PAGE_TYPES.SETTINGS_PAYMENT_LEDGER]: {
    label: 'Payment Ledger',
    Icon: ReceiptIcon,
  },
  [PAGE_TYPES.SETTINGS_PAYMENT_METHOD]: {
    label: 'Payment Method',
    Icon: ReceiptIcon,
  },
  [PAGE_TYPES.SETTINGS_MEMBERS]: {
    label: 'Members',
    Icon: GroupIcon,
  },
  [PAGE_TYPES.SETTINGS_ROLES]: {
    label: 'Roles',
    Icon: GroupIcon,
  },
  [PAGE_TYPES.SETTINGS_NOTIFICATIONS]: {
    label: 'Notifications',
    Icon: NotificationsIcon,
  },
  [PAGE_TYPES.SETTINGS_TASK_IMPORT]: {
    label: 'Task Import',
    Icon: FileDownloadIcon,
  },
  [PAGE_TYPES.SETTINGS_GITHUB]: {
    label: 'Github',
    Icon: () => (
      <GitHubIcon
        style={{
          color: '#525252',
        }}
      />
    ),
  },
};

const PageType = ({ pageType = '' }) => {
  const { pageData = {} } = useGlobalContext();

  const key = pageType || pageData?.entityType || '';
  const { Icon, label } = PAGE_TYPES_MAP[key] || {};

  if (!label) return null;
  return (
    <PageTypeItemButton disableRipple type="button" disableHover>
      <IconTextWrapper>
        <ItemButtonIcon hoverColor={palette.grey78}>{Icon ? <Icon /> : null}</ItemButtonIcon>
        <ItemButtonText sx={{ whiteSpace: 'nowrap' }}>{label}</ItemButtonText>
      </IconTextWrapper>
    </PageTypeItemButton>
  );
};

export default PageType;
