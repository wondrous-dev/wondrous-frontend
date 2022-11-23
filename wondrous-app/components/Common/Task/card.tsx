import ProposalCard from './proposalCard';
import TaskCard from './taskCard';

export default function Card(props) {
  const { task } = props;
  return task.isProposal ? <ProposalCard {...props} /> : <TaskCard {...props} />;
}
