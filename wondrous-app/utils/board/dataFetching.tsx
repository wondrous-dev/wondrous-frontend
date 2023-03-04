import apollo from 'services/apollo';
import {
  GET_TASK_BY_ID,
  GET_TASK_PROPOSAL_BY_ID,
  GET_PREVIEW_FILE,
  GET_GRANT_BY_ID,
  GET_GRANT_APPLICATION_BY_ID,
  GET_MILESTONE_BY_ID,
} from 'graphql/queries';
import { capitalize } from 'utils/common';
import { ENTITIES_TYPES } from 'utils/constants';

// eslint-disable-next-line import/prefer-default-export
export const getServerSideProps = async (context) => {
  if (
    context.query?.task ||
    context.query?.taskProposal ||
    context.query?.grant ||
    context.query?.grantApplicationId ||
    context.query?.milestone
  ) {
    try {
      const meta = {
        title: '',
        description: '',
        img: '',
      };

      let entityType = '';
      let entity;

      if (context.query.milestone) {
        const { data } = await apollo.query({
          query: GET_MILESTONE_BY_ID,
          variables: { milestoneId: context.query.milestone },
        });

        entity = data.getMilestoneById;
        entityType = ENTITIES_TYPES.MILESTONE;
      }

      if (context.query?.taskProposal) {
        const { data } = await apollo.query({
          query: GET_TASK_PROPOSAL_BY_ID,
          variables: { proposalId: context.query?.taskProposal },
        });

        entity = data.getTaskProposalById;
        entityType = ENTITIES_TYPES.PROPOSAL;
      }
      if (context.query?.task) {
        const { data } = await apollo.query({
          query: GET_TASK_BY_ID,
          variables: { taskId: context.query.task },
        });

        entity = data.getTaskById;
        entityType = entity.type || ENTITIES_TYPES.TASK;
      }

      if (context.query?.grant && !context.query?.grantApplicationId) {
        const { data } = await apollo.query({
          query: GET_GRANT_BY_ID,
          variables: { grantId: context.query.grant },
        });
        entityType = ENTITIES_TYPES.GRANT;
        entity = data.getGrantById;
      }

      if (context.query?.grantApplicationId) {
        const { data } = await apollo.query({
          query: GET_GRANT_APPLICATION_BY_ID,
          variables: { grantApplicationId: context.query.grantApplicationId },
        });
        entityType = ENTITIES_TYPES.GRANT_APPLICATION;
        entity = data.getGrantApplicationById;
      }
      if (!entity) {
        return { props: {} };
      }

      meta.title = entity.title;
      meta.description =
        JSON.parse(entity.description)?.[0]?.children[0]?.text ||
        `${capitalize(entityType.split('_').join(' '))} description`;

      if (entity?.media?.length) {
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
