import { MediaItem } from 'components/CreateEntity/MediaItem';
import { transformMediaFormat } from 'utils/helpers';
import MediaLink from '../MediaLink';
import { TaskMediaContainer } from './styles';

const TaskMedia = ({ media, className }: { media: Array<object>; className?: string }) => {
  if (!(media?.length > 0)) return null;
  const formattedMedia = transformMediaFormat(media);
  return (
    <TaskMediaContainer className={className}>
      {formattedMedia?.map((mediaItem) => (
        <MediaLink key={mediaItem?.uploadSlug} media={mediaItem}>
          <MediaItem mediaUploads={formattedMedia} mediaItem={mediaItem} viewOnly={true} />
        </MediaLink>
      ))}
    </TaskMediaContainer>
  );
};

export default TaskMedia;
