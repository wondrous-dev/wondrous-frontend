import styled from 'styled-components';
import palette from 'theme/palette';
import SmartLink from 'components/Common/SmartLink';
import typography from 'theme/typography';

export const PolygonIconWrapper = styled.div`
  background: ${palette.purple900};
  border-radius: 100%;
  height: 26px;
  width: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    height: 15px;
    width: 15px;
  }
`;

export const TaskLink = styled.a`
  padding: 1px 6px;
  border-radius: 6px;
  background: ${palette.grey85};
  color: ${palette.white};
  font-size: 13px;
  font-weight: 500;
  font-family: ${typography.fontFamily};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
