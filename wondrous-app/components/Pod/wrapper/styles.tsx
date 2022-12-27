import styled from 'styled-components';
import { SafeImage } from 'components/Common/Image';

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
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
