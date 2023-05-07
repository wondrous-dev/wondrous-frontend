import { Box, Divider, Grid,  Typography } from '@mui/material';
import TextField from 'components/Shared/TextField';
import { SharedSecondaryButton } from 'components/Shared/styles';
import { CampaignOverviewTitle, Label } from './styles';
import SelectComponent from 'components/Shared/Select';
import { useState } from 'react';
import Modal from 'components/Shared/Modal';

const COMPONENT_OPTIONS = [
  {
    label: 'Ultimate cool club',
    value: 'coolclub',
  },
];


const RewardComponent = ({ rewards, setQuestSettings }) => {
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const handleChange = (key, value) => {
    setQuestSettings((prev) => {
      return {
        ...prev,
        rewards: prev.rewards.map((reward) => {
          return {
            ...reward,
            value: reward.type === key ? Number(value) : reward.value,
          };
        }),
      };
    });
  };

  const onRewardAdd = (reward) => {
    setQuestSettings((prev) => {
      return {
        ...prev,
        rewards: [
          ...prev.rewards,
          reward
        ],
      };
    });
  };

  return (
    <Grid container direction='column' gap='14px' justifyContent='flex-start'>
              <Modal
          open={isRewardModalOpen}
          onClose={() => setIsRewardModalOpen(false)}
          title='Add reward'
          maxWidth={400}
          footerLeft={
            <SharedSecondaryButton>Add reward</SharedSecondaryButton>
          }
          footerRight={undefined}
          footerCenter={undefined}
        >
          <Grid display='flex' flexDirection='column' gap='14px'>
            <Label>Select role</Label>
            <SelectComponent
              options={COMPONENT_OPTIONS}
              value={'coolclub'}
              onChange={(value) => console.log(value)}
            />
          </Grid>
        </Modal>

      {rewards?.map((reward, idx) => {
        if (reward.type === 'points') {
          return (
            <Grid display='flex' gap='14px' alignItems='center' key={idx}>
              <Typography
                fontFamily='Poppins'
                fontStyle='normal'
                fontWeight={600}
                fontSize='13px'
                lineHeight='15px'
                color='#626262'
                whiteSpace={'nowrap'}
              >
                Points
              </Typography>
              <TextField
                value={reward.value}
                multiline={false}
                onChange={(value) => {
                  handleChange(reward.type, value);
                }}
              />
            </Grid>
          );
        }
        return null;
      })}

      <Divider color='#767676' />
      <Box>
        <SharedSecondaryButton disabled onClick={() => setIsRewardModalOpen(true)}>Add more</SharedSecondaryButton>
      </Box>
    </Grid>
  );
};

const RewardOverviewHeader = () => (
  <Grid
    padding='14px'
    bgcolor='#2A8D5C'
    sx={{
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
    }}
  >
    <CampaignOverviewTitle>Reward</CampaignOverviewTitle>
  </Grid>
);

export { RewardComponent, RewardOverviewHeader };
