import { Wrapper, StatItem, IconWrapper, StatValue, StatTitle } from './styles';
import { CheckedBoxIcon } from '../../../components/Icons/checkedBox';
import { ENTITIES_TYPES } from 'utils/constants';
import { useOrgBoard } from 'utils/hooks';

interface TasksPerType {
  taskCount: number;
  milestoneCount: number;
  bountyCount: number;
  proposalCount: number;
}
interface Props {
  tasksPerTypeData: TasksPerType;
}

const config = [
  { key: 'taskCount', icon: null, title: 'tasks', type: ENTITIES_TYPES.TASK },
  { key: 'milestoneCount', icon: null, title: 'milestones', type: ENTITIES_TYPES.MILESTONE },
  { key: 'bountyCount', icon: null, title: 'bounties', type: ENTITIES_TYPES.BOUNTY },
  { key: 'proposalCount', icon: null, title: 'proposals', type: ENTITIES_TYPES.PROPOSAL },
];

export default function Stats({ tasksPerTypeData }: Props) {
  const orgBoard = useOrgBoard();
  const { entityType, setEntityType } = orgBoard;

  return (
    <Wrapper>
      {config.map((stat) => {
        const isActive = entityType === stat.type;
        return (
          <>
            <StatItem key={stat.key} onClick={() => setEntityType(stat.type)} isActive={isActive}>
              <IconWrapper isActive={isActive}>
                <CheckedBoxIcon displayBackground={false} fill={'transparent'} stroke={'white'} />
              </IconWrapper>
              <StatValue>{tasksPerTypeData?.[stat.key] || 0}</StatValue>
              <StatTitle isActive={isActive}>{stat.title}</StatTitle>
            </StatItem>
          </>
        );
      })}
    </Wrapper>
  );
}
