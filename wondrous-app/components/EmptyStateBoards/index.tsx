import { AddTaskButton, EmptyStatePlaceholder, EmptyStateWrapper } from './styles';

interface Props {
  status: string;
}

const EmptyStateBoards = ({ status }: Props) => {
  console.log(status);
  return (
    <EmptyStateWrapper>
      <AddTaskButton>Add task</AddTaskButton>
      <EmptyStatePlaceholder />
    </EmptyStateWrapper>
  );
};

export default EmptyStateBoards;
