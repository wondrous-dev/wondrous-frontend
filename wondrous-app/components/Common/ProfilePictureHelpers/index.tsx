import { DAOIcon } from 'components/Icons/dao';
import PodIcon from 'components/Icons/podIcon';
import { NoLogoDAO } from 'components/Common/Sidebar/Permanent/styles';
import { SafeImage } from '../Image';
import { PodName, PodWrapper } from '../Task/styles';

export const OrgProfilePicture = ({ profilePicture, style = {} }) => {
  if (profilePicture) {
    return <SafeImage src={profilePicture} style={{ height: '20px', width: '20px', borderRadius: '4px', ...style }} />;
  }
  return (
    <NoLogoDAO style={{ height: '20px', width: '20px', borderRadius: '4px', ...style }}>
      <DAOIcon />
    </NoLogoDAO>
  );
};

export const PodProfilePicture = ({ style = {}, goToPod, podId, podColor, podName = '' }) => (
  <PodWrapper
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      goToPod(podId);
    }}
    style={{
      marginTop: '0',
    }}
  >
    <PodIcon
      color={podColor}
      style={{
        width: '26px',
        height: '26px',
        marginRight: '8px',
      }}
    />
    {podName ? (
      <PodName
        style={{
          whiteSpace: 'nowrap',
          maxWidth: '155px',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
      >
        {podName}
      </PodName>
    ) : null}
  </PodWrapper>
);
