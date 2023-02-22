import { SafeImage } from 'components/Common/Image';
import PodIconName from 'components/Common/PodIconName';
import { BountySignifier } from 'components/Common/Task/styles';
import TaskStatus from 'components/Icons/TaskStatus';
import { ContributorDiv, TasksWrapper, TaskRow } from 'components/organization/analytics/styles';
import { Reward, RewardAmount, RewardContainer, TaskTitle } from 'components/Table/styles';
import format from 'date-fns/format';
import { BOUNTY_TYPE, PRIVATE_TASK_TITLE } from 'utils/constants';
import { cutString, shrinkNumber } from 'utils/helpers';

const LeaderboardUserRowTasks = ({ contributorTask }) => (
  <ContributorDiv>
    <TasksWrapper>
      {contributorTask?.tasks?.map((task) => {
        const reward = (task.rewards || [])[0];
        const podName = task?.podName || task?.pod?.name;
        const podColor = task?.podColor || task?.podColor;
        return (
          <TaskRow
            key={task?.id}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (task?.title !== PRIVATE_TASK_TITLE) {
                // TODO: handleClick
              }
            }}
          >
            <TaskTitle
              style={{
                marginRight: '24px',
              }}
            >
              {cutString(task.title === PRIVATE_TASK_TITLE ? 'Private Task' : task.title)}
            </TaskTitle>
            {task?.type === BOUNTY_TYPE && <BountySignifier>bounty</BountySignifier>}
            <div
              style={{
                flex: 1,
              }}
            />
            <RewardContainer>
              {/* <Reward>
                    <SafeImage
                      src={'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=018'}
                      style={{
                        width: '16px',
                        height: '16px',
                      }}
                    />
                    <RewardAmount
                      style={{
                        marginLeft: '4px',
                        fontWeight: 'normal',
                      }}
                    >
                      {100}
                    </RewardAmount>
                  </Reward> */}
              {podName && <PodIconName color={podColor} name={podName} />}
              {reward && (
                <Reward>
                  <SafeImage
                    useNextImage={false}
                    src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=018"
                    style={{
                      width: '16px',
                      height: '16px',
                    }}
                    alt="USDC logo"
                  />
                  <RewardAmount
                    style={{
                      marginLeft: '4px',
                      fontWeight: 'normal',
                    }}
                  >
                    {shrinkNumber(reward?.rewardAmount)}
                  </RewardAmount>
                </Reward>
              )}
              <RewardContainer
                style={{
                  alignItems: 'center',
                  marginRight: '8px',
                }}
              >
                <TaskStatus
                  style={{
                    width: '29px',
                    height: '29px',
                  }}
                  status={task?.status}
                />
                <RewardAmount
                  style={{
                    marginLeft: '4px',
                    fontWeight: 'normal',
                  }}
                >
                  {format(new Date(task?.completedAt), 'MM/dd/yyyy')}
                </RewardAmount>
              </RewardContainer>
            </RewardContainer>
          </TaskRow>
        );
      })}
    </TasksWrapper>
  </ContributorDiv>
);

export default LeaderboardUserRowTasks;
