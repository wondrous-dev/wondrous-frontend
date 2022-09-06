import { useQuery } from '@apollo/client';
import BackButton from 'components/Common/SidebarBackButton';
import { SectionWrapper, StyledSettingsIcon } from 'components/Common/SidebarEntityRoles/styles';
import Item from 'components/Common/SidebarItem';
import { AddIconWrapper, Label, ListWrapper } from 'components/Common/SidebarStyles';
import CreateCollaborationModal from 'components/CreateCollaborationModal';
import { GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD, GET_POD_ROLES_WITH_TOKEN_GATE } from 'graphql/queries';
import useCanManage from 'hooks/useCanManage';
import { pickBy } from 'lodash';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useBoards } from 'utils/hooks';
import { CreateButton } from './styles';

const useBackHref = ({ router }) => {
  const query = pickBy(router.query, (_v, key) => key !== 'collabs');
  const href = {
    pathname: router.pathname,
    query,
  };
  return href;
};

const CollabsSidebar = () => {
  const router = useRouter();
  const { board } = useBoards();
  const { orgRoles, podRoles } = board.userPermissionsContext || {};
  const userRole = { ...orgRoles, ...podRoles }[board.orgId || board.podId];
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const href = useBackHref({ router });

  const handleCreateModal = () => setOpenCreateModal((prevState) => !prevState);

  return (
    <>
      <CreateCollaborationModal open={openCreateModal} onCancel={handleCreateModal} defaultOrgId={board?.orgId} />

      <BackButton href={href} />
      <SectionWrapper>
        <ListWrapper>
          <ListWrapper>
            <Label>DAO2DAO Collabs</Label>
          </ListWrapper>
          <CreateButton roundedBg onClick={handleCreateModal}>
            <AddIconWrapper /> Create collab
          </CreateButton>

          <ListWrapper>
            <Label>Pending requests</Label>
          </ListWrapper>
        </ListWrapper>
      </SectionWrapper>
    </>
  );
};

export default CollabsSidebar;
