import styled from 'styled-components';

import palette from 'theme/palette';

export const BasicBlocksTitle = styled.div`
  color: ${palette.grey57};
  margin-bottom: 4px;
  border-bottom: 1px solid ${palette.grey920};
  font-size: 13px;
  font-weight: 500;
`;

export const SlashCommandItemIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;
