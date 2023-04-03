import { Grid } from '@mui/material';
import { HeaderButton } from 'components/organization/wrapper/styles';
import styled from 'styled-components';
import palette from 'theme/palette';

export const Image = styled.img`
  max-height: 14rem;
  width: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: all 0.3s ease;
`;

export const CardWrapper = styled(Grid)`
  && {
    padding: 14px;
    justify-content: space-between;
    border-radius: 12px;
    position: relative;
    background: ${palette.grey900};
    transition: all 0.3s ease;
    &:hover {
      border: 1px solid ${palette.blue20};
      ${HeaderButton} {
        background: linear-gradient(270deg, ${palette.highlightBlue} 0%, ${palette.highlightPurple} 100%);
      }
      ${Image} {
        transform: scale(1.4);
      }
    }
  }
`;
