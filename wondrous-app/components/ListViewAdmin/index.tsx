import { useState, useEffect } from 'react';
import Accordion from 'components/Common/ListViewAccordion';
import {
  ADMIN_COLUMNS_TYPES,
  TASK_STATUS_SUBMISSION_REQUEST,
  TASK_STATUS_PROPOSAL_REQUEST,
  ORG_MEMBERSHIP_REQUESTS,
  POD_MEMBERSHIP_REQUESTS,
} from 'utils/constants';
import { InReviewIcon, MembershipRequestIcon, ProposalsRemainingIcon } from 'components/Icons/statusIcons';
import { useGlobalContext, useUserBoard } from 'utils/hooks';
import { useRouter } from 'next/router';
import { useMe } from 'components/Auth/withAuth';
import { EmptyMemberRequestsListMessage } from 'components/organization/members/styles';
import { Spinner } from 'components/Dashboard/bounties/styles';
import KudosForm from 'components/Common/KudosForm';
import ColumnEntry from './ColumnEntry';

interface ColumnItem {
  type: string;
  items: Array<any>;
  hasMore: boolean;
  loading: boolean;
  handleFetchMore: () => any;
}

interface Props {
  column: ColumnItem;
}

let windowOffset;
const ICON_MAP = {
  [TASK_STATUS_SUBMISSION_REQUEST]: InReviewIcon,
  [TASK_STATUS_PROPOSAL_REQUEST]: ProposalsRemainingIcon,
  [ORG_MEMBERSHIP_REQUESTS]: MembershipRequestIcon,
  [POD_MEMBERSHIP_REQUESTS]: MembershipRequestIcon,
};

const COUNTS_MAP = {
  [TASK_STATUS_SUBMISSION_REQUEST]: 'submissionRequestCount',
  [TASK_STATUS_PROPOSAL_REQUEST]: 'proposalRequestCount',
  [ORG_MEMBERSHIP_REQUESTS]: 'orgMembershipRequestCount',
  [POD_MEMBERSHIP_REQUESTS]: 'podMembershipRequestCount',
};

function ListViewAdmin({ column }: Props) {
  const [kudosFormData, setKudosFormData] = useState(null);
  const router = useRouter();
  const board = useUserBoard();
  const user = useMe();
  const globalContext = useGlobalContext();

  const { adminWorkflowCount } = board;

  const generateCount = (type) => {
    if (type && adminWorkflowCount) {
      const countType = COUNTS_MAP[type];

      return adminWorkflowCount[countType];
    }
    return 0;
  };

  const selectTask = (id, type) => {
    if (![ORG_MEMBERSHIP_REQUESTS, POD_MEMBERSHIP_REQUESTS].includes(type)) {
      const isTaskProposal = type === TASK_STATUS_PROPOSAL_REQUEST;
      const taskType = isTaskProposal ? 'taskProposal' : 'task';

      const query = {
        ...router.query,
        [taskType]: id,
      };

      router.push({ query }, undefined, { scroll: false, shallow: true });
    }
  };
  if (!column || !user) return null;
  const title = ADMIN_COLUMNS_TYPES[column.type];
  const Icon = ICON_MAP[column.type];
  const count = generateCount(column.type);

  const handleKudosFormOnClose = () => setKudosFormData(null);

  return (
    <>
      <KudosForm
        onClose={handleKudosFormOnClose}
        open={!!kudosFormData}
        submission={{
          id: kudosFormData?.id,
          podId: kudosFormData?.podId,
          orgId: kudosFormData?.orgId,
          createdBy: kudosFormData?.createdBy,
        }}
      />

      {column?.items?.length ? (
        <Accordion
          isExpanded={column?.items?.length > 0}
          loading={column.loading}
          title={title}
          count={count}
          Icon={Icon}
          headerAddons={null}
          hasMore={column.hasMore}
          enableInfiniteLoading
          onShowMore={column.handleFetchMore}
        >
          {column?.items?.map((item, idx) => (
            <ColumnEntry
              key={idx + item.id}
              type={column.type}
              userProfilePicture={item.userProfilePicture}
              orgUsername={item.orgUsername}
              orgProfilePicture={item.orgProfilePicture}
              podColor={item.podColor}
              podId={item.podId}
              podName={item.podName}
              userUsername={item.userUsername}
              id={item.id}
              roleId={item.roleId}
              roleName={item.roleName}
              createdBy={item.createdBy}
              orgId={item.orgId}
              userPermissionsContext={globalContext?.userPermissionsContext}
              creatorProfilePicture={item.creatorProfilePicture}
              creatorUsername={item.creatorUsername}
              message={item.message}
              title={item.title}
              commentCount={item.commentCount}
              taskId={item.taskId}
              selectTask={selectTask}
              status={item.status}
              userId={item?.userId}
              taskDueDate={item?.taskDueDate}
              rewards={item.rewards}
              links={item.links}
              media={item.media}
              taskStatus={item.taskStatus}
              setKudosFormData={setKudosFormData}
              isGr15Contributor={item?.checkIsGr15Contributor?.isGr15Contributor}
            />
          ))}
        </Accordion>
      ) : (
        <>
          {column.loading ? (
            <Spinner />
          ) : (
            <EmptyMemberRequestsListMessage>
              There is nothing here. Come back later to see more.
            </EmptyMemberRequestsListMessage>
          )}
        </>
      )}
    </>
  );
}

export default ListViewAdmin;
