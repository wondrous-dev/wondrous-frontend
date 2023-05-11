import { Box, ButtonBase, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import PlusIcon from 'components/Icons/plus';
import palette from 'theme/palette';

const modulesListItemStatuses = {
  add: {
    tooltipTitle: 'Add feature',
    buttonColor: '#0BA876', // TODO: add color to palette
    buttonHover: {
      bgcolor: palette.green720,
      outline: `1px solid #0BA876`,
    },
    ButtonIcon: <PlusIcon fill={palette.white} />,
  },
  remove: {
    tooltipTitle: 'Remove feature',
    buttonColor: palette.red650,
    buttonHover: {
      // TODO: add color to palette
      bgcolor: '#993039',
      outline: `1px solid #D55C66`,
    },
    ButtonIcon: <Box width="8px" height="2px" bgcolor={palette.white} borderRadius="1px" />,
  },
};

type ModulesListItemProps = {
  status: keyof typeof modulesListItemStatuses;
  moduleName: string;
  ModuleIcon: any;
  createdCount: number;
};

const ModulesListItem = ({ status, moduleName, ModuleIcon, createdCount }: ModulesListItemProps) => {
  const { tooltipTitle, buttonColor, buttonHover, ButtonIcon } = modulesListItemStatuses[status];
  return (
    <Box
      bgcolor={palette.grey900}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      padding="12px 14px 12px 8px"
      pointer-events="none"
      sx={{
        outline: `1px solid ${palette.black92}`,
        pointerEvents: 'none',
        '&:hover': {
          backgroundColor: palette.grey920,
        },
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" gap="24px">
        <Tooltip
          title={tooltipTitle}
          placement="top"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: palette.blue150,
              },
            },
            arrow: {
              sx: {
                '&::before': {
                  backgroundColor: palette.blue150,
                },
              },
            },
          }}
        >
          <ButtonBase
            disableRipple
            sx={{
              bgcolor: buttonColor,
              borderRadius: '100%',
              minWidth: '20px',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: '0px',
              pointerEvents: 'auto',
              '&:hover': {
                ...buttonHover,
              },
            }}
          >
            {ButtonIcon}
          </ButtonBase>
        </Tooltip>
        <Box display="flex" alignItems="center" gap="14px">
          <Box
            bgcolor={palette.grey87}
            width="24px"
            height="24px"
            borderRadius="4px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <ModuleIcon />
          </Box>
          <Typography color={palette.white} fontWeight="600" fontSize="16px" textTransform="capitalize">
            {moduleName}
          </Typography>
        </Box>
      </Box>
      <Typography
        color={palette.grey250}
        fontSize="13px"
        fontWeight="500"
        lineHeight="2"
        bgcolor={palette.grey87}
        padding="3px 5px"
        borderRadius="3px"
      >
        {createdCount} created
      </Typography>
    </Box>
  );
};

export default ModulesListItem;
