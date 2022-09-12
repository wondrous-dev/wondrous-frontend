import styled from 'styled-components';

import palette from 'theme/palette';

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
    color: ${palette.grey50};
    outline: none;
    font-size: 14px;
    background: ${palette.background.default};
    width: 100%;

    ${(props) =>
      props.rightIcon
        ? {
            padding: '15px 50px 15px 15px',
          }
        : null}
  }
`;

export function Field({ ...props }) {
  return (
    <FieldWrapper {...props}>
      {props.icon && props.icon()}
      <FieldInput data-cy={`input-${props.name}`} {...props} />
    </FieldWrapper>
  );
}
