import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { greyColors } from 'utils/theme/colors';

export const DefaultLink = styled(Link)`
  && {
    color: ${greyColors.grey10};
    font-size: 14px;
    font-weight: 500;
    
  }
`;
