import { Wrapper, StatItem, IconWrapper, StatValue, StatTitle } from './styles';
import { CheckedBoxIcon } from '../../../components/Icons/checkedBox';
export default function Stats() {
  const config = [
    { key: 'tasks', isActive: true, icon: null, title: 'tasks' },
    { key: 'milestones', isActive: false, icon: null, title: 'milestones' },
    { key: 'bounties', isActive: false, icon: null, title: 'bounties' },
    { key: 'proposals', isActive: false, icon: null, title: 'proposals' },
  ];

  return (
    <Wrapper>
      {config.map((stat) => (
        <>
          <StatItem isActive={stat.isActive}>
            <IconWrapper isActive={stat.isActive}>
              <CheckedBoxIcon displayBackground={false} fill={'transparent'} stroke={'white'} />
            </IconWrapper>
            <StatValue>{10}</StatValue>
            <StatTitle isActive={stat.isActive}>{stat.title}</StatTitle>
          </StatItem>
        </>
      ))}
    </Wrapper>
  );
}
