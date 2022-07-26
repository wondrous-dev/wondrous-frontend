import { useOrgBoard, usePodBoard } from 'utils/hooks';
import { AppliedFiltersItem, CloseIcon } from './styles';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
export default function UserFilterPill() {
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();

  const board = orgBoard || podBoard;

  if (!board?.user) return null;
  const { username, profilePicture } = board?.user;

  const deleteUserFilter = () => board?.deleteUserIdFilter();
  return (
    <AppliedFiltersItem>
      {profilePicture ? (
        <SafeImage
          useNextImage={false}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '13px',
            marginRight: '4px',
          }}
          src={profilePicture}
        />
      ) : (
        <DefaultUserImage
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '13px',
            marginRight: '4px',
          }}
        />
      )}

      {username}
      <CloseIcon onClick={deleteUserFilter} />
    </AppliedFiltersItem>
  );
}
