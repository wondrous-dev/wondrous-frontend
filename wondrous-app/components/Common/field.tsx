import styled from 'styled-components';
import { background, greyColors } from 'theme/colors';

export const FieldWrapper = styled.div`
  position: relative;

  & > svg {
    position: absolute;
    height: 20px;
    width: 20px;
    top: 18px;
    left: 15px;

    ${(props) =>
      props.rightIcon
        ? {
            right: '15px',
            left: 'auto',
          }
        : null}
  }
`;

export const FieldInput = styled.input`
  && {
    padding: 15px 0 15px 50px;
    margin: 5px 0;
    border-radius: 8px;
    border: 0px;
    color: ${greyColors.grey50};
    outline: none;
    font-size: 14px;
    background: ${background};
    width: 100%;

    ${(props) =>
      props.rightIcon
        ? {
            padding: '15px 50px 15px 15px',
          }
        : null}
  }
`;

export const Field = ({ ...props }) => (
  <FieldWrapper {...props}>
    {props.icon && props.icon()}
    <FieldInput {...props} />
  </FieldWrapper>
);
