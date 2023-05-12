import { Box, Grid, Typography } from '@mui/material';
import {
  RoundedSecondaryButton,
  SharedSecondaryButton,
} from 'components/Shared/styles';
import { useContext, useEffect, useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

import { pinkColors } from 'utils/theme/colors';
import { CardHoverWrapper, CardWrapper, Label } from './styles';
import { useNavigate } from 'react-router-dom';
import PageWrapper from 'components/Shared/PageWrapper';
import { BG_TYPES } from 'utils/constants';
import { useQuery } from '@apollo/client';
import { GET_QUESTS_FOR_ORG } from 'graphql/queries';
import GlobalContext from 'utils/context/GlobalContext';
import { LEVELS_DEFAULT_NAMES } from 'utils/levels/constants';
import useLevels from 'utils/levels/hooks';

const formatQuestsData = (LEVELS, data) => {
  const result = {};
  data.forEach((quest) => {
    const questLevel = quest.level || 1;
    if (!result[questLevel]) {
      result[questLevel] = {
        label: LEVELS[questLevel],
        items: [],
      };
    }

    result[questLevel].items.push({
      xp: quest.pointReward,
      label: quest.title,
      id: quest.id,
      completions: quest.submissionsCount?.approved || 0,
      inReview: quest.submissionsCount?.inReview,
    });
  });

  return result;
};

const QuestsList = ({ data }) => {
  const { activeOrg } = useContext(GlobalContext);
  const navigate = useNavigate();
  const { levels } = useLevels({
    orgId: activeOrg?.id,
  });
  const formattedData = useMemo(() => {
    if (!data) {
      return [];
    }

    return formatQuestsData(levels, data);
  }, [levels, data]);

  return (
    <PageWrapper
      bgType={BG_TYPES.QUESTS}
      containerProps={{
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '42px',
        padding: {
          xs: '14px 14px 120px 14px',
          sm: '24px 56px',
        },
      }}
    >
      {Object.keys(LEVELS_DEFAULT_NAMES).map((level, idx) => {
        if (!formattedData[level]) {
          return null;
        }
        return (
          <Grid
            display='flex'
            key={level}
            width='100%'
            flexDirection='column'
            gap='28px'
            justifyContent='flex-start'
            alignItems='flex-start'
          >
            <Label>{formattedData[level].label}</Label>
            <Grid container gap='30px 14px'>
              {formattedData[level]?.items?.map((item) => (
                <CardHoverWrapper
                  onClick={() => navigate(`/quests/${item.id}`)}
                  flex={1}
                  key={item.id}
                  flexBasis={{
                    xs: '48%',
                    sm: '30%',
                    md: '24%',
                  }}
                  maxWidth={{
                    xs: '50%',
                    sm: '33%',
                    md: '24%',
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
                      padding='4px'
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
                    <Label
                      fontSize='15px'
                      style={{
                        textAlign: 'center',
						overflowWrap: 'anywhere',
                      }}
                    >
                      {item.label}
                    </Label>
                    <Box
                      display='flex'
                      justifyContent='center'
                      alignItems='center'
                    >
                      <Box
                        bgcolor='#C1B6F6'
                        padding='8px'
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        borderRadius='6px'
                      >
                        <Label fontSize='14px' lineHeight='14px'>
                          {item.completions}{' '}
                          {item.completions === 1
                            ? 'Completion'
                            : 'Completions'}
                        </Label>
                      </Box>
                      {item.inReview > 0 && (
                        <Box
                          bgcolor='#F8AFDB'
                          padding='8px'
                          display='flex'
                          justifyContent='center'
                          alignItems='center'
                          borderRadius='6px'
                          marginLeft='8px'
                        >
                          <Label fontSize='14px' lineHeight='14px'>
                            {item?.inReview} To review
                          </Label>
                        </Box>
                      )}
                    </Box>
                  </CardWrapper>
                </CardHoverWrapper>
              ))}
              <CardHoverWrapper
                flex={1}
                flexBasis={{
                  xs: '48%',
                  sm: '30%',
                  md: '24%',
                }}
                minHeight='100%'
                maxWidth={{
                  xs: '50%',
                  sm: '33%',
                  md: '24%',
                }}
              >
                <CardWrapper onClick={() => navigate('/quests/create')} sx={{
					minHeight: '155px'
				}}>
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
