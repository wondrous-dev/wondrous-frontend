import styled from 'styled-components';
import { SafeImage } from 'components/Common/Image';

export const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const OrgLogoWrapper = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

export const PodProfileImage = styled((props) => (
  <SafeImage
    style={{
      width: '60px',
      height: '60px',
      borderRadius: '50%',
    }}
    {...props}
  />
))``;
