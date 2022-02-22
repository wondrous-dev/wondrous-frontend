import styled from 'styled-components';
import { Task } from '../Task';
import { TaskInner, TaskWrapper } from '../Task/styles';

// https://www.designcise.com/web/tutorial/why-is-styled-components-styled-wrapper-not-working-with-existing-react-component
export const SubtaskTaskItem = styled(Task)`
  ${TaskWrapper} {
    padding: 0;
  }
  ${TaskInner} {
    background: #0f0f0f;
    text-align: left;
  }
`;

export const SubtaskTaskListHasMore = styled.div``;
