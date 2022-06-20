import { useLazyQuery } from '@apollo/client';
import { GET_PREVIEW_FILE } from 'graphql/queries/media';
import { useEffect } from 'react';
import styled from 'styled-components';

const TaskLink = styled.a`
  && {
    color: #00baff;
    font-size: 14px;
    cursor: pointer;
  }
`;

export const MediaLink = (props) => {
  const { media, style, children } = props;
  const { name, slug, uploadSlug } = media;
  const [getPreviewFile, { data, loading, error }] = useLazyQuery(GET_PREVIEW_FILE, {
    fetchPolicy: 'network-only',
  });
  const fileUrl = data?.getPreviewFile?.url;
  const mediaSlug = slug || uploadSlug;
  useEffect(() => {
    if (mediaSlug) {
      getPreviewFile({
        variables: {
          path: mediaSlug,
        },
      });
    }
  }, [mediaSlug, getPreviewFile]);
  return (
    <TaskLink style={style} href={fileUrl} target="_blank">
      {children ?? name}
    </TaskLink>
  );
};
