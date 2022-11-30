import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import PlusIcon from 'components/Icons/plus';
import styled from 'styled-components';
import palette from 'theme/palette';
import { useCheckOrgPermission } from 'utils/hooks';

export interface ICreateButtonProps {
  onClick: () => unknown;
  text: string;
}

const Icon = () => (
  <Grid
    container
    alignItems="center"
    justifyContent="center"
    width="30px"
    height="30px"
    borderRadius="30px"
    bgcolor={palette.grey87}
  >
    <PlusIcon fill={palette.blue20} />
  </Grid>
);

export const ButtonIcon = styled(ButtonBase)`
  && {
    align-items: center;
    background-color: ${palette.grey87};
    border-radius: 500px;
    display: flex;
    height: 36px;
    position: relative;
    width: fit-content;
    z-index: 2;
    padding-right: 16px;
    padding-left: 2px;
    font-family: 'Space Grotesk';
    color: ${palette.white};
    gap: 8px;
    text-transform: capitalize;
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      transform: translate(-2px, -2px);
      height: 40px;
      width: 100%;
      background: ${palette.black101};
      outline: ${`2px solid ${palette.grey79}`};
      border-radius: 500px;
      z-index: -1;
    }
    &:hover {
      color: ${palette.blue20};
      div {
        svg {
          path {
            fill: ${palette.highlightBlue};
          }
        }
      }
      &:before {
        outline: none;
      }
      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 40px;
        width: 100%;
        filter: blur(10px);
        opacity: 90%;
        transform: translate(-2px, -2px);
        z-index: -2;
        background: linear-gradient(
          270deg,
          ${palette.blue20} -5.62%,
          ${palette.highlightPurple} 45.92%,
          ${palette.highlightBlue} 103.12%
        );
      }
    }
  }
`;

const CreateButton = ({ onClick, text }: ICreateButtonProps) => {
  const hasPermission = useCheckOrgPermission();
  if (!hasPermission) return null;
  return (
    <ButtonIcon onClick={onClick} disableRipple>
      <Icon />
      {`Create ${text}`}
    </ButtonIcon>
  );
};

export default CreateButton;
