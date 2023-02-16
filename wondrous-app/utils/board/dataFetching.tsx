import apollo from 'services/apollo';
import {
  GET_TASK_BY_ID,
  GET_TASK_PROPOSAL_BY_ID,
  GET_PREVIEW_FILE,
  GET_GRANT_BY_ID,
  GET_GRANT_APPLICATION_BY_ID,
} from 'graphql/queries';

// eslint-disable-next-line import/prefer-default-export
export const getServerSideProps = async (context) => {
  if (context.query?.task || context.query?.taskProposal || context.query?.grant || context.query?.grantApplicationId) {
    try {
      const meta = {
        title: '',
        description: '',
        img: '',
      };

      let entity;

      if (context.query?.taskProposal) {
        const { data } = await apollo.query({
          query: GET_TASK_PROPOSAL_BY_ID,
          variables: { proposalId: context.query?.taskProposal },
        });

        entity = data.getTaskProposalById;
      }
      if (context.query?.task) {
        const { data } = await apollo.query({
          query: GET_TASK_BY_ID,
          variables: { taskId: context.query.task },
        });

        entity = data.getTaskById;
      }

      if (context.query?.grant && !context.query?.grantApplicationId) {
        const { data } = await apollo.query({
          query: GET_GRANT_BY_ID,
          variables: { grantId: context.query.grant },
        });

        entity = data.getGrantById;
      }

      if (context.query?.grantApplicationId) {
        const { data } = await apollo.query({
          query: GET_GRANT_APPLICATION_BY_ID,
          variables: { grantApplicationId: context.query.grantApplicationId },
        });
        entity = data.getGrantApplicationById;
      }
      if (!entity) {
        return { props: {} };
      }

      meta.title = entity.title;
      meta.description = JSON.parse(entity.description)[0]?.children[0]?.text;

      if (entity?.media.length) {
        const [media] = entity.media;
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
