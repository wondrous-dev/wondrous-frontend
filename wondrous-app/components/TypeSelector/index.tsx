import { CheckedBoxIcon } from 'components/Icons/checkedBox';
import { ENTITIES_TYPES, ONLY_GRANTS_ENABLED_ORGS } from 'utils/constants';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
import FlagIcon from 'components/Icons/createMilestone';
import BountyIcon from 'components/Icons/TaskTypes/bounty';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Wrapper, StatItem, IconWrapper, StatValue, StatTitle } from './styles';

interface TasksPerType {
  taskCount: number;
  milestoneCount: number;
  bountyCount: number;
  proposalCount: number;
}
interface Props {
  tasksPerTypeData: TasksPerType;
  setExploreGr15TasksAndBounties?: any;
}

export default function TaskTypeSelector({ tasksPerTypeData, setExploreGr15TasksAndBounties }: Props) {
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const router = useRouter();
  const board = orgBoard || podBoard;
  const { entityType, setEntityType } = board;
  const isMeritCircle = ONLY_GRANTS_ENABLED_ORGS.includes(board?.id) || ONLY_GRANTS_ENABLED_ORGS.includes(board?.orgId);

  const config = isMeritCircle
    ? [{ key: 'proposalCount', icon: FlagIcon, title: 'proposals', type: ENTITIES_TYPES.PROPOSAL }]
    : [
        { key: 'taskCount', icon: CheckedBoxIcon, title: 'tasks', type: ENTITIES_TYPES.TASK },
        { key: 'milestoneCount', icon: FlagIcon, title: 'milestones', type: ENTITIES_TYPES.MILESTONE },
        { key: 'bountyCount', icon: BountyIcon, title: 'bounties', type: ENTITIES_TYPES.BOUNTY },
        { key: 'proposalCount', icon: FlagIcon, title: 'proposals', type: ENTITIES_TYPES.PROPOSAL },
      ];
  useEffect(() => {
    if (isMeritCircle) {
      const query = {
        ...router.query,
        entity: '/proposal',
      };

      router.push({ query }, undefined, { scroll: false, shallow: true });
    }
  }, [isMeritCircle]);
  return (
    <Wrapper>
      {config.map((stat) => {
        const isActive = entityType === stat.type;
        const Icon = stat.icon;

        return (
          <StatItem
            key={stat.key}
            onClick={() => {
              setEntityType(stat.type);
              setExploreGr15TasksAndBounties(false);
            }}
            isActive={isActive}
          >
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
