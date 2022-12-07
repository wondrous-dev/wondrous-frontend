import Grid from '@mui/material/Grid';
import Popover from '@mui/material/Popover';
import { useGlobalContext } from 'utils/hooks';
import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';

import { Wrapper, OrgItem, OrgWrapper, ItemsWrapper, UnstyledButton } from './styles';
import palette from 'theme/palette';
import PlusIcon from 'components/Icons/plus';
import { ExplorePageMinimalIcon } from 'components/Icons/ExplorePageIcons';
import { HorizontalEntityItem } from 'components/HeaderItems/styles';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import typography from 'theme/typography';
import Typography from '@mui/material/Typography';
import OrgSettingsIcon from 'components/Icons/OrgSettingsIcon';
import Link from 'next/link';
import { PAGE_PATHNAME } from 'utils/constants';
import AddDaoButton from 'components/Common/SidebarMainAddDao';

const ITEMS_CONFIG = [
  {
    type: 'component',
    Component: () => (
      <AddDaoButton
        renderButton={({handleCreateDaoModal}) => (
          <UnstyledButton type="button" onClick={handleCreateDaoModal}>
            <HorizontalEntityItem>
              <ItemButtonIcon bgColor={palette.grey75}>
                <PlusIcon />
              </ItemButtonIcon>

              <Typography color={palette.white} fontSize="15px" fontWeight={500} fontFamily={typography.fontFamily}>
                Create New Project
              </Typography>
            </HorizontalEntityItem>
          </UnstyledButton>
        )}
      />
    ),
  },
  {
    label: 'Explore Projects',
    Icon: ExplorePageMinimalIcon,
    type: 'link',
    url: PAGE_PATHNAME.explore,
  },
  {
    label: 'Settings',
    Icon: OrgSettingsIcon,
    type: 'link',
    url: '/profile/settings',
  },
];

const TYPE_TO_COMPONENT = {
  button: UnstyledButton,
  link: Link,
};

const WorkspacePicker = ({ open, anchorEl, onClose }) => {
  const { orgsList } = useGlobalContext();

  console.log(orgsList);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      sx={{
        '& .MuiPopover-paper': {
          borderRadius: '6px',
          border: `1px solid ${palette.grey79}`,
        },
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Wrapper>
        <OrgWrapper gap="8px" display="flex" flexWrap="wrap" justifyContent="space-between">
          {orgsList?.map((org, key) => {
            return (
              <OrgItem key={org?.id} isActive={org?.isActive} href={`/organization/${org?.username}/project`}>
                <OrgProfilePicture
                  profilePicture={org?.profilePicture}
                  style={{
                    borderRadius: '3px',
                    width: '28px',
                    height: '28px',
                  }}
                />
                {org?.name}
              </OrgItem>
            );
          })}
        </OrgWrapper>
        <ItemsWrapper>
          {ITEMS_CONFIG?.map(({ Icon, label, type, url, Component }, key) => {
            if (type === 'component') return <Component key={key} />;

            const Wrapper = TYPE_TO_COMPONENT[type];

            const wrapperProps = url ? { href: url } : { onClick: onClose };

            return (
              <Wrapper {...wrapperProps}>
                <HorizontalEntityItem key={key}>
                  <ItemButtonIcon bgColor={palette.grey75}>
                    <Icon />
                  </ItemButtonIcon>

                  <Typography color={palette.white} fontSize="15px" fontWeight={500} fontFamily={typography.fontFamily}>
                    {label}
                  </Typography>
                </HorizontalEntityItem>
              </Wrapper>
            );
          })}
        </ItemsWrapper>
      </Wrapper>
    </Popover>
  );
};

export default WorkspacePicker;
