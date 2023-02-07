import { useApolloClient } from "@apollo/client";
import { TaskCardFragment } from "graphql/fragments/task";
import { transformTaskToTaskCard } from "utils/helpers";

export const useUpdateTaskCardCache = () => {
    const client = useApolloClient();
    const handleUpdateTaskCardCache = ({ data }) => {
      const { id } = data;
      const transformedTaskToTaskCard = transformTaskToTaskCard(data);
      client.writeFragment({
        fragment: TaskCardFragment,
        fragmentName: 'TaskCardFragment',
        id: `TaskCard:${id}`,
        data: transformedTaskToTaskCard,
      });
    };
    return handleUpdateTaskCardCache;
  };

// TODO same for grants & proposals