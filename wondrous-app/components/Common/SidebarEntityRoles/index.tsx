import { useQuery } from '@apollo/client';
import BackButton from 'components/Common/SidebarBackButton';
import { SectionWrapper, StyledSettingsIcon } from 'components/Common/SidebarEntityRoles/styles';
import Item from 'components/Common/SidebarItem';
import { AddIconWrapper, Label, ListWrapper } from 'components/Common/SidebarStyles';
import { GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD, GET_POD_ROLES_WITH_TOKEN_GATE_AND_DISCORD } from 'graphql/queries';
import useCanManage from 'hooks/useCanManage';
import { pickBy } from 'lodash';
import { useRouter } from 'next/router';
import { useBoards } from 'utils/hooks';

const useBackHref = ({ router }) => {
  const query = pickBy(router.query, (_v, key) => key !== 'roles');
  const href = {
    pathname: router.pathname,
    query,
  };
  return href;
};

const RolesSidebar = () => {
  const router = useRouter();
  const { board, orgBoard, podBoard } = useBoards();
  const { data: getOrgRolesData } = useQuery(GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD, {
    variables: {
      orgId: board.orgId,
    },
    skip: podBoard,
  });
  const { data: getPodRolesData } = useQuery(GET_POD_ROLES_WITH_TOKEN_GATE_AND_DISCORD, {
    variables: {
      podId: board.podId,
    },
    skip: orgBoard,
  });
  const { orgRoles, podRoles } = board.userPermissionsContext || {};
  const userRole = { ...orgRoles, ...podRoles }[board.orgId || board.podId];
  const availableRoles = getOrgRolesData?.getOrgRoles || getPodRolesData?.getPodRoles;
  const otherRoles = availableRoles?.filter((i) => i.name !== userRole);
  const href = useBackHref({ router });
  const handleCreateNewRole = () =>
    router.push(orgBoard ? `/organization/settings/${board.orgId}/roles` : `/pod/settings/${board.podId}/roles`);
  const canManage = useCanManage();
  return (
    <>
      <BackButton href={href} />
      <SectionWrapper>
        <ListWrapper>
          <ListWrapper>
            <Label>Your current role</Label>
            <Item disabled>{userRole}</Item>
          </ListWrapper>
          <ListWrapper>
            <Label>Other roles</Label>
            {otherRoles?.map(({ name, id: roleId }) => (
              <Item key={roleId} disabled>
                {name}
              </Item>
            ))}
            {canManage && (
              <Item roundedBg onClick={handleCreateNewRole}>
                <AddIconWrapper /> New Role
              </Item>
            )}
          </ListWrapper>
        </ListWrapper>
        {canManage && (
          <Item Icon={StyledSettingsIcon} onClick={handleCreateNewRole}>
            Role Settings
          </Item>
        )}
      </SectionWrapper>
    </>
  );
};

export default RolesSidebar;
