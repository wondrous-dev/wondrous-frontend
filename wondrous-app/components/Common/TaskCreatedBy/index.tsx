import { renderMentionString } from 'utils/common';
import { ENTITIES_TYPES } from 'utils/constants';
import { GET_USER } from 'graphql/queries';
import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Typography } from '@material-ui/core';
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

export const TaskCreatedBy = (props) => {
  const { router, type, createdBy } = props;
  const [getUser, { data: getUserData }] = useLazyQuery(GET_USER);
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
  } else {
    return null;
  }
};
