import RolePill from 'components/Common/RolePill';
import PodIcon from 'components/Icons/podIcon';
import MemberIcon from 'components/Icons/Sidebar/people.svg';
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
  PodNameText,
} from './styles';

const PodItem = (props) => {
  const { podData } = props;

  const { userPermissionsContext } = useOrgBoard() || {};

  const podId = podData?.id;
  const bgColor = podData?.color;
  const podName = podData?.name;
  const podDescription = podData?.description;
  const contributorCount = podData?.contributorCount || 0;
  const role = userPermissionsContext?.podRoles[podId];

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
      <PodItemStatsContainer>
        <PodItemStats>
          <MemberIcon />
          <PodItemContributorsCount>{contributorCount}</PodItemContributorsCount>
        </PodItemStats>
        <RolePill roleName={role} />
      </PodItemStatsContainer>
    </PodItemContainer>
  );
};

export default PodItem;
