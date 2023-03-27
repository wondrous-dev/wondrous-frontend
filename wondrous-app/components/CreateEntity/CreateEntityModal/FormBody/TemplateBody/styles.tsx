import { ButtonUnstyled, OptionUnstyled, PopperUnstyled, SelectUnstyled, TextareaAutosize } from '@mui/base';
import SaveAltOutlined from '@mui/icons-material/SaveAltOutlined';
import { Autocomplete, Input, InputAdornment, InputBase, MenuItem, Select, TextField, Typography } from '@mui/material';
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
import { Grid } from 'swiper';

export const StyledGrid = styled(Grid)`
  && {
    border: 1px solid ${palette.grey250};
  }
`;

export const LeftColumnText = styled(Typography)`
  && {
    color: ${palette.blue20};
    font-size: 13px;
    font-weight: 500;
  }
`;
