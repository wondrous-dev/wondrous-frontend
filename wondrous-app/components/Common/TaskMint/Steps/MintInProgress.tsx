import { useEffect, useMemo, useState } from 'react';
import { Approved } from 'components/Icons';
import Grid from '@mui/material/Grid';
import palette from 'theme/palette';
import ProgressBar from 'components/Common/ProgressBar';
import GradientHeading from 'components/GradientHeading';

import Typography from '@mui/material/Typography';
import typography from 'theme/typography';
import { STEPS } from './constants';
import { MintStep, ProgressBarWrapper, Image } from './styles';

const TASK_MINT_IMAGES = [
  '/images/taskmint/taskmintstep1.png',
  '/images/taskmint/taskmintstep2.png',
  '/images/taskmint/taskmintstep3.png',
];

const MintStepDetails = ({ step }) => (
  <Grid display="flex" direction="column" gap="18px" justifyContent="flexStart">
    {STEPS.map((item, idx) => (
      <MintStep isActive={idx <= step} isCurrent={idx === step}>
        <Approved fill={idx > step ? palette.grey57 : null} skipCircle height="35" width="35" />
        <GradientHeading>{item.title}</GradientHeading>
      </MintStep>
    ))}
  </Grid>
);

const MintInProgress = ({ step }) => {
  const [progress, setProgress] = useState(0);

  const thresholds = useMemo(() => STEPS.map((_, idx) => Math.round(((idx + 1) * 98) / STEPS.length)), []);

  let interval;

  useEffect(() => {
    clearInterval(interval);
    interval = setInterval(() => {
      setProgress((prev) => {
        const newValue = prev + 1;
        if (newValue >= 100) clearInterval(interval);

        if (newValue <= thresholds[step]) {
          return prev + 1;
        }
        return prev;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [step]);

  return (
    <Grid display="flex" direction="column" gap="18px">
      <MintStepDetails step={step} />

      <Grid container flexDirection="column" bgcolor={palette.grey99} borderRadius="6px" padding="12px" gap="12px">
        <>
          <Typography fontFamily={typography.fontFamily} fontWeight={500} fontSize="13px" color={palette.white}>
            This will take only a moment, please keep this modal open.
          </Typography>
          <Grid display="flex" gap="12px" alignItems="center">
            <Typography fontFamily={typography.fontFamily} fontWeight={500} fontSize="14px" color={palette.purple950}>
              {progress}%
            </Typography>
            <ProgressBarWrapper item step={step}>
              <ProgressBar
                value={0}
                total={100}
                height="12px"
                progressBarProps={{
                  className: `mint-task-progress-bar`,
                }}
                color={`linear-gradient(269.75deg, ${palette.green30} -19.96%, ${palette.green30} 11.33%, ${palette.violet90} 75.55%)`}
              />
            </ProgressBarWrapper>
          </Grid>
        </>
      </Grid>

      {TASK_MINT_IMAGES.map((src, idx) => (
        <Image
          src={src}
          isActive={src === TASK_MINT_IMAGES[step]}
          alt="Task mint image"
          layout="fill"
          key={`${src}_${idx}`}
        />
      ))}
    </Grid>
  );
};
export default MintInProgress;
