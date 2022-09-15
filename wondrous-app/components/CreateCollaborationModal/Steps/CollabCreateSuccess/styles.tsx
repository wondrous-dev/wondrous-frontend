import styled from 'styled-components';
import { Separator } from 'components/Collaboration/SharedOrgHeader/styles';
import palette from 'theme/palette';

export const OrgSeparator = styled(Separator)`
  && {
    background: ${palette.grey920};
    color: ${palette.white};
    transform: scale(2, 1);
    font-size: 12px;
    border-radius: 100%;
    padding: 2px;
  }
`;
