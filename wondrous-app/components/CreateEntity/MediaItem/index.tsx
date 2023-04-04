import MediaLink from 'components/Common/MediaLink';
import React from 'react';
import { SafeImage } from '../../Common/Image';
import DeleteIcon from '../../Icons/DeleteIcon';
import { Filename, MediaImageVideoTextWrapper, MediaItemWrapper } from './styles';
import VideoPlayer from './VideoPlayer';

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
  return (
    <MediaItemWrapper className={className}>
      <MediaLink media={mediaItem}>
        <MediaImageVideoTextWrapper>
          {mediaItem?.type === 'image' && (
            <SafeImage
              useNextImage={false}
              src={mediaItem?.uploadSlug || mediaItem?.slug}
              style={{
                borderRadius: '4px',
                position: 'relative',
                left: '0',
                height: '100%',
                maxWidth: '100%',
              }}
              alt="Media Item"
            />
          )}
          {mediaItem?.type === 'video' && (
            <VideoPlayer
              src={mediaItem?.uploadSlug || mediaItem?.slug}
              name={mediaItem?.name}
              style={{ width: '10%', height: '10%' }}
            />
          )}
          <Filename>{mediaItem?.name}</Filename>
        </MediaImageVideoTextWrapper>
      </MediaLink>
      {!viewOnly && (
        <DeleteIcon
          onClick={() => {
            const newMediaUploads = mediaUploads.filter(
              (mediaUpload) =>
                mediaUpload.uploadSlug !== mediaItem?.uploadSlug && mediaUpload?.uploadSlug !== mediaItem?.slug
            );
            setMediaUploads(newMediaUploads);
            if (removeMediaItem) {
              removeMediaItem();
            }
          }}
        />
      )}
    </MediaItemWrapper>
  );
}
