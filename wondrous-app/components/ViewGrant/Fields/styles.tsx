import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const DataDisplayWrapper = styled.div`
  background: ${palette.grey99};
  padding: 4px;
  height: 26px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  color: ${palette.white};
  font-family: ${typography.fontFamily};
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
`;
