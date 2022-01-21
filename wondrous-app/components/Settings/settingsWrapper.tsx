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
import { useQuery } from '@apollo/client';
import { GET_ORG_BY_ID } from '../../graphql/queries/org';
import { SafeImage } from '../Common/Image';
import { GET_USER_PERMISSION_CONTEXT } from '../../graphql/queries';
import { SettingsBoardContext } from '../../utils/contexts';

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

// Full list
//  const SETTINGS_SIDEBAR_LIST_ITEMS = [
// 	{
// 		icon: <GeneralSettingsIcon width={40} height={40} />,
// 		label: 'General settings',
// 		value: 'general',
// 		href: `/organization/settings/general`,
// 	},
// 	// {
// 	// 	icon: <ConfigurePaymentsIcon width={40} height={40} />,
// 	// 	label: 'Configure payments',
// 	// 	value: 'payments',
// 	// 	href: `/organization/settings/payments`,
// 	// },
// 	{
// 		icon: <CreatePodIcon width={35} height={35} />,
// 		label: 'Pod management',
// 		value: 'management',
// 		href: `/organization/settings/pod`,
// 	},
// 	{
// 		icon: <MembersIcon width={40} height={40} />,
// 		label: 'Members',
// 		value: 'members',
// 		href: `/organization/settings/members`,
// 	},
// 	{
// 		icon: <MembersIcon width={40} height={40} />,
// 		label: 'Roles',
// 		value: 'roles',
// 		href: `/organization/settings/roles`,
// 	},
// ]

export const SettingsWrapper = (props) => {
  const { children } = props;

  const router = useRouter();

  const { pathname } = router;
  const { orgId } = router.query;
  const [createFormModal, setCreateFormModal] = useState(false);
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const toggleCreateFormModal = () => {
    toggleHtmlOverflow();
    setCreateFormModal((prevState) => !prevState);
  };
  const { data: orgData } = useQuery(GET_ORG_BY_ID, {
    variables: {
      orgId,
    },
  });
  const org = orgData?.getOrgById;
  const SETTINGS_SIDEBAR_LIST_ITEMS = [
    {
      icon: <GeneralSettingsIcon width={40} height={40} />,
      label: 'General settings',
      value: 'general',
      href: `/organization/settings/${orgId}/general`,
    },
    {
      icon: <MembersIcon width={40} height={40} />,
      label: 'Members',
      value: 'members',
      href: `/organization/settings/${orgId}/members`,
    },
    {
      icon: <MembersIcon width={40} height={40} />,
      label: 'Roles',
      value: 'roles',
      href: `/organization/settings/${orgId}/roles`,
    },
  ];

  const parsedUserPermissionsContext = userPermissionsContext?.getUserPermissionContext
    ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
    : null;

  return (
    <>
      <SettingsBoardContext.Provider
        value={{
          userPermissionsContext: parsedUserPermissionsContext,
        }}
      >
        <HeaderComponent openCreateFormModal={toggleCreateFormModal} />
        <SideBarComponent />
        <CreateFormModal open={createFormModal} toggleOpen={toggleCreateFormModal} />
        <SettingsContainer>
          <SettingsSidebar>
            <SettingsSidebarContainer>
              <SettingsSidebarHeader>
                <SafeImage
                  src={org?.profilePicture}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '4px',
                    marginRight: '14px',
                  }}
                />
                <SettingsSidebarHeaderTitle>{org?.name}</SettingsSidebarHeaderTitle>
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
      </SettingsBoardContext.Provider>
    </>
  );
};
