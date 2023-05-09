import { MediaLink } from './MediaLink';
import React, { useMemo } from 'react';
import SafeImage from 'components/SafeImage';
import {
  Filename,
  MediaImageVideoTextWrapper,
  MediaItemWrapper,
} from './styles';
import VideoPlayer from './VideoPlayer';
import { extractFilename, isImage, isVideo } from 'utils/media';

type MediaItemProps = {
  mediaItem: {
    type: string;
    uploadSlug?: string;
    slug?: string;
    name?: string;
  };
  setMediaUploads: (mediaUploads: Array<any>) => void;
  mediaUploads: Array<any>;
  removeMediaItem?: () => void;
  viewOnly?: boolean;
  className?: string;
};

export function MediaItem({
  mediaItem,
  setMediaUploads,
  mediaUploads,
  removeMediaItem,
  viewOnly,
  className,
}: MediaItemProps) {
  const slug = mediaItem?.uploadSlug || mediaItem?.slug;

  const mediaTypeIsImage = isImage(slug, mediaItem?.type);
  const mediaTypeIsVideo = isVideo(slug, mediaItem?.type);
  const fileName = useMemo(
    () => extractFilename(mediaItem?.name, slug),
    [mediaItem?.name, slug]
  );

  return (
    <MediaItemWrapper className={className}>
      <MediaLink media={mediaItem}>
        <MediaImageVideoTextWrapper>
          {mediaTypeIsImage && (
            <SafeImage
              src={slug}
              style={{
                borderRadius: '4px',
                position: 'relative',
                left: '0',
                height: '100%',
                maxWidth: '100%',
              }}
              alt='Media Item'
            />
          )}
          {mediaTypeIsVideo && (
            <VideoPlayer
              src={slug}
              name={mediaItem?.name}
              style={{ width: '10%', height: '10%' }}
            />
          )}
          <Filename>{fileName}</Filename>
        </MediaImageVideoTextWrapper>
      </MediaLink>
    </MediaItemWrapper>
  );
}
