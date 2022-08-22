import { useQuery } from '@apollo/client';
import { useCanManage } from 'components/Common/Sidebar/Common/hooks';
import SettingsIcon from 'components/Icons/settings.svg';
import { GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD, GET_POD_ROLES_WITH_TOKEN_GATE } from 'graphql/queries';
import { pickBy } from 'lodash';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useBoards } from 'utils/hooks';

import BackButton from '../Common/BackButton';
import Item from '../Common/Item';
import { AddIconWrapper, Label, ListWrapper } from '../Common/styles';

const useBackHref = ({ router }) => {
  const query = pickBy(router.query, (_v, key) => key !== 'roles');
  const href = {
    pathname: router.pathname,
    query,
  };
  return href;
};

const StyledSettingsIcon = styled(SettingsIcon)`
  && {
    transform: scale(70%);
  }
`;

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const RolesSidebar = () => {
  const router = useRouter();
  const { board, orgBoard, podBoard } = useBoards();
  const { data: getOrgRolesData } = useQuery(GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD, {
    variables: {
      orgId: board.orgId,
    },
    skip: podBoard,
  });
  const { data: getPodRolesData } = useQuery(GET_POD_ROLES_WITH_TOKEN_GATE, {
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
