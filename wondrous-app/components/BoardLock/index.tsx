import { useOrgBoard, usePodBoard, useCreateEntityContext } from 'utils/hooks';
import { PRIVACY_LEVEL } from 'utils/constants';
const BoardLock = ({ children }) => {
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard;
  const entityContext = useCreateEntityContext();

  if (!board) return children;
  const { userOrgs } = entityContext;

  const isNotAMemberOfTheOrg = !userOrgs || !userOrgs?.getUserOrgs?.find((org) => org.id === board?.orgId);
  const isPrivate =
    isNotAMemberOfTheOrg &&
    (orgBoard?.orgData?.privacyLevel === PRIVACY_LEVEL.private ||
      podBoard?.pod?.privacyLevel === PRIVACY_LEVEL.private);

  if (isPrivate) {
    return <div style={{ color: 'white' }}>wow! im so protected</div>;
  }
  return children;
};

export default BoardLock;
