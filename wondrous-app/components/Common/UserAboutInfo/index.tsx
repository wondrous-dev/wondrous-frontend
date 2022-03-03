import { useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { GET_USER_ABOUT_PAGE_DATA } from '../../../graphql/queries';
import UserAboutInfoCompletedCard from './userAboutInfoCompletedCard';
import { AboutInfoSeeAll } from './userAboutInfoSeeAllModal';
import AboutOrganizationsCard from './userAboutInfoOrganizationsCard';
import AboutPodsCard from './userAboutInfoPodsCard';
import {
  UserAboutInfoBlock,
  UserAboutInfoBlockContent,
  UserAboutInfoBlockHeader,
  UserAboutInfoBlockHeaderCount,
  UserAboutInfoBlockHeaderCountText,
  UserAboutInfoBlockHeaderText,
  UserAboutInfoContainer,
} from './styles';

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
  const { id } = props;
  const { orgs, pods, tasksCompleted, tasksCompletedCount = 0 } = useGetUserAboutPage(id);
  const userOrgsData = orgs?.map((org) => <AboutOrganizationsCard key={org.id} {...org} />);
  const userPodsData = pods?.map((pod) => <AboutPodsCard {...pod} key={pod.id} />);
  const userCompletedTasks = tasksCompleted?.map((task) => <UserAboutInfoCompletedCard {...task} key={task.id} />);
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
  );
};
