import { useLazyQuery } from '@apollo/client';
import { ColumnsContext } from 'utils/contexts';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GET_USER_ABOUT_PAGE_DATA } from 'graphql/queries';
import { delQuery } from 'utils';
import { TaskViewModal } from '../Task/modal';
import {
  UserAboutInfoBlock,
  UserAboutInfoBlockContent,
  UserAboutInfoBlockHeader,
  UserAboutInfoBlockHeaderCount,
  UserAboutInfoBlockHeaderCountText,
  UserAboutInfoBlockHeaderText,
  UserAboutInfoCompletedTasks,
  UserAboutInfoContainer,
} from './styles';
import AboutOrganizationsCard from './userAboutInfoOrganizationsCard';
import AboutPodsCard from './userAboutInfoPodsCard';
import { AboutInfoSeeAll } from './userAboutInfoSeeAllModal';
import { useLocation } from 'utils/useLocation';

const useGetUserAboutPage = (userId) => {
  const [getUserAboutPage, { data }] = useLazyQuery(GET_USER_ABOUT_PAGE_DATA);
  useEffect(() => {
    if (!data && userId) {
      getUserAboutPage({
        variables: {
          userId: userId,
        },
      });
    }
  }, [getUserAboutPage, userId, data]);
  return data?.getUserAboutPageData ?? {};
};

const pluralize = (str, count) => `${str}${count > 1 ? 's' : ''}`;

export const UserAboutInfo = (props) => {
  const router = useRouter();
  const location = useLocation();
  const { id } = props;
  const { orgs, pods, tasksCompleted, tasksCompletedCount = 0 } = useGetUserAboutPage(id);
  const userOrgsData = orgs?.map((org) => <AboutOrganizationsCard key={org.id} {...org} />);
  const userPodsData = pods?.map((pod) => <AboutPodsCard {...pod} key={pod.id} />);
  const userCompletedTasks = tasksCompleted?.map((task) => <UserAboutInfoCompletedTasks task={task} key={task.id} />);
  const orgCount = orgs?.length ?? 0;
  const podCount = pods?.length ?? 0;
  const userData = [
    {
      name: pluralize('DAO', orgCount),
      count: orgCount,
      data: userOrgsData,
    },
    {
      name: pluralize('Pod', podCount),
      count: podCount,
      data: userPodsData,
    },
    {
      name: `${pluralize('Task', tasksCompletedCount)} Completed`,
      count: tasksCompletedCount,
      data: userCompletedTasks,
    },
  ];
  return (
    <ColumnsContext.Provider value={{}}>
      <TaskViewModal
        disableEnforceFocus
        open={Boolean(location?.params?.task || location?.params.taskProposal)}
        shouldFocusAfterRender={false}
        handleClose={() => {
          const style = document.body.getAttribute('style');
          const top = style.match(/(?<=top: -)(.*?)(?=px)/);
          document.body.setAttribute('style', '');
          if (top?.length > 0) {
            window?.scrollTo(0, Number(top[0]));
          }
          location.push(`${delQuery(router.asPath)}`);
        }}
        taskId={String(location?.params?.task || location?.params.taskProposal)}
        isTaskProposal={!!location?.params.taskProposal}
      />

      <UserAboutInfoContainer>
        {userData
          .filter((i) => i.count > 0)
          .map(({ name, count, data }, i) => (
            <UserAboutInfoBlock key={i}>
              <UserAboutInfoBlockHeader>
                <UserAboutInfoBlockHeaderCountText>
                  <UserAboutInfoBlockHeaderCount>{count}</UserAboutInfoBlockHeaderCount>
                  <UserAboutInfoBlockHeaderText>{name}</UserAboutInfoBlockHeaderText>
                </UserAboutInfoBlockHeaderCountText>
                <AboutInfoSeeAll count={count} text={name}>
                  {data}
                </AboutInfoSeeAll>
              </UserAboutInfoBlockHeader>
              <UserAboutInfoBlockContent>{data?.slice(0, 5)}</UserAboutInfoBlockContent>
            </UserAboutInfoBlock>
          ))}
      </UserAboutInfoContainer>
    </ColumnsContext.Provider>
  );
};
