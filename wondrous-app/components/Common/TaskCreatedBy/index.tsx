import { renderMentionString } from 'utils/common';
import { ENTITIES_TYPES } from 'utils/constants';
import { GET_USER } from 'graphql/queries';
import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';

export const StyledText = styled(Typography)`
  && {
    color: #c4c4c4;
    font-size: 14px;
  }
`;

export const StyledMention = styled(Typography)`
  && {
    color: white;
  }
`;

export function TaskCreatedBy(props) {
  const { router, type, createdBy } = props;
  const [getUser, { data: getUserData }] = useLazyQuery(GET_USER); // TODO should be reading this from resolver instead
  const isShown = type === ENTITIES_TYPES.MILESTONE || type === ENTITIES_TYPES.BOUNTY;
  useEffect(() => {
    if (isShown) {
      getUser({
        variables: {
          userId: createdBy,
        },
      });
    }
  }, [getUser, createdBy, isShown]);

  if (isShown) {
    return (
      <StyledText>
        {renderMentionString({
          content: `@[${getUserData?.getUser?.username}](${createdBy})launched a ${type}`,
          router,
        })}
      </StyledText>
    );
  }
  return null;
}
