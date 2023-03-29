import { ButtonUnstyled, OptionUnstyled, PopperUnstyled, SelectUnstyled, TextareaAutosize } from '@mui/base';
import SaveAltOutlined from '@mui/icons-material/SaveAltOutlined';
import {
  Autocomplete,
  Grid,
  Input,
  InputAdornment,
  InputBase,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Button } from 'components/Common/button';
import { GradientHighlightHorizontal } from 'components/Common/gradients';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import AttachFileIcon from 'components/Icons/attachFile.svg';
import CloseModalIcon from 'components/Icons/closeModal';
import { DAOIcon } from 'components/Icons/dao';
import PlusIcon from 'components/Icons/plus';
import PodIcon from 'components/Icons/podIcon';
import PointsIcon from 'components/Icons/pointsIcon.svg';
import SingleDatePicker from 'components/SingleDatePicker';
import styled, { css } from 'styled-components';
import { greyColors } from 'theme/colors';
import palette from 'theme/palette';
import scrollBarStyles from 'components/Common/ScrollbarStyles';
import typography from 'theme/typography';

export const StyledGrid = styled(Grid)`
  && {
    border: 1px solid ${palette.grey79};
    padding: 12px;
  }
`;

export const LeftColumnText = styled(Typography)`
  && {
    color: ${palette.blue20};
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 12px;
  }
`;

export const CategoryDiv = styled.div`
  padding: 10px 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background: ${palette.grey78};
  }
`;

export const CategoryText = styled(LeftColumnText)`
  && {
    color: ${palette.white};
    margin-bottom: 0;
  }
`;

export const TemplateTitle = styled(Typography)`
  && {
    font-weight: 700;
    font-size: 16px;
    text-transform: capitalize;
    color: ${palette.white};
    margin-bottom: 12px;
  }
`;

export const TemplateDiv = styled.div`
  background: ${palette.grey87};
  padding: 14px;
  margin-bottom: 12px;
  border-radius: 6px;
  cursor: pointer;
`;

export const TemplateDivTitle = styled(Typography)`
  && {
    font-weight: 700;
    font-size: 13px;
    color: ${palette.white};
  }
`;

export const TemplateDivDescription = styled(TemplateDivTitle)`
  && {
    color: ${palette.grey250};
    overflow: hidden;
    overflow-wrap: break-word;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
  }
`;
