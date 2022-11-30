import { CommunityShareWrapper, ShareButton } from 'components/Common/TaskMint/Steps/styles';
import styled from 'styled-components';
import palette from 'theme/palette';
import { TaskMintButtonWrapper } from '../TaskMintButton/styles';

export const Wrapper = styled(TaskMintButtonWrapper)`
  && {
    border-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    background-color: ${palette.grey900};
    ${CommunityShareWrapper} {
      padding: 0;
      background: transparent;
    }
    ${ShareButton} {
      button {
        background: ${palette.background.default};
      }
    }
  }
`;
