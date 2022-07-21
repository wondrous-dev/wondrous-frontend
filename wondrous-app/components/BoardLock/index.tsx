import { useOrgBoard, usePodBoard, useCreateEntityContext } from 'utils/hooks';
import { PRIVACY_LEVEL, PERMISSIONS } from 'utils/constants';
import { useMe } from 'components/Auth/withAuth';
import { BoardLockWrapper, BoardOverlay, OverlayPopup, OverlayPopupTitle } from './styles';
import SkeletonBoard from 'components/Common/SkeletonBoard';
import { HeaderButton } from 'components/organization/wrapper/styles';
import { useRouter } from 'next/router';

const BoardLock = ({ children, handleJoinClick, requestSent }) => {
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard;
  const entityContext = useCreateEntityContext();
  const router = useRouter();
  const user = useMe();
  if (!board) return children;
  const { userOrgs } = entityContext;

  const permissionsWithAccess = [
    PERMISSIONS.FULL_ACCESS,
    PERMISSIONS.CREATE_TASK,
    PERMISSIONS.EDIT_TASK,
    PERMISSIONS.REVIEW_TASK,
  ];

  const hasNoPodAccess =
    board?.pod?.privacyLevel === PRIVACY_LEVEL.private &&
    !board?.userPermissionsContext?.podPermissions[board?.podId]?.some((el) => permissionsWithAccess.includes(el));

  const isNotAMemberOfTheOrg =
    !userOrgs || !userOrgs?.getUserOrgs?.find((org) => org.id === board?.orgId) || hasNoPodAccess;

  const isPrivate =
    isNotAMemberOfTheOrg &&
    (orgBoard?.orgData?.privacyLevel === PRIVACY_LEVEL.private ||
      podBoard?.pod?.privacyLevel === PRIVACY_LEVEL.private);

  if (isPrivate) {
    const title = !user
      ? 'You need to sign in and request permissions to view'
      : requestSent
      ? 'Request sent. Please wait for a response'
      : `${orgBoard ? 'Org' : 'Pod'} set to private. Please request permissions to view`;
    const buttonTitle = !user ? 'Sign in' : requestSent ? 'Request sent' : 'Apply to join';
    const action = user ? handleJoinClick : () => router.push('/login');

    return (
      <BoardLockWrapper>
        <BoardOverlay>
          <OverlayPopup>
            <OverlayPopupTitle>{title}</OverlayPopupTitle>
            <HeaderButton disabled={requestSent} onClick={action} type="button" reversed>
              {buttonTitle}
            </HeaderButton>
          </OverlayPopup>
        </BoardOverlay>

        <SkeletonBoard />
      </BoardLockWrapper>
    );
  }
  return children;
};

export default BoardLock;
