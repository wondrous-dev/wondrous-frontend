import styled from 'styled-components';
import { BaseCard } from './card';

export const Card = styled(BaseCard)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  min-height: 612px;
  width: 100%;
  max-width: 578px;
  position: relative;
  font-size: 16px;
  z-index: 13;
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  min-height: 110px;

  font-size: 12px;
`;
