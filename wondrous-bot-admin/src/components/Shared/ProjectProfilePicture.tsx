import { DAOIcon } from 'components/Icons/DAOIcon';
import SafeImage from 'components/SafeImage';
import styled from 'styled-components';

const NoLogoDAO = styled((props) => (
  <div {...props}>
    <DAOIcon
      stroke='#787878'
      encircled={false}
      style={{
        width: '36px',
        height: '36px',
      }}
    />
  </div>
))`
  display: flex;
  width: 36px;
  height: 36px;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
  background: transparent;
`;

export const OrgProfilePicture = ({ profilePicture, style = {} }) => {
  if (profilePicture) {
    return (
      <SafeImage
        src={profilePicture}
        style={{ height: '20px', width: '20px', borderRadius: '4px', ...style }}
        alt='Profile picture'
      />
    );
  }
  return (
    <NoLogoDAO
      style={{ height: '20px', width: '20px', borderRadius: '4px', ...style }}
    >
      <DAOIcon />
    </NoLogoDAO>
  );
};
