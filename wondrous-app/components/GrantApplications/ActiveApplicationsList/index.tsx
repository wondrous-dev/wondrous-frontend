import { useQuery } from '@apollo/client';
import Grid from '@mui/material/Grid';
import { OrgComponent } from 'components/BreadCrumbs/Components/OrgSelector';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import { TaskSubtaskTitle } from 'components/Common/TaskSubtask/TaskSubtaskList/styles';
import { Spinner } from 'components/Dashboard/bounties/styles';
import { GrantsBoardCardDescription } from 'components/GrantsBoard/styles';
import PodIcon from 'components/Icons/podIcon';
import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import ContentPaste from 'components/Icons/Sidebar/contentPaste.svg';
import FlagIcon from 'components/Icons/Sidebar/flag.svg';
import StartIcon from 'components/Icons/Sidebar/star.svg';
import { GET_ACTIVE_GRANT_APPLICATION_PODS, GET_TASKS_PER_TYPE_FOR_POD } from 'graphql/queries';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { LIMIT } from 'services/board';
import { useTaskContext } from 'utils/hooks';

import { Typography } from '@mui/material';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import { UnstyledLink } from 'components/WorkspacePicker/styles';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { ENTITIES_TYPES } from 'utils/constants';
import TaskCardPrivacy from 'components/Common/TaskCardPrivacy';
import { GrantPaymentData } from 'components/ViewGrant/Fields';
import { Card, StatItemWrapper } from './styles';

const PodStats = ({ stats, podId }) => {
  const link = `/pod/${podId}`;
  const CONFIG = [
    {
      Icon: CheckBoxIcon,
      link: `${link}/boards?entity=${ENTITIES_TYPES.TASK}`,
      count: stats?.taskCount,
    },
    {
      Icon: StartIcon,
      link: `${link}/boards?entity=${ENTITIES_TYPES.BOUNTY}`,
      count: stats?.bountyCount,
    },
    {
      Icon: FlagIcon,
      count: stats?.milestoneCount,
      link: `${link}/boards?entity=${ENTITIES_TYPES.MILESTONE}`,
    },
    {
      Icon: ContentPaste,
      count: stats?.proposalCount,
      link: `${link}/boards?entity=${ENTITIES_TYPES.PROPOSAL}`,
    },
  ];
  return (
    <Grid display="flex" gap="24px">
      {CONFIG.map(({ Icon, count, link }, idx) => (
        <UnstyledLink href={link} idx={idx}>
          <StatItemWrapper key={link} display="flex" justifyContent="center" alignItems="center" gap="6px">
            <ItemButtonIcon hoverColor={palette.highlightPurple}>
              <Icon />
            </ItemButtonIcon>
            <Typography fontFamily={typography.fontFamily} fontWeight={500} fontSize="13px" color={palette.grey250}>
              {count}
            </Typography>
          </StatItemWrapper>
        </UnstyledLink>
      ))}
    </Grid>
  );
};
const ActiveApplicationItem = ({ workspace }) => {
  const { data } = useQuery(GET_TASKS_PER_TYPE_FOR_POD, {
    variables: {
      podId: workspace?.id,
    },
    fetchPolicy: 'cache-and-network',
    skip: !workspace?.id,
  });

  return (
    <Card gap="14px" display="flex" direction="column">
      <Grid display="flex" alignItems="center" justifyContent="space-between">
        <Grid display="flex" gap="6px">
          <OrgComponent
            username={workspace?.org?.username}
            profilePicture={workspace?.org?.profilePicture}
            style={{
              height: '28px',
              width: '28px',
            }}
          />
          <UnstyledLink href={`/pod/${workspace?.id}/home`}>
            <PodIcon
              color={workspace?.color}
              style={{
                width: 28,
                height: 28,
                borderRadius: 50,
              }}
            />
          </UnstyledLink>
          <TaskCardPrivacy privacyLevel={workspace?.privacyLevel} />
        </Grid>
        <Grid>
          {workspace?.paymentData?.map((paymentData, idx) => (
            <GrantPaymentData
              paymentData={paymentData}
              key={`${paymentData?.paymentMethodId} + ${paymentData?.amount}`}
            />
          ))}
        </Grid>
      </Grid>
      <TaskSubtaskTitle sx={{ marginTop: '0 !important' }}>{workspace?.name}</TaskSubtaskTitle>
      <GrantsBoardCardDescription>{workspace?.description}</GrantsBoardCardDescription>
      <PodStats podId={workspace?.id} stats={data?.getPerTypeTaskCountForPodBoard} />
    </Card>
  );
};

const ActiveApplicationsList = () => {
  const { grant } = useTaskContext();
  const [hasMore, setHasMore] = useState(true);
  const [ref, inView] = useInView({});

  const {
    data: activeGrantApplicationPods,
    loading,
    fetchMore,
  } = useQuery(GET_ACTIVE_GRANT_APPLICATION_PODS, {
    variables: {
      grantId: grant.id,
      limit: LIMIT,
      offset: 0,
    },
    fetchPolicy: 'cache-and-network',
    skip: !grant?.id,
  });

  useEffect(() => {
    if (inView && hasMore && !loading && activeGrantApplicationPods?.getActiveGrantApplicationPods?.length >= LIMIT) {
      fetchMore({
        variables: {
          offset: activeGrantApplicationPods?.getActiveGrantApplicationPods?.length,
        },
      }).then(({ data }) => setHasMore(data?.getActiveGrantApplicationPods?.length >= LIMIT));
    }
  }, [inView, hasMore, activeGrantApplicationPods]);

  return (
    <Grid display="flex" direction="column">
      <Grid display="flex" direction="column" gap="18px">
        {activeGrantApplicationPods?.getActiveGrantApplicationPods?.map((workspace) => (
          <ActiveApplicationItem workspace={workspace} key={workspace?.id} />
        ))}
        {loading ? <Spinner /> : null}
      </Grid>
      <LoadMore ref={ref} hasMore={hasMore} />
    </Grid>
  );
};

export default ActiveApplicationsList;
