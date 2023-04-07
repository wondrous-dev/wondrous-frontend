import { Grid, Typography } from '@mui/material';
import PanelComponent from 'components/CreateTemplate/PanelComponent';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Header } from './styles';
import SelectComponent from 'components/Shared/Select';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ButtonIconWrapper } from 'components/Shared/styles';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';

import DeleteIcon from 'components/Icons/Delete';
import StrictModeDroppable from 'components/StrictModeDroppable';
import { CONFIG_COMPONENTS, TYPES } from 'utils/constants';

const COMPONENT_OPTIONS = [
  {
    label: 'Text',
    value: TYPES.TEXT_FIELD,
  },
  {
    label: 'Telegram',
    value: TYPES.TELEGRAM,
  },
  {
    label: 'Quiz',
    value: TYPES.QUIZ,
  },
];

const AddFormEntity = ({ configuration, setConfiguration, handleRemove }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(configuration);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setConfiguration(reorderedItems);
  };

  const handleChangeType = (type, id) => {
    console.log(type, 'TYPE', id);
    if (!type) return;

    const newConfiguration = configuration.reduce((acc, next) => {
      if (next.id === id) {
        acc = [
          ...acc,
          {
            type,
            id,
          },
        ];
        return acc;
      }
      acc.push(next);
      return acc;
    }, []);
    setConfiguration(newConfiguration);
  };

  return (
   <Grid display="flex" gap="24px" flexDirection="column" alignItems="flex-start" justifyContent="flex-start" width="100%">
    <Typography
    fontFamily="Poppins"
    fontWeight={600}
    fontSize="18px"
    lineHeight="24px"
    color="black"
    >{configuration?.length} Quest Steps</Typography>
     <DragDropContext onDragEnd={handleDragEnd}>
      <StrictModeDroppable droppableId='droppableId'>
        {(provided) => (
          <Grid
            display='flex'
            flexDirection='column'
            justifyContent='center'
            gap='24px'
            alignItems='center'
            width='100%'
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {configuration?.map((item, idx) => {
              const Component = CONFIG_COMPONENTS[item.type]
              return (
                <Draggable key={idx} draggableId={`${idx}`} index={idx}>
                {(provided, snapshot) => (
                  <Grid
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    width='100%'
                    isDragging={snapshot.isDragging}
                  >
                    <PanelComponent
                      renderHeader={() => (
                        <Header
                          display='flex'
                          justifyContent='space-between'
                          alignItems='center'
                        >
                          <Grid display='flex' gap='18px' alignItems='center'>
                            <DragIndicatorIcon
                              sx={{
                                color: '#2A8D5C',
                              }}
                            />
                            <Typography
                              color='#2A8D5C'
                              fontFamily='Poppins'
                              fontWeight={700}
                              fontSize='12px'
                              lineHeight='14px'
                              whiteSpace="nowrap"
                            >
                              Step {idx + 1}
                            </Typography>
                            <SelectComponent
                              options={COMPONENT_OPTIONS}
                              value={item.type}
                              onChange={(value) =>
                                handleChangeType(value, item.id)
                              }
                            />
                          </Grid>
                          <Grid display='flex' alignItems='center' gap='14px'>
                            <ButtonIconWrapper onClick={() => handleRemove(idx)}>
                              <DeleteIcon />
                            </ButtonIconWrapper>
                            <ButtonIconWrapper>
                              <MoreVertIcon
                                sx={{
                                  color: 'black',
                                  fontSize: '17px',
                                }}
                              />
                            </ButtonIconWrapper>
                          </Grid>
                        </Header>
                      )}
                      renderBody={() => <Component />}
                    />
                  </Grid>
                )}
              </Draggable>
              )
            })}
          </Grid>
        )}
      </StrictModeDroppable>
    </DragDropContext>
   </Grid>
  );
};

export default AddFormEntity;
