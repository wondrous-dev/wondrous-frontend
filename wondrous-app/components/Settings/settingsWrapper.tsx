import React, { useState } from 'react';
import { toggleHtmlOverflow } from '../../utils/helpers';
import { useRouter } from 'next/router';
import { List } from '@mui/material';
import Link from 'next/link';
import {
  SettingsContainer,
  SettingsContentBlock,
  SettingsSidebar,
  SettingsSidebarContainer,
  SettingsSidebarHeader,
  SettingsSidebarHeaderLogo,
  SettingsSidebarHeaderTitle,
  SettingsSidebarLogoutButton,
  SettingsSidebarLogoutButtonIcon,
  SettingsSidebarLogoutButtonText,
  SettingsSidebarTabsListContainer,
  SettingsSidebarTabsListItemButton,
  SettingsSidebarTabsListItemButtonWrapper,
  SettingsSidebarTabsListItemIcon,
  SettingsSidebarTabsListItemText,
  SettingsSidebarTabsSection,
  SettingsSidebarTabsSectionLabel,
} from './styles';
import SideBarComponent from '../SideBar';
import HeaderComponent from '../Header';
import CreateFormModal from '../CreateEntity';
import GeneralSettingsIcon from '../Icons/generalSettings';
import ConfigurePaymentsIcon from '../Icons/configurePayments';
import CreatePodIcon from '../Icons/createPod';
import MembersIcon from '../Icons/members';

const SIDEBAR_LIST_ITEMS = [
  {
    id: 1,
    icon: '/images/sidebar/first.png',
    path: '/',
  },
  {
    id: 2,
    icon: '/images/sidebar/second.png',
    path: '/',
  },
  {
    id: 3,
    icon: '/images/sidebar/third.png',
    path: '/',
  },
];

const SETTINGS_SIDEBAR_LIST_ITEMS = [
  {
    icon: <GeneralSettingsIcon width={40} height={40} />,
    label: 'General settings',
    value: 'general',
    href: `/organization/settings/general`,
  },
  {
    icon: <CreatePodIcon width={35} height={35} />,
    label: 'Pod management',
    value: 'management',
    href: `/organization/settings/pod`,
  },
  {
    icon: <MembersIcon width={40} height={40} />,
    label: 'Members',
    value: 'members',
    href: `/organization/settings/members`,
  },
  {
    icon: <MembersIcon width={40} height={40} />,
    label: 'Roles',
    value: 'roles',
    href: `/organization/settings/roles`,
  },
];

export const SettingsWrapper = (props) => {
  const { children } = props;

  const router = useRouter();

  const { pathname } = router;

  const [createFormModal, setCreateFormModal] = useState(false);

  const toggleCreateFormModal = () => {
    toggleHtmlOverflow();
    setCreateFormModal((prevState) => !prevState);
  };

  return (
    <>
      <HeaderComponent openCreateFormModal={toggleCreateFormModal} />
      <SideBarComponent />
      <CreateFormModal open={createFormModal} toggleOpen={toggleCreateFormModal} />
      <SettingsContainer>
        <SettingsSidebar>
          <SettingsSidebarContainer>
            <SettingsSidebarHeader>
              <SettingsSidebarHeaderLogo />
              <SettingsSidebarHeaderTitle>Wonder</SettingsSidebarHeaderTitle>
            </SettingsSidebarHeader>
            <SettingsSidebarTabsSection>
              <SettingsSidebarTabsSectionLabel>Settings Overview</SettingsSidebarTabsSectionLabel>
              <SettingsSidebarTabsListContainer>
                <List>
                  {SETTINGS_SIDEBAR_LIST_ITEMS.map((item) => {
                    const { href, icon, label } = item;

                    const active = pathname === href;

                    return (
                      <Link key={href} href={href}>
                        <SettingsSidebarTabsListItemButtonWrapper active={active}>
                          <SettingsSidebarTabsListItemButton selected={active}>
                            <SettingsSidebarTabsListItemIcon>{icon}</SettingsSidebarTabsListItemIcon>
                            <SettingsSidebarTabsListItemText>{label}</SettingsSidebarTabsListItemText>
                          </SettingsSidebarTabsListItemButton>
                        </SettingsSidebarTabsListItemButtonWrapper>
                      </Link>
                    );
                  })}
                </List>
                <SettingsSidebarLogoutButton>
                  <SettingsSidebarLogoutButtonIcon />
                  <SettingsSidebarLogoutButtonText>Log out</SettingsSidebarLogoutButtonText>
                </SettingsSidebarLogoutButton>
              </SettingsSidebarTabsListContainer>
            </SettingsSidebarTabsSection>
          </SettingsSidebarContainer>
        </SettingsSidebar>
        <SettingsContentBlock>{children}</SettingsContentBlock>
      </SettingsContainer>
    </>
  );
};
