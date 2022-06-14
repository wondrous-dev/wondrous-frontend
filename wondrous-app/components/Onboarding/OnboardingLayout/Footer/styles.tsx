import styled, { css } from 'styled-components';

import { Grey85 } from '../../../../theme/colors';
import { Button } from 'components/Common/button';

const buttonStyle = css`
  button {
    padding: 2px 30px;
    font-family: Space Grotesk;
    font-size: 16px;
    font-weight: 600;
  }
`;

export const Container = styled.div`
  border-top: 1px solid ${Grey85};
  width: 100%;
  display: flex;
  padding-top: 30px;
  justify-content: space-between;
  margin-top: 25px;
`;

export const ContinueButton = styled(Button)`
  min-height: 40px;
  height: 40px;
  background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
  align-self: end;
  justify-content: center;

  ${buttonStyle}
`;

export const LaterButton = styled(Button)`
  min-height: 40px;
  height: 40px;
  margin-right: 20px;

  && {
    button {
      padding: 2px 30px;
      font-family: Space Grotesk;
      font-size: 16px;
      font-weight: 600;
      background: #454545;
      border: none;
      justify-content: center;
    }
  }
`;

export const Later = styled.button`
  min-height: 40px;
  margin-right: 20px;
  padding: 2px 30px;
  border-radius: 98px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  background-color: #232323;
  color: white;
  cursor: pointer;
`;

export const SecretCodeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  margin-right: 20px;
  border-radius: 98px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  background-color: #232323;
  color: white;
`;

export const RightButtons = styled.div`
  display: flex;
`;

export const BackButton = styled.button`
  width: 40px;
  height: 40px;
  background: #232323;
  border: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
