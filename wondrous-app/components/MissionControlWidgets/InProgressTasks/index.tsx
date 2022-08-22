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
import {
  TaskContainer,
  TasksWrapper,
  TaskTitle,
  SearchIconContainer,
  OrgSearchWrapper,
  Autocomplete,
  Input,
} from './styles';

const limit = 5;

const DEFAULT_ORG_VALUE = { id: null, name: 'All orgs' };
const InProgressTasksWidget = () => {
  const globalContext = useGlobalContext();
  const { userOrgs } = globalContext;
  const user = useMe();

  const { data, fetchMore, loading, error, refetch } = useQuery(GET_USER_TASK_BOARD_TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    skip: !user?.id,
    variables: {
      limit,
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

  const handleOrgChange = (e, org) => refetch({ orgId: org?.id });

  // onInputChange={(event, searchString) => {
  //   handleInputChange(event, searchString);
  //   if (searchString === 'undefined') {
  //     setInputValue('');
  //   } else {
  //     setInputValue(searchString || '');
  //   }
  // }}

  return (
    <WidgetLayout title="In-Progress tasks">
      <TasksWrapper>
        {/* <OrgSearch options={options} onChange={handleOrgChange} /> */}
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
        {data?.getUserTaskBoardTasks?.map((task, idx) => (
          <TaskContainer key={idx}>
            <OrgProfilePicture profilePicture={task?.orgProfilePicture} />
            <TaskTitle>{task.title}</TaskTitle>
          </TaskContainer>
        ))}
      </TasksWrapper>
    </WidgetLayout>
  );
};

export default InProgressTasksWidget;
