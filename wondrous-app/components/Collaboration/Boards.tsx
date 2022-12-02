import React, { useRef, useState, useMemo, memo, Suspense } from 'react';

import BoardColumnsSkeleton from 'components/Dashboard/boards/BoardColumnsSkeleton';
import { ColumnsContext } from 'utils/contexts';
import Wrapper from 'components/organization/wrapper/wrapper';
import { BOARDS_MAP, Props } from 'components/organization/boards/boards';
import AddTeamMembers from 'components/CreateCollaborationModal/Steps/AddTeamMembers';
import { Modal as ModalComponent } from 'components/Modal';
import { useGlobalContext, useSteps } from 'utils/hooks';
import { PERMISSIONS } from 'utils/constants';
import { useMutation } from '@apollo/client';
import { BATCH_ADD_MEMBERS } from 'graphql/mutations';
import AddMembersConfirmation from 'components/CreateCollaborationModal/Steps/Confirmation';
import { useRouter } from 'next/router';
import { getFilterSchema } from 'utils/board';
import { insertUrlParam } from 'utils/index';
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
  const router = useRouter();
  const [openInviteModal, setOpenInviteModal] = useState(!!router?.query?.addMembers);
  const { step, setStep } = useSteps();
  const filterSchema = getFilterSchema(entityType, orgData?.id);
  const ActiveBoard = BOARDS_MAP[entityType];
  const { userPermissionsContext } = useGlobalContext();
  const footerRef = useRef();
  const footerLeftRef = useRef();
  const [users, setUsers] = useState({ admins: [], members: [], adminRole: null, memberRole: null });

  const handleModal = () => {
    if (router.query.addMembers) {
      const query: any = { ...router.query, addMembers: '' };

      router.push({ query }, undefined, { shallow: true, scroll: false });
    }

    setOpenInviteModal((prevState) => !prevState);
    setStep(0);
    setUsers({ admins: [], members: [], adminRole: null, memberRole: null });
  };

  const [batchAddUsers] = useMutation(BATCH_ADD_MEMBERS, {
    refetchQueries: ['getOrgFromUsername'],
    onCompleted: () => handleModal(),
  });

  const userOrgsWithFullAccess =
    userPermissionsContext?.orgPermissions &&
    Object.keys(userPermissionsContext?.orgPermissions).filter(
      (org) =>
        (userPermissionsContext.orgPermissions[org].includes(PERMISSIONS.FULL_ACCESS) ||
          userPermissionsContext.orgPermissions[org].includes(PERMISSIONS.MANAGE_MEMBER)) &&
        orgData?.id !== org
    );

  const parentOrgsWithAccess = useMemo(
    () =>
      orgData?.parentOrgs?.reduce(
        (acc, org) => (userOrgsWithFullAccess?.includes(org?.id) ? acc.concat(org.id) : acc),
        []
      ),
    [orgData?.parentOrgs, userOrgsWithFullAccess]
  );

  const deleteMember = (userId) => {
    setUsers((prevState) => ({
      ...prevState,
      members: prevState.members.filter((user) => user.id !== userId),
    }));
  };

  const handleSubmit = (users) => {
    const adminUsersRoles = users.admins.map((user) => ({ userId: user.id, roleId: users.adminRole?.id }));
    const membersUserRoles = users.members.map((user) => ({ userId: user.id, roleId: users.memberRole?.id }));

    batchAddUsers({
      variables: {
        input: {
          orgId: orgData?.id,
          userRoles: adminUsersRoles.concat(membersUserRoles),
        },
      },
    });
  };

  const STEPS = [
    ({ selectedUsers, parentOrgsWithAccess, orgData }) => (
      <AddTeamMembers
        parentOrgIds={parentOrgsWithAccess}
        collabData={orgData}
        footerRef={footerRef}
        footerLeftRef={footerLeftRef}
        selectedUsers={selectedUsers}
        onCancel={handleModal}
        setUsers={setUsers}
        onSubmit={() => setStep((prevState) => prevState + 1)}
      />
    ),
    ({ selectedUsers }) => (
      <AddMembersConfirmation
        onSubmit={handleSubmit}
        onCancel={handleModal}
        footerRef={footerRef}
        collabDetails={orgData}
        selectedUsers={selectedUsers}
        parentOrgs={orgData?.parentOrgs}
        deleteMember={deleteMember}
      />
    ),
  ];

  const Component = useMemo(() => STEPS[step], [step]);

  return (
    <Wrapper
      orgData={orgData}
      onSearch={onSearch}
      filterSchema={filterSchema}
      onFilterChange={onFilterChange}
      statuses={statuses}
      podIds={podIds}
      isCollabWorkspace
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
          footerLeft={<div ref={footerLeftRef} />}
          open={openInviteModal}
          onClose={handleModal}
        >
          {!!orgData && (
            <Component parentOrgsWithAccess={parentOrgsWithAccess} selectedUsers={users} orgData={orgData} />
          )}
        </ModalComponent>
      )}
      <ColumnsContext.Provider value={{ columns, setColumns }}>
        {loading ? (
          <BoardColumnsSkeleton />
        ) : (
          <Suspense>
            <ActiveBoard
              activeView={typeof activeView !== 'string' ? activeView[0] : activeView}
              columns={columns}
              onLoadMore={onLoadMore}
              hasMore={hasMore}
              setColumns={setColumns}
              entityType={entityType}
            />
          </Suspense>
        )}
      </ColumnsContext.Provider>
    </Wrapper>
  );
}

export default memo(CollabBoard, (prevProps, nextProps) => {
  const areEqual =
    prevProps.columns === nextProps.columns &&
    prevProps.hasMore === nextProps.hasMore &&
    prevProps.orgData?.id === nextProps.orgData?.id &&
    prevProps.statuses === nextProps.statuses &&
    prevProps.podIds === nextProps.podIds &&
    prevProps.userId === nextProps.userId &&
    prevProps.entityType === nextProps.entityType &&
    prevProps.loading === nextProps.loading &&
    prevProps.isCollabWorkspace === nextProps.isCollabWorkspace &&
    prevProps.filterSchema === nextProps.filterSchema &&
    prevProps.userId === nextProps.filterSchema &&
    prevProps.activeView === nextProps.activeView;

  return areEqual;
});
