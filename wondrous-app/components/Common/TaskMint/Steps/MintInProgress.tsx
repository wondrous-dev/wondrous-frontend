import { useEffect, useMemo, useState } from 'react';
import { Approved } from 'components/Icons';
import Grid from '@mui/material/Grid';
import palette from 'theme/palette';
import ProgressBar from 'components/Common/ProgressBar';

import { MintStep, ProgressBarWrapper } from './styles';
import MintStepContent from './MintStepContent';
import { STEPS } from './constants';

const MintStepDetails = ({ step }) => (
  <Grid display="flex" direction="column" gap="18px" justifyContent="flexStart">
    {STEPS.map((item, idx) => (
      <MintStep isActive={idx <= step}>
        <Approved fill={idx > step ? palette.grey57 : null} skipCircle height="35" width="35" />
        <span>{item.title}</span>
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
    <MintStepContent
      skipDivider
      title="Minting your task..."
      img="/images/taskmint/inprogressmint.png"
      body="The minting will only take a moment, please keep this modal open."
    >
      <Grid
        container
        flexDirection="column"
        bgcolor={palette.background.default}
        borderRadius="6px"
        padding="12px"
        gap="12px"
      >
        <>
          <Grid container item justifyContent="space-between" fontSize="13px" fontWeight="500" color={palette.grey58}>
            <div>Progress</div>
            <div>{progress}% complete</div>
          </Grid>
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
        </>
      </Grid>
      <MintStepDetails step={step} />
    </MintStepContent>
  );
};
export default MintInProgress;
