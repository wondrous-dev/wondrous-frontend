import {GET_PREVIEW_FILE, GET_TASK_BY_ID} from "graphql/queries";
import {GET_TASK_PROPOSAL_BY_ID} from "graphql/queries/taskProposal";
import apollo from "services/apollo";

// eslint-disable-next-line import/prefer-default-export
export const getServerSideProps = async (context) => {
  if (context.query?.task || context.query?.taskProposal) {
    try {
      const meta = {
        title: '',
        description: '',
        img: '',
      };

      let task;

      if (context.query?.taskProposal) {
        const { data } = await apollo.query({
          query: GET_TASK_PROPOSAL_BY_ID,
          variables: { proposalId: context.query?.taskProposal },
        });

        task = data.getTaskProposalById;
      } else {
        const { data } = await apollo.query({
          query: GET_TASK_BY_ID,
          variables: { taskId: context.query.task },
        });

        task = data.getTaskById;
      }

      if (!task) {
        return { props: {} };
      }

      meta.title = task.title;
      meta.description = JSON.parse(task.description)[0]?.children[0]?.text;

      if (task?.media.length) {
        const [media] = task.media;
        const mediaSlug = media?.slug || media?.uploadSlug;
        const previewFileData = await apollo.query({
          query: GET_PREVIEW_FILE,
          variables: { path: mediaSlug },
        });

        meta.img = previewFileData.data.getPreviewFile.url;
      }

      return { props: { meta } };
    } catch (error) {
      console.error(error);
    }
  }

  return { props: {} };
};
