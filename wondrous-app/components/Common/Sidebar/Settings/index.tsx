import { useLazyQuery } from '@apollo/client';
import GitHubIcon from '@mui/icons-material/GitHub';
import { logout, useMe } from 'components/Auth/withAuth';
import BackButton from 'components/Common/Sidebar/Common/BackButton';
import FileDownloadIcon from 'components/Common/Sidebar/Common/icons/fileDownload.svg';
import GroupIcon from 'components/Common/Sidebar/Common/icons/group.svg';
import HexagonIcon from 'components/Common/Sidebar/Common/icons/hexagon.svg';
import NotificationsIcon from 'components/Common/Sidebar/Common/icons/notifications.svg';
import PodIcon from 'components/Common/Sidebar/Common/icons/pods.svg';
import ReceiptIcon from 'components/Common/Sidebar/Common/icons/receipt.svg';
import Item from 'components/Common/Sidebar/Common/Item';
import {
  ChildrenWrapper,
  Label,
  ListWrapper,
  SidebarContent,
  SidebarWrapper,
  Wrapper,
} from 'components/Common/Sidebar/Common/styles';
import ChooseEntityToCreate from 'components/CreateEntity';
import ExitIcon from 'components/Icons/exit';
import RolesIcon from 'components/Icons/roles';
import { LockIconOutline } from 'components/Icons/userpass';
import WrenchIcon from 'components/Icons/wrench';
import { GET_ORG_BY_ID } from 'graphql/queries/org';
import { GET_POD_BY_ID } from 'graphql/queries/pod';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { SettingsPage } from 'types/common';
import { PERMISSIONS } from 'utils/constants';
import { SettingsBoardContext } from 'utils/contexts';
import { parseUserPermissionContext } from 'utils/helpers';
import { useCreateEntityContext, useSideBar } from 'utils/hooks';
import CollapseExpandButton from '../Common/CollapseButton';

import {
  ArchivedPodIndicatorText,
  SettingsChildrenWrapper,
  SettingsDaoPodIndicator,
  SettingsDaoPodIndicatorIconWrapper,
  SettingsDaoPodIndicatorOrgProfile,
  SettingsDaoPodIndicatorText,
} from './styles';

const createListItems = ({ orgId, podId }) => [
  {
    Icon: HexagonIcon,
    label: 'Profile Page Settings',
    value: 'general',
    href: `/profile/settings`,
    page: [SettingsPage.Profile],
  },
  {
    Icon: HexagonIcon,
    label: 'General Settings',
    value: 'general',
    href: orgId ? `/organization/settings/${orgId}/general` : `/pod/settings/${podId}/general`,
    page: [SettingsPage.Org, SettingsPage.Pod],
  },
  {
    Icon: WrenchIcon,
    label: 'Configure Wallet',
    value: 'wallet',
    href: orgId ? `/organization/settings/${orgId}/wallet` : `/pod/settings/${podId}/wallet`,
    page: [SettingsPage.Org, SettingsPage.Pod],
  },
  {
    Icon: LockIconOutline,
    label: 'Token Gating',
    value: 'token-gating',
    href: `/organization/settings/${orgId}/token-gating`,
    page: [SettingsPage.Org],
  },
  {
    Icon: HexagonIcon, // need icon
    label: 'Integrations Settings',
    value: 'integrations',
    href: orgId ? `/organization/settings/${orgId}/integrations` : `/pod/settings/${podId}/integrations`,
    page: [SettingsPage.Org],
  },
  {
    Icon: ReceiptIcon,
    label: 'Payments Ledger',
    value: 'payouts',
    href: orgId ? `/organization/settings/${orgId}/payouts` : `/pod/settings/${podId}/payouts`,
    page: [SettingsPage.Org, SettingsPage.Pod],
  },
  {
    Icon: ReceiptIcon,
    label: 'Payment Method',
    value: 'payment-method',
    href: `/organization/settings/${orgId}/payment-method`,
    page: [SettingsPage.Org],
  },
  {
    Icon: GroupIcon,
    label: 'Members',
    value: 'members',
    href: orgId ? `/organization/settings/${orgId}/members` : `/pod/settings/${podId}/members`,
    page: [SettingsPage.Org, SettingsPage.Pod],
  },
  {
    Icon: RolesIcon,
    label: 'Roles',
    value: 'roles',
    href: orgId ? `/organization/settings/${orgId}/roles` : `/pod/settings/${podId}/roles`,
    page: [SettingsPage.Org, SettingsPage.Pod],
  },
  {
    Icon: NotificationsIcon,
    label: 'Notifications',
    value: 'notifications',
    href: orgId ? `/organization/settings/${orgId}/notifications` : `/pod/settings/${podId}/notifications`,
    page: [SettingsPage.Org, SettingsPage.Pod],
  },
  {
    Icon: FileDownloadIcon,
    label: 'Task Import',
    value: 'import',
    href: `/organization/settings/${orgId}/task-import`,
    page: [SettingsPage.Org],
  },
  {
    Icon: NotificationsIcon,
    label: 'Notifications',
    value: 'notifications',
    href: `/profile/notifications`,
    page: [SettingsPage.Profile],
  },
  {
    Icon: () => (
      <GitHubIcon
        style={{
          color: '#525252',
        }}
      />
    ),
    label: 'Github',
    value: 'github',
    href: orgId ? `/organization/settings/${orgId}/github` : `/pod/settings/${podId}/github`,
    page: [SettingsPage.Pod],
  },
];

function SettingsWrapper(props) {
  const { children, showPodIcon = true } = props;

  const router = useRouter();
  const user = useMe();
  const { minimized } = useSideBar();
  const { userPermissionsContext } = useCreateEntityContext();

  const { pathname } = router;
  const { orgId, podId } = router.query;

  const [getOrgById, { data: orgData }] = useLazyQuery(GET_ORG_BY_ID);
  const [getPodById, { data: podData }] = useLazyQuery(GET_POD_BY_ID);

  const org = orgData?.getOrgById;
  const pod = podData?.getPodById;

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
    userPermissionsContext,
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

  const settingsPageConfig = {
    [String(orgId)]: {
      page: SettingsPage.Org,
      path: `/organization/${org?.username}/boards`,
      label: 'DAO',
    },
    [String(podId)]: {
      page: SettingsPage.Pod,
      path: `/pod/${podId}/boards`,
      label: 'Pod',
    },
    '': {
      page: SettingsPage.Profile,
      path: `/profile/${user?.username}/about`,
      label: 'Profile',
    },
  };
  const activeSettingsPage = settingsPageConfig?.[String(podId ?? orgId ?? '')];
  const podIsArchived = !!podData?.getPodById?.archivedAt;
  return (
    <SettingsBoardContext.Provider
      value={{
        userPermissionsContext,
        org,
        pod,
      }}
    >
      <ChooseEntityToCreate />
      <Wrapper>
        <SidebarWrapper minimized={minimized}>
          <SidebarContent>
            <BackButton href={activeSettingsPage?.path} />
            <ListWrapper>
              <Label>{activeSettingsPage.label} Settings</Label>
              <ListWrapper>
                {createListItems({ orgId, podId }).map((item) => {
                  if (!item.page?.includes(activeSettingsPage.page)) return null;
                  const { href, Icon, label } = item;
                  const pathnameSplit = pathname.split('/');
                  const hrefSplit = href.split('/');
                  const endPathName = pathnameSplit[pathnameSplit.length - 1];
                  const endHref = hrefSplit[hrefSplit.length - 1];
                  const active = endHref === endPathName;
                  return (
                    <Link key={href} href={href} passHref>
                      <Item key={label} Icon={Icon} isActive={active}>
                        {label}
                      </Item>
                    </Link>
                  );
                })}
                <Item Icon={ExitIcon} onClick={() => logout()}>
                  Log out
                </Item>
              </ListWrapper>
            </ListWrapper>
          </SidebarContent>
          <CollapseExpandButton />
        </SidebarWrapper>

        <ChildrenWrapper minimized={minimized}>
          <SettingsChildrenWrapper>
            <div>
              {showPodIcon ? (
                <SettingsDaoPodIndicator pod={podData?.getPodById?.name}>
                  <SettingsDaoPodIndicatorOrgProfile src={orgData?.getOrgById?.profilePicture} />
                  <SettingsDaoPodIndicatorIconWrapper color={podData?.getPodById.color}>
                    <PodIcon />
                  </SettingsDaoPodIndicatorIconWrapper>
                  <SettingsDaoPodIndicatorText>{podData?.getPodById?.name} Pod</SettingsDaoPodIndicatorText>
                  {podIsArchived && <ArchivedPodIndicatorText>ARCHIVED</ArchivedPodIndicatorText>}
                </SettingsDaoPodIndicator>
              ) : null}
              {children}
            </div>
          </SettingsChildrenWrapper>
        </ChildrenWrapper>
      </Wrapper>
    </SettingsBoardContext.Provider>
  );
}

export default SettingsWrapper;
