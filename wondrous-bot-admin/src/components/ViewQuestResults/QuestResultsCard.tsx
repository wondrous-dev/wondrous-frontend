import { Grid, Typography } from '@mui/material';
import { Label } from 'components/QuestsList/styles';
import AccordionComponent from 'components/Shared/Accordion';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { StyledLinkButton, StyledViewQuestResults } from './styles';

const QuestResultsCard = ({ submission }) => {
  return (
    <AccordionComponent
      renderTitle={() => (
        <Typography
          fontFamily='Poppins'
          fontWeight={600}
          fontSize='13px'
          lineHeight='20px'
          color='black'
        >
          {submission.user}
        </Typography>
      )}
    >
      <Grid
        bgcolor='white'
        gap='18px'
        padding='14px'
        display='flex'
        flexDirection='column'
      >
        {submission?.rewards?.map((reward, idx) => (
          <StyledViewQuestResults isReward>
            {reward.value} {reward.type}
          </StyledViewQuestResults>
        ))}
        {submission?.stepsInfo?.map((step, idx) => (
          <Grid
            display='flex'
            flexDirection='column'
            gap='8px'
            alignItems='flex-start'
            justifyContent='flex-start'
          >
            <Label fontSize='12px' color='#2A8D5C' fontWeight={700}>
              Step {idx}
            </Label>
            <Typography
              fontFamily='Poppins'
              fontWeight={500}
              fontSize='14px'
              lineHeight='24px'
              color='#767676'
            >
              {step.value}
            </Typography>
          </Grid>
        ))}
        <Grid display='flex' gap='24px' alignItems='center'>
          {submission?.attachments?.map((attachment, idx) => (
            <Grid
              display='flex'
              gap='6px'
              alignItems='center'
              key={'attachment-' + idx}
            >
              <StyledLinkButton>
                <AttachFileIcon
                
                  sx={{
                    fontSize: '18px',
                    color: 'white',
                  }}
                />
              </StyledLinkButton>
              <Typography
                fontFamily='Space Grotesk'
                fontWeight={500}
                fontSize='14px'
                color='#000000'
              >
                {attachment.title}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </AccordionComponent>
  );
};

export default QuestResultsCard;
