import styled from 'styled-components';
// import MuxVideo from '@mux/mux-video-react';

import palette from 'theme/palette';

export const PlayerWrapper = styled.div`
  max-height: 300px;
  max-width: 300px;
  border-radius: 12px;
  margin-top: 10px;
  background: ${palette.black};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// export const StyledMuxPlayer = styled(MuxVideo)`
//   height: 100%;
//   width: 100%;
//   --controls: none;
// `;
