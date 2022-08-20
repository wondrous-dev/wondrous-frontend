import Tooltip from 'components/Tooltip';
import styled from 'styled-components';
import PrivacyMembersIcon from 'components/Icons/privacyMembers.svg';
import PrivacyPublicIcon from 'components/Icons/privacyPublic.svg';

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  gap: 10px;
  width: 28px;
  height: 28px;
  background: #313131;
  border-radius: 4px;
  cursor: pointer;
  :hover {
    background: #707070;
    filter: drop-shadow(0px 7px 7px rgba(0, 0, 0, 0.5));
  }
`;

const PrivacyIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  svg {
    width: 30px;
  }
`;

const PrivacyIcon = ({ privacyLevel }) => (
  <Tooltip title={privacyLevel === 'public' ? 'Public' : 'Private'} placement="top">
    <IconWrapper>
      <PrivacyIconWrapper>
        {privacyLevel === 'public' ? <PrivacyPublicIcon /> : <PrivacyMembersIcon />}
      </PrivacyIconWrapper>
    </IconWrapper>
  </Tooltip>
);

export default PrivacyIcon;
