import { useQuery } from '@apollo/client';
import WidgetLayout from 'components/MissionControlWidgets/WidgetLayout';
import { GET_USER_TASK_BOARD_TASKS } from 'graphql/queries';
import { useGlobalContext } from 'utils/hooks';
import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import { useMe } from 'components/Auth/withAuth';
import { TASK_STATUS_IN_PROGRESS } from 'utils/constants';
import SearchIcon from 'components/Icons/search';
import {
  PodSearchAutocompletePopper,
  PodSearchList,
  PodSearchPaper,
} from 'components/CreateEntity/CreateEntityModal/PodSearch/styles';
import { LIMIT } from 'services/board';
import TaskViewModal from 'components/Common/TaskViewModal';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';
import { useLocation } from 'utils/useLocation';
import { useEffect, useState } from 'react';
import { delQuery } from 'utils';
import { LoadMore } from 'components/SearchTasks/styles';
import {
  TaskContainer,
  TasksWrapper,
  TaskTitle,
  SearchIconContainer,
  OrgSearchWrapper,
  Autocomplete,
  Input,
  EmptyStateText,
  TasksContainer,
} from './styles';

const DEFAULT_ORG_VALUE = { id: null, name: 'All orgs' };
const InProgressTasksWidget = () => {
  const globalContext = useGlobalContext();
  const { userOrgs } = globalContext;
  const user = useMe();

  const {
    data,
    loading,
    refetch,
    fetchMore: fetchMoreTasks,
  } = useQuery(GET_USER_TASK_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    skip: !user?.id,
    variables: {
      limit: LIMIT,
      offset: 0,
      userId: user?.id,
      statuses: [TASK_STATUS_IN_PROGRESS],
      orgId: null,
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const options = userOrgs?.getUserOrgs;

  const handleOrgChange = (e, org) => {
    refetch({ orgId: org?.id }).then((response) => setHasMore(response?.data?.getUserTaskBoardTasks?.length >= LIMIT));
  };

  const router = useRouter();
  const [ref, inView] = useInView({ initialInView: true });
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchMore = () => {
    fetchMoreTasks({ variables: { offset: data?.getUserTaskBoardTasks?.length, limit: LIMIT } }).then((response) => {
      setHasMore(response?.data?.getUserTaskBoardTasks?.length >= LIMIT);
    });
  };

  useEffect(() => {
    if (inView && hasMore && data?.getUserTaskBoardTasks?.length >= LIMIT) {
      fetchMore();
    }
  }, [inView, hasMore, data?.getUserTaskBoardTasks?.length]);

  const handleCardClick = (task, query = '') => {
    const newUrl = `${delQuery(router.asPath)}?task=${task?.id}${query}`;
    location.push(newUrl);
    document.body.setAttribute('style', `position: fixed; top: -${window.scrollY}px; left:0; right:0`);
  };

  useEffect(() => {
    const { params } = location;
    if (params.task || params.taskProposal) {
      setOpenModal(true);
    }
  }, [location]);

  const handleModalClose = () => {
    const style = document.body.getAttribute('style');
    const top = style.match(/(top: -)(.*?)(?=px)/);
    document.body.setAttribute('style', '');
    if (top?.length > 0) {
      window.scrollTo(0, Number(top[2]));
    }
    const newUrl = `${delQuery(router.asPath)}`;
    location.push(newUrl);
    setOpenModal(false);
  };

  return (
    <WidgetLayout title="In-Progress tasks">
      <TaskViewModal
        disableEnforceFocus
        open={openModal}
        shouldFocusAfterRender={false}
        handleClose={handleModalClose}
        taskId={(location?.params?.task || location?.params?.taskProposal)?.toString()}
        isTaskProposal={!!location?.params?.taskProposal}
      />
      <TasksWrapper>
        {!!userOrgs && (
          <OrgSearchWrapper>
            <SearchIconContainer>
              <SearchIcon />
            </SearchIconContainer>
            <Autocomplete
              options={[DEFAULT_ORG_VALUE, ...options]}
              getOptionLabel={(option) => option.name}
              defaultValue={DEFAULT_ORG_VALUE}
              onChange={handleOrgChange}
              clearOnBlur={false}
              PaperComponent={PodSearchPaper}
              keepMounted
              ListboxComponent={PodSearchList}
              PopperComponent={(params) => <PodSearchAutocompletePopper {...params} keepMounted />}
              renderInput={(params) => <Input {...params} fullWidth />}
              renderOption={(props, org) => (
                <TaskContainer {...props}>
                  {org?.profilePicture ? <OrgProfilePicture profilePicture={org?.profilePicture} /> : null}
                  <TaskTitle>{org.name}</TaskTitle>
                </TaskContainer>
              )}
            />
          </OrgSearchWrapper>
        )}
        {!data?.getUserTaskBoardTasks?.length && !loading && (
          <EmptyStateText>Once you mark tasks as in-progress, they will appear here.</EmptyStateText>
        )}

        <TasksContainer>
          {data?.getUserTaskBoardTasks?.map((task, idx) => (
            <TaskContainer key={idx} onClick={() => handleCardClick(task)}>
              <OrgProfilePicture profilePicture={task?.orgProfilePicture} />
              <TaskTitle>{task.title}</TaskTitle>
            </TaskContainer>
          ))}
          <LoadMore
            style={{
              height: '20px',
            }}
            hasMore
            ref={ref}
          />
        </TasksContainer>
      </TasksWrapper>
    </WidgetLayout>
  );
};

export default InProgressTasksWidget;
