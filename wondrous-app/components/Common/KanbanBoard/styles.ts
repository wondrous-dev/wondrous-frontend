import styled from 'styled-components';
import { CreateLayoutsModal } from '../../CreateEntity/styles';

export const KanbanBoardContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  margin-top: 32px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: block;
  }
`;
export const LoadMore = styled.div`
  display: ${(props) => (props.hasMore ? 'block' : 'none')};
`;

export const ModalBody = styled(CreateLayoutsModal)`
  && {
    width: auto;
    max-width: 600px;
  }
`;

export const KanbanBoardPaginationContainer = styled.div`
  position: fixed;
  bottom: 40px;
  left: 0;
  z-index: 20;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const KanbanBoardPaginationStepper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  padding: 10px;
  gap: 10px;
  position: absolute;
  width: 76px;
  height: 28px;
  background: #474747;
  box-shadow: 0px 14px 44px rgba(0, 0, 0, 0.65);
  border-radius: 300px;
  margin: 0 auto;
`;
