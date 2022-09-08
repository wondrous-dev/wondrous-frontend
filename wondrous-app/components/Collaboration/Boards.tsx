import React, { useRef, useState, useEffect, useMemo } from 'react';

import { ColumnsContext } from 'utils/contexts';
import Wrapper from 'components/organization/wrapper/wrapper';
import { BOARDS_MAP, Props, getFilterSchema } from 'components/organization/boards/boards';
import AddTeamMembers from 'components/CreateCollaborationModal/Steps/AddTeamMembers';
import { Modal as ModalComponent } from 'components/Modal';
import { useGlobalContext } from 'utils/hooks';
import { PERMISSIONS } from 'utils/constants';
import { useLazyQuery } from '@apollo/client';
import { GET_ORG_USERS } from 'graphql/queries';
import SharedOrgHeader from './SharedOrgHeader';

function CollabBoard(props: Props) {
  const {
    columns,
    onLoadMore,
    hasMore,
    orgData,
    onSearch,
    onFilterChange,
    statuses,
    podIds,
    setColumns,
    userId,
    entityType,
    loading,
    activeView,
  } = props;

  const [openInviteModal, setOpenInviteModal] = useState(false);
  const filterSchema = getFilterSchema(entityType, orgData?.id);
  const ActiveBoard = BOARDS_MAP[entityType];
  const { userPermissionsContext } = useGlobalContext();
  const footerRef = useRef();
  const [users, setUsers] = useState({ admins: [], members: [] });
  const [getUsers, { data }] = useLazyQuery(GET_ORG_USERS);
  const handleModal = () => setOpenInviteModal((prevState) => !prevState);

  const userOrgsWithFullAccess =
    userPermissionsContext?.orgPermissions &&
    Object.keys(userPermissionsContext?.orgPermissions).filter(
      (org) =>
        (userPermissionsContext.orgPermissions[org].includes(PERMISSIONS.FULL_ACCESS) ||
          userPermissionsContext.orgPermissions[org].includes(PERMISSIONS.MANAGE_MEMBER)) &&
        orgData?.id !== org
    );

  const parentOrg = orgData?.parentOrgs.find((org) => userOrgsWithFullAccess.includes(org.id));

  useEffect(() => {
    if (openInviteModal && orgData?.id && !users.admins.length)
      getUsers({
        variables: {
          orgId: orgData?.id,
          limit: 100,
        },
      });
  }, [openInviteModal]);

  const existingUsersIds = useMemo(() => data?.getOrgUsers.map((orgUser) => orgUser.user.id), [data?.getOrgUsers]);

  return (
    <Wrapper
      orgData={orgData}
      onSearch={onSearch}
      filterSchema={filterSchema}
      onFilterChange={onFilterChange}
      statuses={statuses}
      podIds={podIds}
      userId={userId}
      inviteButtonSettings={{
        label: 'Add members',
        inviteAction: handleModal,
      }}
      renderSharedHeader={(props) => <SharedOrgHeader {...props} />}
    >
      {openInviteModal && (
        <ModalComponent
          maxWidth={560}
          title="Add members"
          footerRight={<div ref={footerRef} />}
          open={openInviteModal}
          onClose={handleModal}
        >
          <AddTeamMembers
            org={parentOrg}
            footerRef={footerRef}
            onCancel={handleModal}
            selectedUsers={users}
            existingUsersIds={existingUsersIds}
            setUsers={setUsers}
            onSubmit={({ users }) => {
              console.log(users);
              // setData({ ...data, users });
              // setStep(3);
            }}
          />
        </ModalComponent>
      )}
      <ColumnsContext.Provider value={{ columns, setColumns }}>
        {!loading && (
          <ActiveBoard
            activeView={typeof activeView !== 'string' ? activeView[0] : activeView}
            columns={columns}
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            setColumns={setColumns}
            entityType={entityType}
          />
        )}
      </ColumnsContext.Provider>
    </Wrapper>
  );
}

export default CollabBoard;
