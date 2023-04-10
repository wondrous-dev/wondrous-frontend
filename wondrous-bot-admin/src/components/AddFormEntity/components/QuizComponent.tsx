import { Grid, Typography } from '@mui/material';
import { ButtonIconWrapper } from 'components/Shared/styles';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import TextField from './TextField';

const QuizComponent = () => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([
    {
      value: '',
      isCorrect: false,
    },
  ]);

  const handleButtonAction = (idx) => {
    if (idx === answers.length - 1) {
      return setAnswers([...answers, { value: '', isCorrect: false }]);
    }
    if (idx < answers.length - 1) {
      const answersClone = [...answers];
      answersClone.splice(idx, 1);
      return setAnswers(answersClone);
    }
  };

  const handleAnswerChange = (idx, value) => {
    const answersClone = [...answers];
    answersClone[idx].value = value;
    setAnswers(answersClone);
  }

  return (
    <Grid container gap='24px' direction='column'>
      <Grid item gap='14px' display='flex' flexDirection='column'>
        <Typography
          fontFamily='Poppins'
          fontWeight={600}
          fontSize='13px'
          lineHeight='15px'
          color='#626262'
        >
          Question
        </Typography>
        <TextField
          placeholder='Type a question here'
          value={question}
          onChange={setQuestion}
          multiline={false}
        />
      </Grid>
      <Grid item gap='14px' display='flex' flexDirection='column'>
        <Typography
          fontFamily='Poppins'
          fontWeight={600}
          fontSize='13px'
          lineHeight='15px'
          color='#626262'
        >
          Answers
        </Typography>
        <Grid display='flex' gap='8px' flexDirection='column'>
          {answers?.map((answer, idx) => (
            <Grid display='flex' alignItems='center' gap='14px' width='100%'>
              <TextField
                placeholder='Type a question here'
                value={answer.value}
                onChange={(value) => handleAnswerChange(idx, value)}
                multiline={false}
              />
              <ButtonIconWrapper onClick={() => handleButtonAction(idx)}>
                {idx === answers.length - 1 ? (
                  <AddIcon
                    sx={{
                      color: 'black',
                    }}
                  />
                ) : (
                  <CloseIcon
                    sx={{
                      color: 'black',
                    }}
                  />
                )}
              </ButtonIconWrapper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default QuizComponent;
