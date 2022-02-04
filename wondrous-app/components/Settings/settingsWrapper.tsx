import React, { useEffect, useState } from 'react';
import { parseUserPermissionContext, toggleHtmlOverflow } from '../../utils/helpers';
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
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_ORG_BY_ID } from '../../graphql/queries/org';
import { SafeImage } from '../Common/Image';
import { GET_USER_PERMISSION_CONTEXT } from '../../graphql/queries';
import { SettingsBoardContext } from '../../utils/contexts';
import { GET_POD_BY_ID } from '../../graphql/queries/pod';
import { PERMISSIONS } from '../../utils/constants';
import { useMe } from '../Auth/withAuth';
import SettingsIcon from '../Icons/settings';

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
  const user = useMe();

  const { pathname } = router;
  const { orgId, podId } = router.query;
  const [createFormModal, setCreateFormModal] = useState(false);
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const toggleCreateFormModal = () => {
    toggleHtmlOverflow();
    setCreateFormModal((prevState) => !prevState);
  };
  const [getOrgById, { data: orgData }] = useLazyQuery(GET_ORG_BY_ID);
  const [getPodById, { data: podData }] = useLazyQuery(GET_POD_BY_ID);

  const org = orgData?.getOrgById || podData?.getPodById?.orgId;
  const pod = podData?.getPodById;

  const PROFILE_SIDEBAR_LIST_ITEMS = [
    {
      icon: <GeneralSettingsIcon width={40} height={40} />,
      label: 'Profile Page Settings',
      value: 'general',
      href: `/profile/settings`,
    },
  ];

  const SETTINGS_SIDEBAR_LIST_ITEMS = [
    {
      icon: <GeneralSettingsIcon width={40} height={40} />,
      label: 'General settings',
      value: 'general',
      href: orgId ? `/organization/settings/${orgId}/general` : `/pod/settings/${podId}/general`,
    },
    {
      icon: <MembersIcon width={40} height={40} />,
      label: 'Members',
      value: 'members',
      href: orgId ? `/organization/settings/${orgId}/members` : `/pod/settings/${podId}/members`,
    },
    {
      icon: <MembersIcon width={40} height={40} />,
      label: 'Roles',
      value: 'roles',
      href: orgId ? `/organization/settings/${orgId}/roles` : `/pod/settings/${podId}/roles`,
    },
  ];

  const parsedUserPermissionsContext = userPermissionsContext?.getUserPermissionContext
    ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
    : null;

  useEffect(() => {
    if (orgId) {
      getOrgById({
        variables: {
          orgId,
        },
      });
    }
    if (podId) {
      getPodById({
        variables: {
          podId,
        },
      });
    }
  }, [orgId, podId]);

  const permissions = parseUserPermissionContext({
    userPermissionsContext: parsedUserPermissionsContext,
    orgId: orgId || pod?.orgId,
    podId,
  });

  if (
    permissions &&
    !(
      permissions.includes(PERMISSIONS.MANAGE_MEMBER) ||
      permissions.includes(PERMISSIONS.FULL_ACCESS) ||
      permissions.includes(PERMISSIONS.APPROVE_PAYMENT)
    )
  ) {
    if (podId && pod) {
      router.push(`/pod/${podId}/boards`, undefined, {
        shallow: true,
      });
    } else if (org) {
      router.push(`/organization/${org?.username}/boards`, undefined, {
        shallow: true,
      });
    }
  }

  return (
    <>
      <SettingsBoardContext.Provider
        value={{
          userPermissionsContext: parsedUserPermissionsContext,
          org,
          pod,
        }}
      >
        <HeaderComponent openCreateFormModal={toggleCreateFormModal} />
        <SideBarComponent />
        <CreateFormModal open={createFormModal} toggleOpen={toggleCreateFormModal} />
        <SettingsContainer>
          <SettingsSidebar>
            <SettingsSidebarContainer>
              <SettingsSidebarHeader>
                {org && (
                  <SafeImage
                    src={org?.profilePicture}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '4px',
                      marginRight: '14px',
                    }}
                  />
                )}
                <SettingsSidebarHeaderTitle>{pod?.name || org?.name}</SettingsSidebarHeaderTitle>
              </SettingsSidebarHeader>
              <SettingsSidebarTabsSection>
                <SettingsSidebarTabsSectionLabel>Settings Overview</SettingsSidebarTabsSectionLabel>
                <SettingsSidebarTabsListContainer>
                  <List>
                    {(orgData || podData) &&
                      SETTINGS_SIDEBAR_LIST_ITEMS.map((item) => {
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
                    {!orgData &&
                      !podData &&
                      PROFILE_SIDEBAR_LIST_ITEMS.map((item) => {
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
                  {/* <SettingsSidebarLogoutButton>
                    <SettingsSidebarLogoutButtonIcon />
                    <SettingsSidebarLogoutButtonText>Log out</SettingsSidebarLogoutButtonText>
                  </SettingsSidebarLogoutButton> */}
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
