import { Grid } from '@mui/material';
import { Label } from 'components/CreateTemplate/styles';
import { StyledViewQuestResults } from './styles';

const getBooleanText = (value) => (value ? 'Yes' : 'No');

const ViewCampaignOverview = ({ questSettings }) => {
  return (
    <>
      {questSettings?.map((quest, idx) => {
        return (
          <Grid
            display='flex'
            justifyContent='flex-start'
            alignItems='center'
            width='100%'
            key={idx + 'quest'}
            gap='10%'
          >
            <Label>{quest.label}</Label>
            {quest.type !== 'rewards' ? (
              <StyledViewQuestResults>
                {quest.type === 'boolean' ? getBooleanText(quest.value) : null}
                {quest.type === 'text' ? quest.value : null}
              </StyledViewQuestResults>
            ) : null}
            {quest.type === 'rewards'
              ? <Grid display="flex" gap="6px" flexWrap="wrap">
                {quest.value.map((reward, key) => (
                  <StyledViewQuestResults $isReward key={key + 'reward'}>
                    {reward.value} {reward.type}
                  </StyledViewQuestResults>
                ))}
                </Grid>
              : null}
          </Grid>
        );
      })}
    </>
  );
};

export default ViewCampaignOverview;
