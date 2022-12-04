import { ENTITIES_TYPES, PERMISSIONS } from 'utils/constants';
import { useGlobalContext } from 'utils/hooks';
import { useRouter } from 'next/router';
import { parseUserPermissionContext } from 'utils/helpers';
import { Grid, Typography } from '@mui/material';
import { Wrapper, EntityItem, Label, HorizontalEntityItem } from './styles';
import ContentPaste from 'components/Icons/Sidebar/contentPaste.svg';
import FlagIcon from 'components/Icons/Sidebar/flag.svg';
import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import StartIcon from 'components/Icons/Sidebar/star.svg';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import palette from 'theme/palette';
import typography from 'theme/typography';
import PodIcon from 'components/Icons/Sidebar/pods.svg';
import GrantIcon from 'components/Icons/GrantIcon';

const CreateEntityComponent = () => {
  const router = useRouter();
  const { pageData, userPermissionsContext } = useGlobalContext();

  console.log(pageData, 'pageData');

  const permissions = parseUserPermissionContext({
    userPermissionsContext: userPermissionsContext,
    orgId: pageData?.orgData?.id,
    podId: pageData?.podData?.podId,
  });

  const BOARD_ITEMS_CONFIG = {
    label: 'Board item',
    items: {
      [ENTITIES_TYPES.TASK]: {
        icon: CheckBoxIcon,
        label: 'Task',
      },
      [ENTITIES_TYPES.MILESTONE]: {
        icon: FlagIcon,
        label: 'Milestone',
        hide: permissions?.includes(PERMISSIONS.CREATE_TASK) || permissions?.includes(PERMISSIONS.FULL_ACCESS),
      },
      [ENTITIES_TYPES.BOUNTY]: {
        icon: StartIcon,
        label: 'Bounty',
      },
      [ENTITIES_TYPES.PROPOSAL]: {
        icon: ContentPaste,
        label: 'Proposal',
      },
    },
  };

  const SPACE_ITEMS_CONFIG = {
    label: 'Space',
    items: {
      [ENTITIES_TYPES.POD]: {
        icon: PodIcon,
        label: 'Pod',
        hide: permissions?.includes(PERMISSIONS.MANAGE_POD) || permissions?.includes(PERMISSIONS.FULL_ACCESS),
      },
      [ENTITIES_TYPES.GRANT]: {
        icon: GrantIcon,
        label: 'Grant',
      },
    },
  };

  return (
    <Wrapper>
      <Label>{BOARD_ITEMS_CONFIG.label}</Label>
      <Grid display="flex" flexWrap="wrap" justifyContent="space-between" gap="12px">
        {Object.keys(BOARD_ITEMS_CONFIG.items).map((item, key) => {
          const { icon: Icon, label } = BOARD_ITEMS_CONFIG.items[item];
          return (
            <EntityItem key={key}>
              <ItemButtonIcon bgColor={palette.grey75}>
                <Icon />
              </ItemButtonIcon>

              <Typography color={palette.white} fontSize="15px" fontWeight={500} fontFamily={typography.fontFamily}>
                {label}
              </Typography>
            </EntityItem>
          );
        })}
      </Grid>
      <Label>{SPACE_ITEMS_CONFIG.label}</Label>
      <Grid display="flex" flexWrap="wrap" justifyContent="space-between" gap="12px">
      {Object.keys(SPACE_ITEMS_CONFIG.items).map((item, key) => {
          const { icon: Icon, label } = SPACE_ITEMS_CONFIG.items[item];
          return (
            <HorizontalEntityItem key={key}>
              <ItemButtonIcon bgColor={palette.grey75}>
                <Icon />
              </ItemButtonIcon>

              <Typography color={palette.white} fontSize="15px" fontWeight={500} fontFamily={typography.fontFamily}>
                {label}
              </Typography>
            </HorizontalEntityItem>
          );
        })}
        </Grid>
    </Wrapper>
  );
};

export default CreateEntityComponent;
