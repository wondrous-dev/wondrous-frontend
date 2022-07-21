import { useOrgBoard, usePodBoard, useCreateEntityContext } from 'utils/hooks';
import { PRIVACY_LEVEL } from 'utils/constants';
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
  //we don't want to lock the user board
  if (!board) return children;

  const { userOrgs } = entityContext;

  const isNotAMemberOfTheOrg = !userOrgs || !userOrgs?.getUserOrgs?.find((org) => org.id === board?.orgId);
  const isPrivate =
    isNotAMemberOfTheOrg &&
    (orgBoard?.orgData?.privacyLevel === PRIVACY_LEVEL.private ||
      podBoard?.pod?.privacyLevel === PRIVACY_LEVEL.private);

  if (isPrivate) {
    const title = !user
      ? 'You need to sign in and request permissions to view'
      : requestSent
      ? 'Request sent. Please wait for a response'
      : 'Org set to private.Please request permissions to view';
    // const { title, buttonTitle } = getPopupConfig(user);
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
