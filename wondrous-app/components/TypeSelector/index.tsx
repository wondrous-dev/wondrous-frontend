import { CheckedBoxIcon } from 'components/Icons/checkedBox';
import { ENTITIES_TYPES } from 'utils/constants';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
import FlagIcon from 'components/Icons/createMilestone';
import BountyIcon from 'components/Icons/TaskTypes/bounty';
import { Wrapper, StatItem, IconWrapper, StatValue, StatTitle } from './styles';

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
  { key: 'taskCount', icon: CheckedBoxIcon, title: 'tasks', type: ENTITIES_TYPES.TASK },
  { key: 'milestoneCount', icon: FlagIcon, title: 'milestones', type: ENTITIES_TYPES.MILESTONE },
  { key: 'bountyCount', icon: BountyIcon, title: 'bounties', type: ENTITIES_TYPES.BOUNTY },
  { key: 'proposalCount', icon: FlagIcon, title: 'proposals', type: ENTITIES_TYPES.PROPOSAL },
];

export default function TaskTypeSelector({ tasksPerTypeData }: Props) {
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard;
  const { entityType, setEntityType } = board;

  return (
    <Wrapper>
      {config.map((stat) => {
        const isActive = entityType === stat.type;
        const Icon = stat.icon;
        return (
          <StatItem key={stat.key} onClick={() => setEntityType(stat.type)} isActive={isActive}>
            <IconWrapper isActive={isActive}>
              <Icon displayBackground={false} fill="transparent" stroke="white" width="25" height="25" />
            </IconWrapper>
            <StatValue>{tasksPerTypeData?.[stat.key] || 0}</StatValue>
            <StatTitle isActive={isActive}>{stat.title}</StatTitle>
          </StatItem>
        );
      })}
    </Wrapper>
  );
}
