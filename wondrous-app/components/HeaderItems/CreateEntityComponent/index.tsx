import { Grid, Typography } from '@mui/material';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import { SmallDao2DaoIcon } from 'components/Icons/Dao2Dao';
import GrantIcon from 'components/Icons/GrantIcon';
import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import ContentPaste from 'components/Icons/Sidebar/contentPaste.svg';
import FlagIcon from 'components/Icons/Sidebar/flag.svg';
import PodIcon from 'components/Icons/Sidebar/pods.svg';
import StartIcon from 'components/Icons/Sidebar/star.svg';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { ENTITIES_TYPES } from 'utils/constants';
import { useGlobalContext } from 'utils/hooks';
import { EntityItem, HorizontalEntityItem, Label, Wrapper } from './styles';

const CreateEntityComponent = ({ onClose }) => {
  const { pageData, setPageData } = useGlobalContext();

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

  const setEntityType = (entityType) => {
    setPageData({ ...pageData, createEntityType: entityType });
    onClose();
  };

  const SPACE_ITEMS_CONFIG = {
    label: 'Space',
    items: {
      [ENTITIES_TYPES.POD]: {
        icon: PodIcon,
        label: 'Pod',
      },
      [ENTITIES_TYPES.GRANT]: {
        icon: GrantIcon,
        label: 'Grant',
      },
      [ENTITIES_TYPES.COLLAB]: {
        icon: SmallDao2DaoIcon,
        label: 'Collaboration',
      },
    },
  };

  return (
    <Wrapper data-cy="modal-base">
      <>
        <Label>{BOARD_ITEMS_CONFIG.label}</Label>
        <Grid display="flex" flexWrap="wrap" justifyContent="space-between" gap="12px">
          {Object.keys(BOARD_ITEMS_CONFIG.items).map((item) => {
            const { icon: Icon, label } = BOARD_ITEMS_CONFIG.items[item];
            return (
              <EntityItem key={label} onClick={() => setEntityType(item)} data-cy={`modal-item-${label}`}>
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
      </>
      <>
        <Label>{SPACE_ITEMS_CONFIG.label}</Label>
        <Grid display="flex" flexWrap="wrap" justifyContent="space-between" gap="12px">
          {Object.keys(SPACE_ITEMS_CONFIG.items).map((item) => {
            const { icon: Icon, label } = SPACE_ITEMS_CONFIG.items[item];
            return (
              <HorizontalEntityItem key={label} onClick={() => setEntityType(item)}>
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
      </>
    </Wrapper>
  );
};

export default CreateEntityComponent;
