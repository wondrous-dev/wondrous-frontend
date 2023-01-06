import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${palette.grey950};
  color: ${palette.white};
  font-family: ${typography.fontFamily};
  font-weight: 500;
  font-size: 13px;
  line-height: 10px;
  border-radius: 220px;
  padding: 6px 12px;
  gap: 14px;
`;
