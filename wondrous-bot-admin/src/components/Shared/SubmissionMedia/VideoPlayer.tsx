import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_PREVIEW_FILE } from 'graphql/queries/media';
import { Filename, TaskVideo } from './styles';

interface VideoPlayerArgs {
  src: string;
  style?: object;
  name: string;
}
function VideoPlayer(VideoPlayerArgs: VideoPlayerArgs) {
  const {
    src,
    name,
    style = { width: '100%', height: '100%' },
  } = VideoPlayerArgs;
  const [getPreviewFile, { data, loading, error }] = useLazyQuery(
    GET_PREVIEW_FILE,
    {
      fetchPolicy: 'network-only',
    }
  );

  const videoUrl = data?.getPreviewFile?.url;
  useEffect(() => {
    if (src && !src.startsWith('http')) {
      getPreviewFile({
        variables: {
          path: src,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  if (!videoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    <Filename>{name}</Filename>;
  }

  if (videoUrl) {
    return <TaskVideo {...style} controls url={videoUrl} />;
  }
  return null;
}

export default VideoPlayer;
