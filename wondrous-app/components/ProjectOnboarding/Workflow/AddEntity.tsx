import { useQuery } from '@apollo/client';
import { Grid, Typography } from '@mui/material';
import PlusIcon from 'components/Icons/plus';
import { GET_ORG_PODS } from 'graphql/queries';
import palette from 'theme/palette';
import typography from 'theme/typography';
import TrashIcon from 'components/Common/WonderAiTaskGeneration/images/trash-icon.svg';

import { ENTITIES_TYPES } from 'utils/constants';
import EditIcon from 'components/Icons/editIcon';
import useProjectOnboardingContext from '../Shared/context';
import { ActionItemWrapper } from '../Shared/styles';

const TYPES = {
  ADD: 'ADD',
  SUGGESTIONS: 'SUGGESTIONS',
};

const Actions = ({ type, entityType }) => {
  if (type === TYPES.ADD) {
    return (
      <ActionItemWrapper type="button">
        <PlusIcon />
      </ActionItemWrapper>
    );
  }
  if (entityType === ENTITIES_TYPES.POD) {
    return (
      <ActionItemWrapper type="button">
        <TrashIcon />
      </ActionItemWrapper>
    );
  }
  return (
    <Grid display="flex" gap="8px" alignItems="center">
      <ActionItemWrapper type="button">
        <EditIcon />
      </ActionItemWrapper>
      <ActionItemWrapper type="button">
        <TrashIcon />
      </ActionItemWrapper>
    </Grid>
  );
};

const CardType = ({ type, entityType, title, podColor }) => (
  <Grid display="flex" justifyContent="space-between" alignItems="center" padding="4px 4px 4px 8px">
    <Grid>
      {entityType === ENTITIES_TYPES.POD ? (
        <Grid bgcolor={podColor || palette.highlightPurple} width="10px" height="10px" borderRadius="110px" />
      ) : null}
      <Typography
        color={palette.white}
        fontSize="13px"
        lineHeight="13px"
        fontFamily={typography.fontFamily}
        fontWeight={700}
      >
        {title}
      </Typography>
    </Grid>
    <Actions type={type} entityType={entityType} />
  </Grid>
);

const AddEntity = ({ entityType, nextStep }) => {
  const { orgId } = useProjectOnboardingContext();
  const { data: orgPodsData } = useQuery(GET_ORG_PODS, {
    variables: {
      orgId,
    },
    skip: entityType !== ENTITIES_TYPES.POD,
  });

  return (
    <Grid container direction="column" height="100%" justifyContent="space-between">
      <Grid container direction="column" gap="24px" alignItems="flex-start" />
    </Grid>
  );
};

export default AddEntity;
