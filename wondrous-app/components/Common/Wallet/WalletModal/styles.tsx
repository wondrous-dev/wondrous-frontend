import { BaseCard } from '@components/Common/card';
import styled from 'styled-components';

export const InnerModal = styled(BaseCard)`
  width: 520px;
  position: absolute;
  left: 50%;
  top: 50%;
  height: 80%;
  transform: translate(-50%, -50%);
  overflow-y: scroll;
  z-index: 2100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(20, 20, 20) !important;
`;

export const Wallet = styled.div`
  padding: 8px 0;
`;

export const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px !important;
`;
