import { useMutation } from '@apollo/client';
import RolePill from 'components/Common/RolePill';
import PodIcon from 'components/Icons/podIcon';
import MemberIcon from 'components/Icons/Sidebar/people.svg';
import { UNARCHIVE_POD } from 'graphql/mutations';
import { GET_ORG_ARCHIVED_PODS, GET_ORG_FROM_USERNAME, GET_ORG_PODS, GET_USER_PODS } from 'graphql/queries';
import { useOrgBoard } from 'utils/hooks';
import {
  PodDescriptionText,
  PodItemContainer,
  PodItemContributorsCount,
  PodItemDetails,
  PodItemDetailsContainer,
  PodItemIconWrapper,
  PodItemStats,
  PodItemStatsContainer,
  PodItemUnarchiveButton,
  PodNameText,
} from './styles';

const PodItem = (props) => {
  const { podData, showUnarchivePod = false, setActivePodViewToAllPods } = props;

  const { userPermissionsContext } = useOrgBoard() || {};
  const [unarchivePod] = useMutation(UNARCHIVE_POD, {
    refetchQueries: [GET_ORG_PODS, GET_USER_PODS, GET_ORG_ARCHIVED_PODS, GET_ORG_FROM_USERNAME],
  });

  const podId = podData?.id;
  const bgColor = podData?.color;
  const podName = podData?.name;
  const podDescription = podData?.description;
  const contributorCount = podData?.contributorCount || 0;
  const role = userPermissionsContext?.podRoles[podId];

  const handleUnarchivePod = (ev) => {
    ev.preventDefault();
    const confirmed = confirm(`Are you sure you want to unarchive the ${podName} pod ?`);

    if (!confirmed) {
      return;
    }

    unarchivePod({
      variables: {
        podId,
      },
    }).then(() => {
      setActivePodViewToAllPods && setActivePodViewToAllPods();
    });
  };

  return (
    <PodItemContainer>
      <PodItemDetailsContainer>
        <PodItemIconWrapper bgColor={bgColor}>
          <PodIcon />
        </PodItemIconWrapper>
        <PodItemDetails>
          <PodNameText>{podName}</PodNameText>
          {!!podDescription && <PodDescriptionText>{podDescription}</PodDescriptionText>}
        </PodItemDetails>
      </PodItemDetailsContainer>
      {showUnarchivePod ? (
        <PodItemUnarchiveButton onClick={handleUnarchivePod}>Unarchive Pod</PodItemUnarchiveButton>
      ) : (
        <PodItemStatsContainer>
          <PodItemStats>
            <MemberIcon />
            <PodItemContributorsCount>{contributorCount}</PodItemContributorsCount>
          </PodItemStats>
          <RolePill roleName={role} />
        </PodItemStatsContainer>
      )}
    </PodItemContainer>
  );
};

export default PodItem;
