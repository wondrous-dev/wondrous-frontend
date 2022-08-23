import { TASK_STATUS_IN_REVIEW, TASK_STATUS_REQUESTED } from 'utils/constants';
import ImageIcon from 'components/Icons/image';
import AudioIcon from 'components/Icons/MediaTypesIcons/audio';
import PlayIcon from 'components/Icons/play';
import { StyledLinkIcon } from './styles';

export const DELIVERABLES_ICONS = {
  audio: <AudioIcon />,
  image: <ImageIcon />,
  link: <StyledLinkIcon />,
  video: <PlayIcon />,
};

export const STATUS_BY_TYPENAME = {
  TaskSubmissionCard: TASK_STATUS_IN_REVIEW,
  TaskProposalCard: TASK_STATUS_REQUESTED,
};

export const windowOffset = 0;
