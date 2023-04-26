import { Box, Grid, Typography } from '@mui/material';
import {
  RoundedSecondaryButton,
  SharedSecondaryButton,
} from 'components/Shared/styles';
import { useContext, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

import { pinkColors } from 'utils/theme/colors';
import { CardHoverWrapper, CardWrapper, Label } from './styles';
import { useNavigate } from 'react-router-dom';
import PageWrapper from 'components/Shared/PageWrapper';
import { BG_TYPES } from 'utils/constants';
import { useQuery } from '@apollo/client';
import { GET_QUESTS_FOR_ORG } from 'graphql/queries';
import GlobalContext from 'utils/context/GlobalContext';

const LEVELS = [1, 2, 3, 4, 5];

const INFO = {
  [1]: {
    label: 'Level 1 - 10XP',
    items: [
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
    ],
  },
  [2]: {
    label: 'Level 2 - 20XP',
    items: [
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
    ],
  },
  [3]: {
    label: 'Level 3 - 30XP',
    items: [
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
    ],
  },
  [4]: {
    label: 'Level 4 - 40XP',
    items: [
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
    ],
  },
  [5]: {
    label: 'Level 5 - 50XP',
    items: [
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
      {
        xp: 5,
        label: 'Complete member info',
        completions: 591,
      },
    ],
  },
};

const QuestsList = () => {
  const { activeOrg } = useContext(GlobalContext);
  const navigate = useNavigate();
  const { data, refetch, variables } = useQuery(GET_QUESTS_FOR_ORG, {
    variables: {
      notifyOnNetworkStatusChange: true,
      input: {
        orgId: activeOrg?.id,
      },
    },
  });

  return (
    <PageWrapper
      bgType={BG_TYPES.QUESTS}
      containerProps={{
        minHeight: '100vh',
        gap: '42px',
        padding: {
          xs: '14px 14px 120px 14px',
          sm: '24px 56px',
        },
      }}
    >
      {LEVELS.map((level, idx) => {
        return (
          <Grid
            display='flex'
            width='100%'
            flexDirection='column'
            gap='18px'
            justifyContent='flex-start'
            alignItems='flex-start'
          >
            <Label>{INFO[level].label}</Label>
            <Grid container gap='30px 14px'>
              {INFO[level].items?.map((item, idx) => (
                <CardHoverWrapper
                  onClick={() => navigate(`/quests/${idx}`)}
                  flex={1}
                  flexBasis={{
                    xs: '48%',
                    sm: '30%',
                    md: '23%',
                  }}
                  maxWidth={{
                    xs: '50%',
                    sm: '33%',
                    md: '25%',
                  }}
                >
                  <CardWrapper item>
                    <Box
                      height='40px'
                      width='auto'
                      minWidth='40px'
                      bgcolor='#84bcff'
                      borderRadius='35px'
                      display='flex'
                      justifyContent='center'
                      alignItems='center'
                      flexDirection='column'
                    >
                      <Label fontSize='16px' lineHeight={'16px'}>
                        {item.xp}
                      </Label>
                      <Label fontSize='12px' lineHeight='13px' fontWeight={400}>
                        XP
                      </Label>
                    </Box>
                    <Label fontSize='15px'>{item.label}</Label>
                    <Box
                      bgcolor='#C1B6F6'
                      padding='8px'
                      display='flex'
                      justifyContent='center'
                      alignItems='center'
                      borderRadius='6px'
                    >
                      <Label fontSize='14px' lineHeight='14px'>
                        {item.completions} completions
                      </Label>
                    </Box>
                  </CardWrapper>
                </CardHoverWrapper>
              ))}
              <CardHoverWrapper
                flex={1}
                flexBasis={{
                  xs: '48%',
                  sm: '30%',
                  md: '23%',
                }}
                maxWidth={{
                  xs: '50%',
                  sm: '33%',
                  md: '25%',
                }}
              >
                <CardWrapper onClick={() => navigate('/quests/create')}>
                  <RoundedSecondaryButton background='#F8642D'>
                    <AddIcon
                      sx={{
                        color: 'white',
                      }}
                    />
                  </RoundedSecondaryButton>
                  <Label fontSize='15px'>New Quest</Label>
                </CardWrapper>
              </CardHoverWrapper>
            </Grid>
          </Grid>
        );
      })}
    </PageWrapper>
  );
};

export default QuestsList;
