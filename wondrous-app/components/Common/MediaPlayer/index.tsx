import React from 'react';
import { SafeImage } from '../Image';
import MediaLink from 'components/Common/MediaLink';
import { TaskMediaWrapper, TaskImage, TaskAudio, TaskVideo, TaskMediaUnsuported } from './styles';

export const TaskMedia = (props) => {
  const { id = '', media = {} } = props;
  const { type = '', slug = '', uploadSlug = '' } = media;
  const mediaContentComponents = {
    image: (
      <SafeImage
        style={{
          width: '100%',
          maxWidth: '295px',
          maxHeight: '295px',
          borderRadius: '6px',
          objectFit: 'cover',
        }}
        src={slug || uploadSlug}
      />
    ),
    video: (
      <TaskVideo
        slug={slug || uploadSlug}
        config={{
          youtube: {
            playerVars: {
              controls: 0,
            },
          },
        }}
        width="100%"
        height="100%"
      />
    ),
    audio: (
      <TaskAudio
        slug={slug || uploadSlug}
        config={{
          soundcloud: {
            show_artwork: false,
            download: false,
            sharing: false,
          },
        }}
        width="100%"
        height="54px"
      />
    ),
    file: <MediaLink media={media} />,
  };
  let mediaContent = null;
  if (type in mediaContentComponents) {
    mediaContent = mediaContentComponents[type];
  } else {
    mediaContent = <TaskMediaUnsuported>Media not supported.</TaskMediaUnsuported>;
  }

  return <TaskMediaWrapper key={'media-task-' + id}>{mediaContent}</TaskMediaWrapper>;
};
