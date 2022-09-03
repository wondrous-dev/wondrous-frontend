import { useInView } from 'react-intersection-observer';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect, useCallback, useState, useContext } from 'react';
import { GET_TASK_APPLICATIONS } from 'graphql/queries/taskApplication';
import { APPROVE_TASK_APPLICATION, DECLINE_TASK_APPLICATION } from 'graphql/mutations/taskApplication';
import { TASK_APPLICATION_STATUS } from 'utils/constants';
import { CircularProgress } from '@mui/material';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import BoardFilters from 'components/Common/BoardFilters';
import { Approved, Rejected, PendingApplication } from 'components/Icons';
import { StatusDefaultIcon } from 'components/Icons/statusIcons';
import { hasGR15DEIIntiative } from 'components/Common/TaskViewModal/utils';
import ConfirmationModal from '../ConfirmationModal';
import { LoadMore, FiltersWrapper, SectionWrapper, ItemsWrapper, EmptyStateWrapper, EmptyStateText } from './styles';
import ApplicationCard from './ApplicationCard';
import TaskApplicationButton from '../TaskApplicationButton';

interface Props {
  task: any;
  count: number;
  canViewApplications: boolean;
  canApply: boolean;
  canClaim: boolean;
}

const MODAL_TYPES = {
  REJECT: 'reject',
  APPROVE: 'approve',
};

const LIMIT = 5;

const FILTER_SCHEMA = {
  name: 'status',
  label: 'Status',
  icon: ({ style, ...rest }) => <StatusDefaultIcon style={{ ...style, padding: '3px' }} {...rest} />,
  items: [
    {
      id: TASK_APPLICATION_STATUS.APPROVED,
      name: 'Approved applications',
      icon: <Approved />,
      pillIcon: Approved,
    },
    {
      id: TASK_APPLICATION_STATUS.PENDING,
      name: 'Pending applications',
      icon: <PendingApplication />,
      pillIcon: PendingApplication,
    },
    {
      id: TASK_APPLICATION_STATUS.REJECTED,
      name: 'Rejected applications',
      icon: <Rejected />,
      pillIcon: Rejected,
    },
  ],
};

const getEmptyStateContent = (task, canApply, count) => {
  if (task?.taskApplicationPermissions?.hasUserApplied && count > 0) {
    return <EmptyStateText>Please await admin response.</EmptyStateText>;
  }
  if (canApply) {
    return <TaskApplicationButton task={task} canApply={canApply} title="Apply to task" />;
  }
  return <EmptyStateText>You cannot apply to this task</EmptyStateText>;
};

function ApplicationsEmptyState({ task, canApply, count, canClaim }) {
  if (canClaim) return null;
  return <EmptyStateWrapper>{getEmptyStateContent(task, canApply, count)}</EmptyStateWrapper>;
}

export default function ApplicationList({ task, count, canViewApplications = true, canApply, canClaim }: Props) {
  const [activeApplication, setActiveApplication] = useState(null);
  const [status, setStatus] = useState(null);
  const [ref, inView] = useInView({});
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useContext(SnackbarAlertContext);

  const [getTaskApplications, { loading, error, data, fetchMore, variables }] = useLazyQuery(GET_TASK_APPLICATIONS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ getTaskApplications }) => getTaskApplications,
  });

  const hasMore = data?.getTaskApplications?.length < count && data?.getTaskApplications?.length >= LIMIT;

  const getTaskApplicationsFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        input: {
          ...variables.input,
          offset: data?.getTaskApplications.length,
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        const getTaskApplications = [...prev?.getTaskApplications, ...fetchMoreResult?.getTaskApplications];
        return {
          getTaskApplications,
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [data?.getTaskApplications, fetchMore, variables]);

  const [approveTaskApplication] = useMutation(APPROVE_TASK_APPLICATION, {
    onCompleted: () => {
      setSnackbarAlertMessage('Success! Application approved');
      setSnackbarAlertOpen(true);
      handleApplicationModalClose();
    },
    onError: (e) => {
      console.error(e);
    },
    refetchQueries: ['getTaskById', 'getOrgTaskBoardTasks', 'getPodTaskBoardTasks', 'getTaskApplications'],
  });

  const [declineTaskApplication] = useMutation(DECLINE_TASK_APPLICATION, {
    onCompleted: () => {
      setSnackbarAlertMessage('Success! Application rejected');
      setSnackbarAlertOpen(true);
      handleApplicationModalClose();
    },
    onError: (e) => {
      console.error(e);
    },
    refetchQueries: ['getTaskById', 'getOrgTaskBoardTasks', 'getPodTaskBoardTasks', 'getTaskApplications'],
  });

  useEffect(() => {
    if (inView && hasMore) {
      getTaskApplicationsFetchMore();
    }
  }, [inView, hasMore, getTaskApplicationsFetchMore]);

  useEffect(() => {
    if (count && canViewApplications) {
      getTaskApplications({
        variables: {
          input: {
            taskId: task?.id,
            limit: LIMIT,
            offset: 0,
            ...(status && { status }),
          },
        },
      });
    }
  }, [count, status, canViewApplications]);

  const handleApplicationModal = (application, modalType) => setActiveApplication({ application, modalType });

  const handleApplicationModalClose = () => setActiveApplication(null);

  const CONFIRMATION_MODAL_CONTENT = {
    [MODAL_TYPES.APPROVE]: {
      HEADER_TEXT: 'Accept application',
      BODY_TEXT: `This will set ${activeApplication?.application?.creator?.username} as the assignee. They will be notified and can make submissions`,
      CONFIRM_BUTTON_LABEL: 'Accept',
      action: () => {
        approveTaskApplication({
          variables: {
            id: activeApplication?.application?.id,
          },
        });
      },
    },
    [MODAL_TYPES.REJECT]: {
      HEADER_TEXT: 'Reject application',
      BODY_TEXT: `Are you sure you want to reject ${activeApplication?.application?.creator?.username}'s application?`,
      CONFIRM_BUTTON_LABEL: ' Reject',
      action: () => {
        declineTaskApplication({
          variables: {
            id: activeApplication?.application?.id,
          },
        });
      },
    },
  };

  const handleFilterChange = (values) => {
    const filterStatus = values?.status;
    if (filterStatus !== status) setStatus(filterStatus);
  };

  return (
    <SectionWrapper>
      {canViewApplications && count > 0 ? (
        <>
          <FiltersWrapper>
            <BoardFilters onChange={handleFilterChange} filterSchema={[FILTER_SCHEMA]} />
          </FiltersWrapper>
          {!!activeApplication && (
            <ConfirmationModal
              onClose={handleApplicationModalClose}
              bodyText={CONFIRMATION_MODAL_CONTENT[activeApplication?.modalType].BODY_TEXT}
              headerText={CONFIRMATION_MODAL_CONTENT[activeApplication?.modalType].HEADER_TEXT}
              confirmationButtonText={CONFIRMATION_MODAL_CONTENT[activeApplication?.modalType].CONFIRM_BUTTON_LABEL}
              onConfirm={CONFIRMATION_MODAL_CONTENT[activeApplication?.modalType].action}
            />
          )}
          <ItemsWrapper>
            {data?.getTaskApplications?.map((application, idx) => {
              const { creator, createdAt, links, message, status } = application;
              const showActions = application?.status === TASK_APPLICATION_STATUS.PENDING;
              return (
                <ApplicationCard
                  key={idx}
                  avatar={creator.profilePicture}
                  username={creator.username}
                  isGr15Contributor={
                    hasGR15DEIIntiative(task?.categories) && creator?.checkIsGr15Contributor?.isGr15Contributor
                  }
                  timestamp={createdAt}
                  status={status}
                  links={links}
                  onApprove={() => handleApplicationModal(application, MODAL_TYPES.APPROVE)}
                  showActions={showActions}
                  onReject={() => handleApplicationModal(application, MODAL_TYPES.REJECT)}
                  message={message}
                />
              );
            })}
            {loading && <CircularProgress />}
            {!!data?.getTaskApplications && hasMore && <LoadMore ref={ref} hasMore={hasMore} />}
          </ItemsWrapper>
        </>
      ) : (
        <ApplicationsEmptyState canClaim={canClaim} count={count} task={task} canApply={canApply} />
      )}
    </SectionWrapper>
  );
}
