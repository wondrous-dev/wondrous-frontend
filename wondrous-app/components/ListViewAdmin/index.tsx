import { useState, useEffect } from 'react';
import Accordion from 'components/Common/ListViewAccordion';
import ColumnEntry from './ColumnEntry';
import {
  ADMIN_COLUMNS_TYPES,
  TASK_STATUS_SUBMISSION_REQUEST,
  TASK_STATUS_PROPOSAL_REQUEST,
  MEMBERSHIP_REQUESTS,
} from 'utils/constants';
import { InReviewIcon, MembershipRequestIcon, ProposalsRemainingIcon } from 'components/Icons/statusIcons';
import { useUserBoard } from 'utils/hooks';
import TaskViewModal from 'components/Common/TaskViewModal';
import { useLocation } from 'utils/useLocation';
import { useRouter } from 'next/router';
import { delQuery, insertUrlParam } from 'utils';
import { useMe } from 'components/Auth/withAuth';
interface ColumnItem {
  type: string;
  items: Array<any>;
  hasMore: boolean;
}

interface Props {
  columns: ColumnItem[];
  onLoadMore: (type?: string) => any;
}

let windowOffset;
const ICON_MAP = {
  [TASK_STATUS_SUBMISSION_REQUEST]: InReviewIcon,
  [TASK_STATUS_PROPOSAL_REQUEST]: ProposalsRemainingIcon,
  [MEMBERSHIP_REQUESTS]: MembershipRequestIcon,
};

const COUNTS_MAP = {
  [TASK_STATUS_SUBMISSION_REQUEST]: 'submissionRequestCount',
  [TASK_STATUS_PROPOSAL_REQUEST]: 'proposalRequestCount',
  [MEMBERSHIP_REQUESTS]: 'membershipRequestCount',
};

function ListViewAdmin({ columns, onLoadMore }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const router = useRouter();
  const board = useUserBoard();
  const user = useMe();

  const { adminWorkflowCount } = board;

  useEffect(() => {
    const { params } = location;
    if (params.task || params.taskProposal) {
      setIsModalOpen(true);
    }
  }, [location]);

  const generateCount = (type) => {
    if (type && adminWorkflowCount) {
      const countType = COUNTS_MAP[type];

      return type === MEMBERSHIP_REQUESTS
        ? adminWorkflowCount?.podMembershipRequestCount + adminWorkflowCount?.orgMembershipRequestCount
        : adminWorkflowCount[countType];
    }
    return 0;
  };

  const handleClose = () => {
    const style = document.body.getAttribute('style');
    const top = style.match(/(?<=top: -)(.*?)(?=px)/);
    document.body.setAttribute('style', '');
    if (top?.length > 0) {
      window?.scrollTo(0, Number(top[0]));
    }
    let newUrl = `${delQuery(router.asPath)}?view=admin`;
    location.push(newUrl);
    setIsModalOpen(false);
  };
  const selectTask = (id, type) => {
    if (type !== MEMBERSHIP_REQUESTS) {
      const isTaskProposal = type === TASK_STATUS_PROPOSAL_REQUEST;
      const taskType = isTaskProposal ? 'taskProposal' : 'task';
      insertUrlParam(taskType, id);
      // setSelectedTask({ id, isTaskProposal });
      const newUrl = `${delQuery(router.asPath)}?${taskType}=${id}&view?=admin`;
      location.push(newUrl);
      windowOffset = window.scrollY;
      document.body.setAttribute('style', `position: fixed; top: -${windowOffset}px; left:0; right:0`);
    }
  };

  console.log(columns);
  return (
    <>
      <TaskViewModal
        disableEnforceFocus
        open={isModalOpen}
        shouldFocusAfterRender={false}
        handleClose={handleClose}
        taskId={(location?.params?.task || location?.params?.taskProposal)?.toString()}
        isTaskProposal={!!location?.params?.taskProposal}
      />
      {columns.map((column, colIdx) => {
        if (!column || !user) return null;
        const title = ADMIN_COLUMNS_TYPES[column.type];
        const Icon = ICON_MAP[column.type];
        const count = generateCount(column.type);

        return (
          <Accordion
            isExpanded={column?.items?.length > 0}
            key={colIdx}
            title={title}
            count={count}
            Icon={Icon}
            headerAddons={null}
            displayShowMore={column.hasMore}
            onShowMore={() => onLoadMore(column.type)}
          >
            {column?.items.map((item, idx) => {
              return (
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
                  orgId={item.orgId}
                  userPermissionsContext={board?.userPermissionsContext}
                  creatorProfilePicture={item.creatorProfilePicture}
                  creatorUsername={item.creatorUsername}
                  message={item.message}
                  title={item.title}
                  commentCount={item.commentCount}
                  taskId={item.taskId}
                  selectTask={selectTask}
                  status={item.status}
                  userId={item?.userId}
                />
              );
            })}
          </Accordion>
        );
      })}
    </>
  );
}

export default ListViewAdmin;
