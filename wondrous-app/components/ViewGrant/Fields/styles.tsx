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

export const GrantAmountWrapper = styled.div`
  background: ${palette.grey78};
  color: ${palette.white};
  font-family: ${typography.fontFamily};
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  display: flex;
  border-radius: 300px;
  justify-content: space-between;
  align-items: center;
  height: 28px;
  gap: 4px;
  padding: 0px 2px 0px 4px;
  img {
    height: 20px !important;
    width: 20px !important;
  }
`;

export const AmountWrapper = styled.div`
  background: ${palette.grey99};
  padding: 0px 10px 0px 6px;
  border-radius: 0px 300px 300px 0px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
