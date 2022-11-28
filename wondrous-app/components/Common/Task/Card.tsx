import ProposalCard from './ProposalCard';
import TaskCard from './TaskCard';

export default function Card(props) {
  const { task } = props;
  return task.isProposal ? <ProposalCard {...props} /> : <TaskCard {...props} />;
}
