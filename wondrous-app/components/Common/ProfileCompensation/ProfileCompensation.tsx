import { SafeImage } from '../Image';
import { CompensationWrapper, IconContainer, CompensationPill } from './styles';

function ProfileCompensation({ rewards, taskIcon, style, pillStyle = {} }) {
  const { icon, rewardAmount, symbol } = rewards[0] || {};

  return (
    <CompensationWrapper style={style}>
      <CompensationPill style={pillStyle}>
        {rewardAmount && (
          <>
            {icon && (
              <IconContainer>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <SafeImage
                  useNextImage={false}
                  src={icon}
                  style={{
                    width: '24px',
                    height: '24px',
                  }}
                  alt="Reward"
                />
              </IconContainer>
            )}
            <p style={{ color: 'white' }}>
              {rewardAmount} {icon ? null : symbol}
            </p>
          </>
        )}
        {taskIcon || null}
      </CompensationPill>
    </CompensationWrapper>
  );
}

export default ProfileCompensation;
