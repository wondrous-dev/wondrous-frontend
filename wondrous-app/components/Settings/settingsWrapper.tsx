import { useLazyQuery, useQuery } from '@apollo/client';
import LeftArrowIcon from '@components/Icons/leftArrow';
import PodIcon from '@components/Icons/podIcon';
import RolesIcon from '@components/Icons/roles';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { GET_USER_PERMISSION_CONTEXT } from '../../graphql/queries';
import { GET_ORG_BY_ID } from '../../graphql/queries/org';
import { GET_POD_BY_ID } from '../../graphql/queries/pod';
import { PERMISSIONS } from '../../utils/constants';
import { SettingsBoardContext } from '../../utils/contexts';
import { parseUserPermissionContext, toggleHtmlOverflow } from '../../utils/helpers';
import { useMe } from '../Auth/withAuth';
import CreateFormModal from '../CreateEntity';
import HeaderComponent from '../Header';
import CardIcon from '../Icons/card';
import GeneralSettingsIcon from '../Icons/generalSettings';
import MembersIcon from '../Icons/members';
import { NotificationOutlineSettings } from '../Icons/notifications';
import WrenchIcon from '../Icons/wrench';
import SideBarComponent from '../SideBar';
import {
  SettingsContainer,
  SettingsContentBlock,
  SettingsDaoPodIndicator,
  SettingsDaoPodIndicatorIconWrapper,
  SettingsDaoPodIndicatorOrgProfile,
  SettingsDaoPodIndicatorText,
  SettingsSidebar,
  SettingsSidebarContainer,
  SettingsSidebarHeader,
  SettingsSidebarTabsListContainer,
  SettingsSidebarTabsListItem,
  SettingsSidebarTabsListItemIcon,
  SettingsSidebarTabsListItemText,
  SettingsSidebarTabsSection,
  SettingsSidebarTabsSectionLabel,
} from './styles';

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

  let SETTINGS_SIDEBAR_LIST_ITEMS = [
    {
      icon: <GeneralSettingsIcon width={40} height={40} />,
      label: 'General Settings',
      value: 'general',
      href: orgId ? `/organization/settings/${orgId}/general` : `/pod/settings/${podId}/general`,
    },
    {
      icon: <WrenchIcon width={40} height={40} />,
      label: 'Configure Wallet',
      value: 'wallet',
      href: orgId ? `/organization/settings/${orgId}/wallet` : `/pod/settings/${podId}/wallet`,
    },
    {
      icon: <CardIcon width={40} height={40} />,
      label: 'Payments Ledger',
      value: 'payouts',
      href: orgId ? `/organization/settings/${orgId}/payouts` : `/pod/settings/${podId}/payouts`,
    },
    {
      icon: <MembersIcon />,
      label: 'Members',
      value: 'members',
      href: orgId ? `/organization/settings/${orgId}/members` : `/pod/settings/${podId}/members`,
    },
    {
      icon: <RolesIcon />,
      label: 'Roles',
      value: 'roles',
      href: orgId ? `/organization/settings/${orgId}/roles` : `/pod/settings/${podId}/roles`,
    },
  ];

  if (orgId && !podId) {
    SETTINGS_SIDEBAR_LIST_ITEMS.push({
      icon: <NotificationOutlineSettings />,
      label: 'Notifications',
      value: 'notifications',
      href: `/organization/settings/${orgId}/notifications`,
    });
  }
  const parsedUserPermissionsContext = userPermissionsContext?.getUserPermissionContext
    ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
    : null;

  useEffect(() => {
    if (orgId || org) {
      getOrgById({
        variables: {
          orgId: orgId ?? org,
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
  }, [getOrgById, getPodById, org, orgId, podId]);

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

  const backButton = {
    [String(orgId)]: {
      path: `/organization/${org?.username}/boards`,
      label: 'DAO',
    },
    [String(podId)]: {
      path: `/pod/${podId}/boards`,
      label: 'Pod',
    },
    ['']: {
      path: `/profile/${user?.username}/about`,
      label: 'Profile',
    },
  };
  const backButtonActive = backButton?.[String(podId ?? orgId ?? '')];
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
                <Link href={backButtonActive?.path} passHref>
                  <SettingsSidebarTabsListItem>
                    <SettingsSidebarTabsListItemIcon>
                      <LeftArrowIcon />
                    </SettingsSidebarTabsListItemIcon>
                    <SettingsSidebarTabsListItemText>Back to {backButtonActive.label}</SettingsSidebarTabsListItemText>
                  </SettingsSidebarTabsListItem>
                </Link>
              </SettingsSidebarHeader>
              <SettingsSidebarTabsSection>
                <SettingsSidebarTabsSectionLabel>{backButtonActive.label} Settings</SettingsSidebarTabsSectionLabel>
                <SettingsSidebarTabsListContainer>
                  {(orgData || podData) &&
                    SETTINGS_SIDEBAR_LIST_ITEMS.map((item) => {
                      const { href, icon, label } = item;
                      const pathnameSplit = pathname.split('/');
                      const hrefSplit = href.split('/');
                      const endPathName = pathnameSplit[pathnameSplit.length - 1];
                      const endHref = hrefSplit[hrefSplit.length - 1];
                      const active = endHref === endPathName;

                      return (
                        <Link key={href} href={href} passHref>
                          <SettingsSidebarTabsListItem active={active}>
                            <SettingsSidebarTabsListItemIcon active={active}>{icon}</SettingsSidebarTabsListItemIcon>
                            <SettingsSidebarTabsListItemText active={active}>{label}</SettingsSidebarTabsListItemText>
                          </SettingsSidebarTabsListItem>
                        </Link>
                      );
                    })}
                  {!orgData &&
                    !podData &&
                    PROFILE_SIDEBAR_LIST_ITEMS.map((item) => {
                      const { href, icon, label } = item;

                      const active = pathname === href;

                      return (
                        <Link key={href} href={href} passHref>
                          <SettingsSidebarTabsListItem active={active}>
                            <SettingsSidebarTabsListItemIcon active={active}>{icon}</SettingsSidebarTabsListItemIcon>
                            <SettingsSidebarTabsListItemText active={active}>{label}</SettingsSidebarTabsListItemText>
                          </SettingsSidebarTabsListItem>
                        </Link>
                      );
                    })}
                  {/* <SettingsSidebarLogoutButton>
                    <SettingsSidebarLogoutButtonIcon />
                    <SettingsSidebarLogoutButtonText>Log out</SettingsSidebarLogoutButtonText>
                  </SettingsSidebarLogoutButton> */}
                </SettingsSidebarTabsListContainer>
              </SettingsSidebarTabsSection>
            </SettingsSidebarContainer>
          </SettingsSidebar>
          <SettingsContentBlock>
            <SettingsDaoPodIndicator pod={podData?.getPodById?.name}>
              <SettingsDaoPodIndicatorOrgProfile src={orgData?.getOrgById?.profilePicture} />
              <SettingsDaoPodIndicatorIconWrapper color={podData?.getPodById.color}>
                <PodIcon />
              </SettingsDaoPodIndicatorIconWrapper>
              <SettingsDaoPodIndicatorText>{podData?.getPodById?.name} Pod</SettingsDaoPodIndicatorText>
            </SettingsDaoPodIndicator>
            {children}
          </SettingsContentBlock>
        </SettingsContainer>
      </SettingsBoardContext.Provider>
    </>
  );
};
