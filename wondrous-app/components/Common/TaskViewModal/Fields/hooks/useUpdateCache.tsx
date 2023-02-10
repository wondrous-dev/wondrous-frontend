import { useApolloClient } from '@apollo/client';
import { GrantCardFragment } from 'graphql/fragments/grant';
import { TaskCardFragment, TaskProposalCardFragment, HomePageTaskCardFragment } from 'graphql/fragments/task';

const transformEntityData = (existingData, newData) => {
  const excludedFields = ['__typename', 'id'];
  const changedData = Object.keys(existingData).reduce((acc, next) => {
    if (existingData[next] !== newData[next] && !excludedFields.includes(next) && newData[next] !== undefined) {
      acc[next] = newData[next];
    }
    return acc;
  }, {});
  return {
    ...existingData,
    ...changedData,
  };
};

export const useUpdateTaskCardCache = (
  fragment = TaskCardFragment,
  fragmentName = 'TaskCardFragment',
  idLabel = 'TaskCard'
) => {
  const client = useApolloClient();
  const handleUpdateTaskCardCache = ({ data }) => {
    const { id } = data;
    const currentData = client.readFragment({
      fragment,
      fragmentName,
      id: `${idLabel}:${id}`,
    });

    if (!currentData) return;

    const newData = transformEntityData(currentData, data);

    client.writeFragment({
      fragment,
      fragmentName,
      id: `${idLabel}:${id}`,
      data: newData,
    });
  };
  return handleUpdateTaskCardCache;
};

export const useUpdateTaskHomepageCache = () =>
  useUpdateTaskCardCache(HomePageTaskCardFragment, 'HomePageTaskCardFragment', 'TaskCard');

export const useUpdateProposalCardCache = () =>
  useUpdateTaskCardCache(TaskProposalCardFragment, 'TaskProposalCardFragment', 'TaskProposalCard');

export const useUpdateGrantCardCache = () =>
  useUpdateTaskCardCache(GrantCardFragment, 'GrantCardFragment', 'GrantCard');
