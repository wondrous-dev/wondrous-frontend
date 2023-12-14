import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_QUEST_BY_ID } from "graphql/queries";
import ViewQuest from "components/ViewQuest";

const ViewQuestPage = () => {
  let { id, ...rest } = useParams();
  const [searchParams] = useSearchParams();
  const { data: { getQuestById } = {}, loading } = useQuery(GET_QUEST_BY_ID, {
    variables: {
      questId: id,
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      document.title = data?.getQuestById?.title;
    },
    skip: !id,
  });
  
  return <ViewQuest quest={getQuestById} loading={loading} />;
};

export default ViewQuestPage;
