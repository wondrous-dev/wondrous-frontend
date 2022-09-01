import { useRouter } from 'next/router';
import { useOrgBoard, usePodBoard, useGlobalContext } from 'utils/hooks';
import { PERMISSIONS, PRIVACY_LEVEL } from 'utils/constants';
import { useMe } from 'components/Auth/withAuth';
import SkeletonBoard from 'components/Common/SkeletonBoard';
import { HeaderButton } from 'components/organization/wrapper/styles';
import { parseUserPermissionContext } from 'utils/helpers';
import { BoardLockWrapper, BoardOverlay, OverlayPopup, OverlayPopupTitle } from './styles';

function BoardLock({ children, handleJoinClick, requestSent }) {
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard;
  const globalContext = useGlobalContext();
  const router = useRouter();
  const user = useMe();
  if (!board) return children;
  const { userOrgs } = globalContext;
  const permissions = parseUserPermissionContext({
    userPermissionsContext: board?.userPermissionsContext,
    orgId: board?.orgId,
    podId: board?.podId,
  });

  const hasNoPodAccess =
    board?.pod?.privacyLevel === PRIVACY_LEVEL.private &&
    !board?.userPermissionsContext?.podPermissions[board?.podId] &&
    !permissions.includes(PERMISSIONS.FULL_ACCESS);

  const isNotAMemberOfTheOrg =
    !userOrgs || !userOrgs?.getUserOrgs?.some((org) => org.id === board?.orgId) || hasNoPodAccess;

  const isPrivate =
    isNotAMemberOfTheOrg &&
    (orgBoard?.orgData?.privacyLevel === PRIVACY_LEVEL.private ||
      podBoard?.pod?.privacyLevel === PRIVACY_LEVEL.private);

  if (isPrivate) {
    const boardTypeTitle = orgBoard ? 'Org' : 'Pod';

    const sentRequestTitle = requestSent
      ? 'Request sent. Please wait for a response'
      : `${boardTypeTitle} set to private. Please request permissions to view`;

    const title = !user ? 'You need to sign in and request permissions to view' : sentRequestTitle;
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
}

export default BoardLock;
